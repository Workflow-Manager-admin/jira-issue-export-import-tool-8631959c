import axios from 'axios';

// Base API URL - should be configurable based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for potentially slow Jira API responses
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Ensure we don't send cookies that might interfere
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('session_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      // Network error - no response from server
      const networkError = new Error('Network Error: Unable to connect to server. Please check your internet connection and try again.');
      networkError.isNetworkError = true;
      networkError.originalError = error;
      return Promise.reject(networkError);
    }
    
    // Handle specific HTTP status codes
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('session_token');
      localStorage.removeItem('user_session');
      window.location.href = '/login';
    } else if (error.response?.status === 503) {
      // Service unavailable - likely backend is down
      const serviceError = new Error('Service temporarily unavailable. Please try again later.');
      serviceError.isServiceError = true;
      serviceError.originalError = error;
      return Promise.reject(serviceError);
    } else if (error.response?.status >= 500) {
      // Server error
      const serverError = new Error('Server error occurred. Please try again later.');
      serverError.isServerError = true;
      serverError.originalError = error;
      return Promise.reject(serverError);
    }
    
    return Promise.reject(error);
  }
);

// Authentication API methods
export const authAPI = {
  // PUBLIC_INTERFACE
  login: async (credentials) => {
    /**
     * Login user with Jira credentials
     * @param {Object} credentials - {jira_email, jira_token, jira_domain}
     * @returns {Promise} Response with session token
     */
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.session_token) {
      localStorage.setItem('session_token', response.data.session_token);
      localStorage.setItem('user_session', JSON.stringify({
        jira_email: credentials.jira_email,
        jira_domain: credentials.jira_domain,
        expires_at: response.data.expires_at
      }));
    }
    return response.data;
  },

  // PUBLIC_INTERFACE
  logout: async () => {
    /**
     * Logout current user
     * @returns {Promise} Response confirmation
     */
    try {
      await api.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('session_token');
      localStorage.removeItem('user_session');
    }
  },

  // PUBLIC_INTERFACE
  refreshSession: async () => {
    /**
     * Refresh current session
     * @returns {Promise} Response confirmation
     */
    return await api.post('/api/auth/refresh');
  },

  // PUBLIC_INTERFACE
  getSessionInfo: async () => {
    /**
     * Get current session information
     * @returns {Promise} Session information
     */
    const response = await api.get('/api/auth/session');
    return response.data;
  }
};

// Projects API methods
export const projectsAPI = {
  // PUBLIC_INTERFACE
  getProjects: async () => {
    /**
     * Get all projects accessible to the user
     * @returns {Promise} List of projects
     */
    const response = await api.get('/api/projects');
    return response.data;
  },

  // PUBLIC_INTERFACE
  getProjectDetails: async (projectKey) => {
    /**
     * Get detailed information about a specific project
     * @param {string} projectKey - Jira project key
     * @returns {Promise} Project details
     */
    const response = await api.get(`/api/projects/${projectKey}`);
    return response.data;
  },

  // PUBLIC_INTERFACE
  getProjectIssueTypes: async (projectKey) => {
    /**
     * Get issue types for a specific project
     * @param {string} projectKey - Jira project key
     * @returns {Promise} List of issue types
     */
    const response = await api.get(`/api/projects/${projectKey}/issue-types`);
    return response.data;
  }
};

// Utility functions
export const utils = {
  // PUBLIC_INTERFACE
  isAuthenticated: () => {
    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    const token = localStorage.getItem('session_token');
    const session = localStorage.getItem('user_session');
    
    if (!token || !session) {
      return false;
    }
    
    try {
      const sessionData = JSON.parse(session);
      const expiresAt = new Date(sessionData.expires_at);
      return expiresAt > new Date();
    } catch {
      return false;
    }
  },

  // PUBLIC_INTERFACE
  getUserSession: () => {
    /**
     * Get current user session data
     * @returns {Object|null} User session data
     */
    const session = localStorage.getItem('user_session');
    if (!session) return null;
    
    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  },

  // PUBLIC_INTERFACE
  testConnection: async () => {
    /**
     * Test connection to backend API
     * @returns {Promise<boolean>} Connection status
     */
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.status === 200;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  },

  // PUBLIC_INTERFACE
  getApiBaseUrl: () => {
    /**
     * Get the configured API base URL
     * @returns {string} API base URL
     */
    return API_BASE_URL;
  }
};

export default api;
