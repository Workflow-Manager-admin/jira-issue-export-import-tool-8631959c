import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';

// PUBLIC_INTERFACE
const ProjectDetails = ({ project, onBack }) => {
  /**
   * Component for displaying project details and issue types
   * @param {Object} project - Selected project object
   * @param {Function} onBack - Callback to go back to project list
   * @returns {React.Component} ProjectDetails component
   */
  const [issueTypes, setIssueTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadIssueTypes();
  }, [project]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadIssueTypes = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getProjectIssueTypes(project.jira_project_key);
      setIssueTypes(response.issue_types);
    } catch (error) {
      setError('Failed to load issue types');
      console.error('Error loading issue types:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-details">
      <div className="page-header">
        <button onClick={onBack} className="btn btn-secondary">
          ← Back to Projects
        </button>
        <h2>{project.name}</h2>
        <span className="project-key">{project.jira_project_key}</span>
      </div>
      
      <div className="project-info">
        <div className="info-section">
          <h3>Project Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Project Key:</label>
              <span>{project.jira_project_key}</span>
            </div>
            <div className="info-item">
              <label>Project ID:</label>
              <span>{project.jira_project_id}</span>
            </div>
            {project.project_type && (
              <div className="info-item">
                <label>Type:</label>
                <span>{project.project_type}</span>
              </div>
            )}
            {project.lead_name && (
              <div className="info-item">
                <label>Lead:</label>
                <span>{project.lead_name}</span>
              </div>
            )}
          </div>
          
          {project.description && (
            <div className="info-item">
              <label>Description:</label>
              <p>{project.description}</p>
            </div>
          )}
        </div>
        
        <div className="issue-types-section">
          <h3>Available Issue Types</h3>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="loading">Loading issue types...</div>
          ) : issueTypes.length === 0 ? (
            <div className="empty-state">
              <p>No issue types found for this project.</p>
            </div>
          ) : (
            <div className="issue-types-grid">
              {issueTypes.map((issueType) => (
                <div key={issueType.id} className="issue-type-card">
                  <div className="issue-type-header">
                    {issueType.icon_url && (
                      <img 
                        src={issueType.icon_url} 
                        alt={issueType.name} 
                        className="issue-type-icon"
                      />
                    )}
                    <h4>{issueType.name}</h4>
                    {issueType.subtask && (
                      <span className="subtask-badge">Subtask</span>
                    )}
                  </div>
                  
                  {issueType.description && (
                    <p className="issue-type-description">{issueType.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="project-actions">
          <button className="btn btn-primary" disabled>
            Export Issues (Coming Soon)
          </button>
          <button className="btn btn-secondary" disabled>
            Import Issues (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
