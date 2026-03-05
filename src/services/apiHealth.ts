import config from './config'

class ApiHealthService {
  isAvailable: boolean | null
  lastCheck: number | null
  checkTimeout: number

  constructor() {
    this.isAvailable = null
    this.lastCheck = null
    this.checkTimeout = 5000 // 5 second timeout
  }

  async checkApiHealth(): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeoutId = window.setTimeout(
        () => controller.abort(),
        this.checkTimeout
      )

      const response = await fetch(config.getApiUrl('/api/health'), {
        method: 'GET',
        signal: controller.signal,
      })

      window.clearTimeout(timeoutId)

      if (response.ok) {
        this.isAvailable = true
        this.lastCheck = Date.now()
        return true
      } else {
        this.isAvailable = false
        this.lastCheck = Date.now()
        return false
      }
    } catch (error) {
      console.error('API health check failed:', error)
      this.isAvailable = false
      this.lastCheck = Date.now()
      return false
    }
  }

  getAvailability(): boolean | null {
    return this.isAvailable
  }

  getLastCheck(): number | null {
    return this.lastCheck
  }

  clearCache(): void {
    this.isAvailable = null
    this.lastCheck = null
  }
}

export default new ApiHealthService()
