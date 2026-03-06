export const getMaxMonth = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export const isFutureMonth = (dateStr: string | null | undefined): boolean => {
  if (!dateStr?.trim()) return false
  return dateStr > getMaxMonth()
}
