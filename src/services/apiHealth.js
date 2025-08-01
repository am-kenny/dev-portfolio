// API Health Check Service
class ApiHealthService {
  constructor() {
    this.isAvailable = null;
    this.lastCheck = null;
    this.checkTimeout = 5000; // 5 second timeout
  }

  // Check if API is available
  async checkApiHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.checkTimeout);
      
      const response = await fetch('/api/health', {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        this.isAvailable = true;
        this.lastCheck = Date.now();
        return true;
      } else {
        this.isAvailable = false;
        this.lastCheck = Date.now();
        return false;
      }
    } catch (error) {
      console.error('API health check failed:', error);
      this.isAvailable = false;
      this.lastCheck = Date.now();
      return false;
    }
  }

  // Get cached availability status
  getAvailability() {
    return this.isAvailable;
  }

  // Get last check time
  getLastCheck() {
    return this.lastCheck;
  }

  // Clear cached status (force re-check)
  clearCache() {
    this.isAvailable = null;
    this.lastCheck = null;
  }
}

export default new ApiHealthService(); 