import type { ExperienceJob } from '../../../types'
import { formatEnumValue } from '../../../utils/formatters'

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

const parseYearMonth = (
  date: string
): { dateTime: string; label: string } | null => {
  const trimmed = date?.trim() ?? ''
  const match = trimmed.match(/^(\d{4})-(\d{1,2})/)
  if (!match) return trimmed ? { dateTime: trimmed, label: trimmed } : null
  const month = Number.parseInt(match[2], 10)
  if (month < 1 || month > 12) return { dateTime: trimmed, label: trimmed }
  const monthPadded = String(month).padStart(2, '0')
  return {
    dateTime: `${match[1]}-${monthPadded}`,
    label: `${MONTH_LABELS[month - 1]} ${match[1]}`,
  }
}

export type ExperiencePeriodEnd =
  | { dateTime: string; label: string }
  | 'present'

export type ExperiencePeriod = {
  start: { dateTime: string; label: string }
  end?: ExperiencePeriodEnd
}

/** Structured start/end for semantic `<time>` elements. */
export const formatExperiencePeriod = (
  startDate: string,
  endDate?: string,
  isCurrent?: boolean
): ExperiencePeriod | null => {
  const start = parseYearMonth(startDate)
  if (!start) return null

  if (isCurrent) {
    return { start, end: 'present' }
  }

  const end = endDate?.trim() ? parseYearMonth(endDate) : null
  return end ? { start, end } : { start }
}

export type JobLocationParts = {
  workMode?: string
  place?: string
}

export const parseJobLocation = (job: ExperienceJob): JobLocationParts => {
  const workMode = formatEnumValue(job.location ?? '') || undefined
  let place: string | undefined
  if (job.city && job.country) {
    place = `${job.city}, ${job.country}`
  } else if (job.city) {
    place = job.city
  } else if (job.country) {
    place = job.country
  }
  return { workMode, place }
}
