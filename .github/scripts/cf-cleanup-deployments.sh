#!/usr/bin/env bash
#
# Cloudflare Pages deployment cleanup script.
# Uses env: BRANCH, CF_API_TOKEN, CF_ACCOUNT_ID, CF_PAGES_PROJECT.
# Optional: KEEP_DEPLOYMENT_ID — if set, that deployment for BRANCH is kept; otherwise all for BRANCH are deleted.
# Optional: MODE — "keep-latest" resolves the latest deployment for BRANCH (with retries) and keeps it; otherwise all for BRANCH are deleted.
# Optional: TRIGGERED_AT — ISO 8601 timestamp (e.g. from github.event.head_commit.timestamp); when set, only
#           deployments created after this time are considered, preventing stale deployments from being kept.
#
set -euo pipefail

# Validate required environment variables early and fail fast with clear messages.
: "${CF_API_TOKEN:?CF_API_TOKEN is required}"
: "${CF_ACCOUNT_ID:?CF_ACCOUNT_ID is required}"
: "${CF_PAGES_PROJECT:?CF_PAGES_PROJECT is required}"
: "${BRANCH:?BRANCH is required}"

CF_API="https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${CF_PAGES_PROJECT}/deployments"
readonly CF_API

# Resolves the latest deployment ID for BRANCH, waits for it to finish, then sets KEEP_DEPLOYMENT_ID.
# When TRIGGERED_AT is set, only deployments created after that timestamp are considered, which prevents
# accidentally keeping a stale pre-push deployment.
# Polls until the deployment reaches stage "deploy" with status "success" or "failure".
# Exits 1 if the API fails or the deployment never completes within the allotted attempts.
resolve_latest_deployment_id() {
  local max_attempts=30  # 30 × 15s = up to 7.5 minutes
  local sleep_sec=15
  local attempt
  local tmp
  local http_code
  local body
  local latest_id
  local stage_name
  local stage_status

  tmp="$(mktemp)"
  trap 'rm -f "$tmp"' RETURN

  for ((attempt=1; attempt<=max_attempts; attempt++)); do
    http_code=$(curl -s -o "$tmp" -w "%{http_code}" -H "Authorization: Bearer ${CF_API_TOKEN}" \
      "${CF_API}?page=1&per_page=25")
    body="$(cat "$tmp")"

    if ! echo "$body" | jq -e '.success == true' >/dev/null 2>&1; then
      echo "::error::Cloudflare API error on attempt $attempt: $body" >&2
      exit 1
    fi

    # If TRIGGERED_AT is provided, only consider deployments created after that timestamp.
    # Otherwise fall back to the most recent deployment for the branch.
    if [ -n "${TRIGGERED_AT:-}" ]; then
      latest_id=$(echo "$body" | jq -r \
        --arg branch "$BRANCH" \
        --arg since "$TRIGGERED_AT" \
        '[.result[]
          | select(.deployment_trigger.metadata.branch == $branch)
          | select(.created_on > $since)
        ] | sort_by(.created_on) | last | .id')
    else
      latest_id=$(echo "$body" | jq -r \
        --arg branch "$BRANCH" \
        '[.result[]
          | select(.deployment_trigger.metadata.branch == $branch)
        ] | sort_by(.created_on) | last | .id')
    fi

    if [ -z "$latest_id" ] || [ "$latest_id" = "null" ]; then
      echo "Waiting for deployment to appear (attempt $attempt/$max_attempts)..."
      sleep $sleep_sec
      continue
    fi

    # Deployment exists — check whether it has finished.
    stage_name=$(echo "$body" | jq -r \
      --arg id "$latest_id" \
      '.result[] | select(.id == $id) | .latest_stage.name')
    stage_status=$(echo "$body" | jq -r \
      --arg id "$latest_id" \
      '.result[] | select(.id == $id) | .latest_stage.status')

    echo "Deployment $latest_id — stage: $stage_name, status: $stage_status (attempt $attempt/$max_attempts)"

    if [ "$stage_name" = "deploy" ] && [ "$stage_status" = "success" ]; then
      echo "Deployment finished successfully. Keeping: $latest_id"
      KEEP_DEPLOYMENT_ID=$latest_id
      return 0
    fi

    if [ "$stage_status" = "failure" ]; then
      echo "::warning::Deployment $latest_id failed. Skipping cleanup to avoid data loss."
      # Exit 0 so the cleanup job does not show as failed when the real issue is the build.
      exit 0
    fi

    sleep $sleep_sec
  done

  echo "::error::Deployment for branch '$BRANCH' did not complete after $((max_attempts * sleep_sec / 60)) minutes." >&2
  exit 1
}

# Fetches one page of deployments and ensures the API returned success.
# Outputs the raw JSON to stdout. Exits with 1 and logs the full response if success is false.
fetch_deployments_page() {
  local page=$1
  local tmp
  local http_code
  local body

  tmp="$(mktemp)"
  trap 'rm -f "$tmp"' RETURN
  http_code=$(curl -s -o "$tmp" -w "%{http_code}" -H "Authorization: Bearer ${CF_API_TOKEN}" \
    "${CF_API}?page=${page}&per_page=25")
  body="$(cat "$tmp")"

  if ! echo "$body" | jq -e '.success == true' >/dev/null 2>&1; then
    echo "::error::Cloudflare API error (HTTP ${http_code}): $body" >&2
    exit 1
  fi
  echo "$body"
}

# Paginates through all deployments for BRANCH and deletes each one whose ID is not KEEP_DEPLOYMENT_ID.
# If KEEP_DEPLOYMENT_ID is empty, deletes all deployments for BRANCH.
delete_old_deployments_for_branch() {
  local keep_id="${KEEP_DEPLOYMENT_ID:-__none__}"
  local page=1
  local total_pages
  local response
  local ids
  local id
  local del_tmp
  local del_code
  local del_body

  # Shared tempfile for delete responses; cleaned up on function return.
  del_tmp="$(mktemp)"
  trap 'rm -f "$del_tmp"' RETURN

  while true; do
    response=$(fetch_deployments_page "$page")
    # Deployment IDs for this branch, excluding the one we keep (if any).
    ids=$(echo "$response" | jq -r \
      --arg branch "$BRANCH" \
      --arg keep "$keep_id" \
      '.result[] | select(.deployment_trigger.metadata.branch == $branch) | select(.id != $keep) | .id')

    for id in $ids; do
      del_code=$(curl -s -o "$del_tmp" -w "%{http_code}" -X DELETE -H "Authorization: Bearer ${CF_API_TOKEN}" \
        "${CF_API}/${id}?force=true")
      del_body="$(cat "$del_tmp")"
      if ! echo "$del_body" | jq -e '.success == true' >/dev/null 2>&1; then
        echo "::error::Failed to delete deployment ${id} (HTTP ${del_code}): $del_body" >&2
        exit 1
      fi
      echo "Deleted deployment $id"
      # Small delay to reduce risk of hitting Cloudflare rate limits on DELETE.
      sleep 0.25
    done

    total_pages=$(echo "$response" | jq -r '.result_info.total_pages')
    if [ "$page" -ge "${total_pages:-1}" ]; then
      break
    fi
    page=$((page + 1))
  done
}

# Entry: choose mode and run.
# MODE=keep-latest resolves the latest deployment ID first (for push events),
# anything else deletes all deployments for BRANCH (for branch delete events).
case "${MODE:-delete-all}" in
  keep-latest)
    resolve_latest_deployment_id
    ;;
esac
delete_old_deployments_for_branch
