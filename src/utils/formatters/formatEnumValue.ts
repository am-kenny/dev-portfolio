export const formatEnumValue = (value: string | null | undefined): string => {
  if (!value) return ''
  return value
    .replace('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}
