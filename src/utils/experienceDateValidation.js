/**
 * Experience date validation: start and end dates must not be in the future.
 * Use this logic on the frontend and mirror it on the backend for consistent validation.
 *
 * Backend (pseudo): When validating experience jobs, reject if:
 * - job.startDate (YYYY-MM) > current year-month
 * - job.endDate (YYYY-MM, when present and not current role) > current year-month
 */

/**
 * Current year-month in YYYY-MM format. Dates after this are considered "in the future".
 * @returns {string} e.g. "2025-02"
 */
export const getMaxMonth = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/**
 * @param {string} dateStr - YYYY-MM
 * @returns {boolean} true if dateStr is in the future (after current month)
 */
export const isFutureMonth = (dateStr) => {
  if (!dateStr?.trim()) return false
  return dateStr > getMaxMonth()
}
