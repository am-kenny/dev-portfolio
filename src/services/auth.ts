import { jwtDecode } from 'jwt-decode'
import config from './config'

const TOKEN_KEY = 'adminToken'

interface DecodedToken {
  exp?: number
  [claim: string]: unknown
}

export interface AuthService {
  login: (password: string) => Promise<boolean>
  logout: () => void
  getToken: () => string | null
  isAuthenticated: () => boolean
}

export const authService: AuthService = {
  async login(password: string): Promise<boolean> {
    try {
      const response = await fetch(config.getApiUrl('/api/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        throw new Error('Invalid password')
      }

      const { token } = (await response.json()) as { token: string }
      window.localStorage.setItem(TOKEN_KEY, token)
      return true
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  logout(): void {
    window.localStorage.removeItem(TOKEN_KEY)
  },

  getToken(): string | null {
    const token = window.localStorage.getItem(TOKEN_KEY)
    if (!token) return null
    try {
      const decoded = jwtDecode<DecodedToken>(token)
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        this.logout()
        return null
      }
      return token
    } catch {
      this.logout()
      return null
    }
  },

  isAuthenticated(): boolean {
    return this.getToken() !== null
  },
}
