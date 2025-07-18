import React, { useState } from 'react';
import { utils } from '../services/api';

// PUBLIC_INTERFACE
const NetworkDiagnostics = () => {
  /**
   * Network diagnostics component for troubleshooting connection issues
   * @returns {React.Component} NetworkDiagnostics component
   */
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    setTestResult(null);

    const results = {
      backendUrl: utils.getApiBaseUrl(),
      backendConnection: false,
      timestamp: new Date().toISOString(),
      errors: []
    };

    try {
      // Test backend connection
      const isConnected = await utils.testConnection();
      results.backendConnection = isConnected;
      
      if (!isConnected) {
        results.errors.push('Backend server is not accessible');
      }
    } catch (error) {
      results.errors.push(`Connection test failed: ${error.message}`);
    }

    setTestResult(results);
    setTesting(false);
  };

  return (
    <div className="network-diagnostics">
      <h3>Network Diagnostics</h3>
      <button 
        onClick={runDiagnostics} 
        disabled={testing}
        className="btn btn-secondary"
      >
        {testing ? 'Running Diagnostics...' : 'Test Connection'}
      </button>
      
      {testResult && (
        <div className="diagnostic-results" style={{ marginTop: '1rem' }}>
          <h4>Test Results</h4>
          <div className="result-item">
            <strong>Backend URL:</strong> {testResult.backendUrl}
          </div>
          <div className="result-item">
            <strong>Backend Connection:</strong> 
            <span className={testResult.backendConnection ? 'success' : 'error'}>
              {testResult.backendConnection ? ' ✓ Connected' : ' ✗ Failed'}
            </span>
          </div>
          <div className="result-item">
            <strong>Test Time:</strong> {testResult.timestamp}
          </div>
          
          {testResult.errors.length > 0 && (
            <div className="error-list">
              <strong>Errors:</strong>
              <ul>
                {testResult.errors.map((error, index) => (
                  <li key={index} className="error-item">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <style jsx>{`
        .network-diagnostics {
          background-color: var(--bg-secondary);
          padding: 1rem;
          border-radius: var(--border-radius);
          margin-top: 1rem;
        }
        
        .diagnostic-results {
          background-color: var(--bg-primary);
          padding: 1rem;
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
        }
        
        .result-item {
          margin: 0.5rem 0;
        }
        
        .success {
          color: var(--success-color);
        }
        
        .error {
          color: var(--error-color);
        }
        
        .error-list {
          margin-top: 1rem;
        }
        
        .error-item {
          color: var(--error-color);
          margin: 0.25rem 0;
        }
      `}</style>
    </div>
  );
};

export default NetworkDiagnostics;
