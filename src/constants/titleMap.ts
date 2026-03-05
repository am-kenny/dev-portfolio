const applicationName = 'Portfolio'

export const pageTitles: Record<string, string> = {
  '/': `${applicationName}`,
  '/admin': `Admin - ${applicationName}`,
  '/admin/login': `Login - Admin - ${applicationName}`,
  '/debug': `Debug - ${applicationName}`,
  '*': `Page not found - ${applicationName}`,
}
