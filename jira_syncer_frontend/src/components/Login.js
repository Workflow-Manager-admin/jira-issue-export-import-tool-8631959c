import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { utils } from '../services/api';
import NetworkDiagnostics from './NetworkDiagnostics';

// PUBLIC_INTERFACE
const Login = () => {
  /**
   * Login form component for Jira authentication
   * Automatically redirects to dashboard if user is already authenticated
   * @returns {React.Component} Login component
   */
  const [formData, setFormData] = useState({
    jira_email: '',
    jira_token: '',
    jira_domain: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading">Checking authentication...</div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.jira_email || !formData.jira_token || !formData.jira_domain) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      // Test backend connection first
      const isConnected = await utils.testConnection();
      if (!isConnected) {
        setError(`Unable to connect to backend server (${utils.getApiBaseUrl()}). Please check if the server is running.`);
        setLoading(false);
        return;
      }

      await login(formData);
      // Navigation will be handled by useEffect when isAuthenticated changes
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      if (error.isNetworkError) {
        setError(`Network Error: ${error.message}`);
      } else if (error.isServiceError) {
        setError(`Service Error: ${error.message}`);
      } else if (error.isServerError) {
        setError(`Server Error: ${error.message}`);
      } else {
        setError(
          error.response?.data?.detail || 
          error.message || 
          'Login failed. Please check your credentials and try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Jira Issue Export/Import Tool</h1>
        <h2>Login</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="jira_email">Jira Email:</label>
            <input
              type="email"
              id="jira_email"
              name="jira_email"
              value={formData.jira_email}
              onChange={handleChange}
              required
              placeholder="your.email@company.com"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="jira_token">Jira API Token:</label>
            <input
              type="password"
              id="jira_token"
              name="jira_token"
              value={formData.jira_token}
              onChange={handleChange}
              required
              placeholder="Your Jira API token"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="jira_domain">Jira Domain:</label>
            <input
              type="text"
              id="jira_domain"
              name="jira_domain"
              value={formData.jira_domain}
              onChange={handleChange}
              required
              placeholder="company.atlassian.net"
              disabled={loading}
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary btn-large">
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
        
        <div className="login-help">
          <h3>How to get your Jira API Token:</h3>
          <ol>
            <li>Go to your Jira account settings</li>
            <li>Navigate to Security → API tokens</li>
            <li>Click "Create API token"</li>
            <li>Give it a name and copy the token</li>
            <li>Use this token in the form above</li>
          </ol>
        </div>
        
        {error && error.includes('Network Error') && (
          <NetworkDiagnostics />
        )}
      </div>
    </div>
  );
};

export default Login;
