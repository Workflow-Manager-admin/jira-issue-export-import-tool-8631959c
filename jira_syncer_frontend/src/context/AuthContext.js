import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, utils } from '../services/api';

const AuthContext = createContext();

// PUBLIC_INTERFACE
export const useAuth = () => {
  /**
   * Hook to access authentication context
   * @returns {Object} Authentication context value
   */
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// PUBLIC_INTERFACE
export const AuthProvider = ({ children }) => {
  /**
   * Authentication context provider component
   * Manages authentication state and provides auth methods
   * @param {Object} props - Component props
   * @param {React.ReactNode} props.children - Child components
   * @returns {React.Component} AuthProvider component
   */
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authenticated = utils.isAuthenticated();
        const userSession = utils.getUserSession();
        
        setIsAuthenticated(authenticated);
        setUser(userSession);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up interval to check token expiration
    const interval = setInterval(() => {
      const authenticated = utils.isAuthenticated();
      if (!authenticated && isAuthenticated) {
        // Token has expired, log out user
        setIsAuthenticated(false);
        setUser(null);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // PUBLIC_INTERFACE
  const login = async (credentials) => {
    /**
     * Login user with Jira credentials
     * @param {Object} credentials - {jira_email, jira_token, jira_domain}
     * @returns {Promise} Login response
     */
    try {
      const response = await authAPI.login(credentials);
      
      // Set user data
      const userData = {
        jira_email: credentials.jira_email,
        jira_domain: credentials.jira_domain,
        expires_at: response.expires_at
      };
      
      setIsAuthenticated(true);
      setUser(userData);
      
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  // PUBLIC_INTERFACE
  const logout = async () => {
    /**
     * Logout current user
     */
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // PUBLIC_INTERFACE
  const refreshSession = async () => {
    /**
     * Refresh current session
     * @returns {Promise} Refresh response
     */
    try {
      const response = await authAPI.refreshSession();
      return response;
    } catch (error) {
      console.error('Session refresh error:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
