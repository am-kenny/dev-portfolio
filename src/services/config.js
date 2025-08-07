/**
 * Configuration service for API endpoints
 * Uses environment variables for API hostname and port
 */

const getApiBaseUrl = () => {
  // Check for environment variables first
  const apiHostname = import.meta.env.VITE_API_HOSTNAME || import.meta.env.API_HOSTNAME;
  const apiPort = import.meta.env.VITE_API_PORT || import.meta.env.API_PORT;

  // If both hostname and port are provided, use them
  if (apiHostname && apiPort) {
    return `http://${apiHostname}:${apiPort}`;
  }
  
  // If only hostname is provided, assume default port 3001
  if (apiHostname) {
    return `http://${apiHostname}:3001`;
  }
  
  // If only port is provided, assume localhost
  if (apiPort) {
    return `http://localhost:${apiPort}`;
  }
  
  // Default fallback for development
  return 'http://localhost:3001';
};

export const config = {
  apiBaseUrl: getApiBaseUrl(),
  
  // API endpoints
  endpoints: {
    login: '/api/login',
    portfolio: '/api/portfolio',
    linkedin: '/api/linkedin',
    health: '/api/health',
    resetData: '/api/reset-data',
    // New skills endpoints
    skillsStructure: '/api/portfolio/skills/structure',
    skillsFlat: '/api/portfolio/skills/flat',
    skillsCategorization: '/api/linkedin/configure-categorization'
  },
  
  // Get full URL for an endpoint
  getApiUrl(endpoint) {
    return `${this.apiBaseUrl}${endpoint}`;
  },
  
  // Get all API URLs
  getApiUrls() {
    const urls = {};
    Object.entries(this.endpoints).forEach(([key, endpoint]) => {
      urls[key] = this.getApiUrl(endpoint);
    });
    return urls;
  }
};

export default config; 