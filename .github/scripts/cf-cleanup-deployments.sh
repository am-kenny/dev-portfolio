#!/usr/bin/env bash
#
# Cloudflare Pages deployment cleanup script.
# Uses env: BRANCH, CF_API_TOKEN, CF_ACCOUNT_ID, CF_PAGES_PROJECT.
# Optional: KEEP_DEPLOYMENT_ID — if set, that deployment for BRANCH is kept; otherwise all for BRANCH are deleted.
# Optional: MODE — "keep-latest" resolves the latest deployment for BRANCH (with retries) and keeps it; otherwise all for BRANCH are deleted.
#
set -euo pipefail

# Validate required environment variables early and fail fast with clear messages.
: "${CF_API_TOKEN:?CF_API_TOKEN is required}"
: "${CF_ACCOUNT_ID:?CF_ACCOUNT_ID is required}"
: "${CF_PAGES_PROJECT:?CF_PAGES_PROJECT is required}"
: "${BRANCH:?BRANCH is required}"

CF_API="https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${CF_PAGES_PROJECT}/deployments"
readonly CF_API

# Resolves the latest deployment ID for BRANCH with retries (for use after a new deploy).
# Relies on Cloudflare returning deployments in reverse-chronological order (newest first),
# so page=1 always contains the most recent deployment.
# Sets KEEP_DEPLOYMENT_ID (global) as a side effect and returns; exits 1 if the API fails
# or the deployment never appears.
resolve_latest_deployment_id() {
  local max_attempts=5
  local sleep_sec=10
  local attempt
  local tmp
  local http_code
  local body
  local latest_id

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
    latest_id=$(echo "$body" | jq -r --arg branch "$BRANCH" \
      '[.result[] | select(.deployment_trigger.metadata.branch == $branch)] | sort_by(.created_on) | last | .id')
    if [ -n "$latest_id" ] && [ "$latest_id" != "null" ]; then
      echo "Keeping deployment: $latest_id"
      KEEP_DEPLOYMENT_ID=$latest_id
      return 0
    fi
    if [ "$attempt" -lt "$max_attempts" ]; then
      echo "Latest deployment for branch not found yet (attempt $attempt/$max_attempts), retrying in ${sleep_sec}s..."
      sleep $sleep_sec
    fi
  done
  echo "::error::Latest deployment for branch '$BRANCH' never appeared after $max_attempts attempts. Cloudflare may not have registered the new deployment in time." >&2
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
