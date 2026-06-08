import type {
  ExperienceCompany,
  ExperienceCompanyIcon,
  ExperienceJob,
} from '../../../types'

const asString = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (value == null) return ''
  return String(value)
}

const asOptionalString = (value: unknown): string | undefined => {
  const trimmed = asString(value).trim()
  return trimmed || undefined
}

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []

const parseCompanyIcon = (
  iconRaw: unknown
): ExperienceCompanyIcon | undefined => {
  if (!iconRaw || typeof iconRaw !== 'object') return undefined

  const icon = iconRaw as Record<string, unknown>
  const url = asOptionalString(icon.url)
  if (!url) return undefined

  const rounded = icon.rounded !== false

  return { url, rounded }
}

/** Parses nested `company: { name, icon? }`. */
export const parseExperienceCompany = (
  raw: Record<string, unknown>
): ExperienceCompany => {
  const companyRaw = raw.company

  if (!companyRaw || typeof companyRaw !== 'object') {
    return { name: '' }
  }

  const company = companyRaw as Record<string, unknown>
  const name = asString(company.name).trim()
  const icon = parseCompanyIcon(company.icon)
  return { name, icon }
}

/** Stable React key for a job (no server id in JSON). */
export const experienceJobKey = (job: ExperienceJob): string =>
  `${job.company.name}-${job.startDate}-${job.title}`

/** Required fields for a job card (title, company.name, startDate). */
export const getExperienceJobDisplayFailure = (
  job: ExperienceJob
): string | null => {
  const missing: string[] = []
  if (!job.title.trim()) missing.push('title')
  if (!job.company.name.trim()) missing.push('company.name')
  if (!job.startDate.trim()) missing.push('startDate')
  return missing.length
    ? `missing required field(s): ${missing.join(', ')}`
    : null
}

/** True when a job has enough data to render a card without empty shells. */
export const isDisplayableExperienceJob = (job: ExperienceJob): boolean =>
  getExperienceJobDisplayFailure(job) == null

/**
 * Coerces partial experience JSON into a safe ExperienceJob.
 * Returns null for non-objects.
 */
export const normalizeExperienceJob = (job: unknown): ExperienceJob | null => {
  if (!job || typeof job !== 'object') return null

  const raw = job as Record<string, unknown>

  return {
    title: asString(raw.title),
    company: parseExperienceCompany(raw),
    startDate: asString(raw.startDate),
    endDate: asOptionalString(raw.endDate),
    isCurrent: raw.isCurrent === true,
    location: asOptionalString(raw.location),
    country: asOptionalString(raw.country),
    city: asOptionalString(raw.city),
    description: asOptionalString(raw.description),
    achievements: asStringArray(raw.achievements),
    skills: asStringArray(raw.skills),
  }
}

const logDroppedExperienceJob = (
  index: number,
  reason: string,
  raw?: unknown
): void => {
  if (!import.meta.env.DEV) return
  console.warn(
    `[experience] Dropped job at index ${index}: ${reason}`,
    raw ?? '(no raw value)'
  )
}

export const normalizeExperienceJobs = (jobs: unknown): ExperienceJob[] => {
  if (!Array.isArray(jobs)) {
    if (import.meta.env.DEV && jobs != null) {
      console.warn(
        '[experience] Expected experience.jobs to be an array, got:',
        jobs
      )
    }
    return []
  }

  const displayable: ExperienceJob[] = []

  jobs.forEach((raw, index) => {
    const job = normalizeExperienceJob(raw)
    if (!job) {
      logDroppedExperienceJob(index, 'invalid entry (not an object)', raw)
      return
    }
    const displayFailure = getExperienceJobDisplayFailure(job)
    if (displayFailure) {
      logDroppedExperienceJob(index, displayFailure, raw)
      return
    }
    displayable.push(job)
  })

  return displayable
}
