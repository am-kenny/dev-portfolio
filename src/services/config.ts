/**
 * Configuration service for API endpoints
 * Uses environment variables for API hostname and port
 */

const getApiBaseUrl = (): string => {
  const apiHostname = import.meta.env.VITE_API_HOSTNAME
  const apiPort = import.meta.env.VITE_API_PORT

  if (apiHostname && apiPort) {
    return `http://${apiHostname}:${apiPort}`
  }

  if (apiHostname) {
    return `http://${apiHostname}:3001`
  }

  if (apiPort) {
    return `http://localhost:${apiPort}`
  }

  return 'http://localhost:3001'
}

export interface ConfigEndpoints {
  login: string
  portfolio: string
  linkedin: string
  health: string
  contact: string
  resetData: string
  skillsStructure: string
  skillsFlat: string
  skillsCategorization: string
}

export interface AppConfig {
  apiBaseUrl: string
  endpoints: ConfigEndpoints
  getApiUrl: (endpoint: string) => string
  getApiUrls: () => Record<string, string>
}

export const config: AppConfig = {
  apiBaseUrl: getApiBaseUrl(),

  endpoints: {
    login: '/api/login',
    portfolio: '/api/portfolio',
    linkedin: '/api/linkedin',
    health: '/api/health',
    contact: '/api/contact',
    resetData: '/api/reset-data',
    skillsStructure: '/api/portfolio/skills/structure',
    skillsFlat: '/api/portfolio/skills/flat',
    skillsCategorization: '/api/linkedin/configure-categorization',
  },

  getApiUrl(endpoint: string): string {
    return `${this.apiBaseUrl}${endpoint}`
  },

  getApiUrls(): Record<string, string> {
    const urls: Record<string, string> = {}
    Object.entries(this.endpoints).forEach(([key, endpoint]) => {
      urls[key] = this.getApiUrl(endpoint)
    })
    return urls
  },
}

export default config
