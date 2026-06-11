const applicationName =
  (import.meta.env.VITE_APP_NAME as string | undefined)?.trim() || 'Portfolio'

export const pageTitles: Record<string, string> = {
  '/': applicationName,
  '/debug': `Debug - ${applicationName}`,
  '*': `Page not found - ${applicationName}`,
}
