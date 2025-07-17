import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
const Login = () => {
  /**
   * Login form component for Jira authentication
   * @returns {React.Component} Login component
   */
  const [formData, setFormData] = useState({
    jira_email: '',
    jira_token: '',
    jira_domain: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.detail || 'Login failed');
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
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Logging in...' : 'Login'}
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
      </div>
    </div>
  );
};

export default Login;
