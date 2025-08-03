import { jwtDecode } from 'jwt-decode';
import config from './config.js';

const TOKEN_KEY = 'adminToken';

export const authService = {
  async login(password) {
    try {
      const response = await fetch(config.getApiUrl('/api/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        throw new Error('Invalid password');
      }

      const { token } = await response.json();
      localStorage.setItem(TOKEN_KEY, token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        // Token expired
        this.logout();
        return null;
      }
      return token;
    } catch (e) {
      // Invalid token
      this.logout();
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getToken();
  }
}; 