import React from 'react';

// PUBLIC_INTERFACE
const ProjectList = ({ projects, onProjectSelect, onRefresh }) => {
  /**
   * Component for displaying list of projects
   * @param {Array} projects - List of projects
   * @param {Function} onProjectSelect - Callback when project is selected
   * @param {Function} onRefresh - Callback to refresh projects
   * @returns {React.Component} ProjectList component
   */
  
  return (
    <div className="project-list">
      <div className="page-header">
        <h2>Select a Project</h2>
        <button onClick={onRefresh} className="btn btn-secondary">
          Refresh Projects
        </button>
      </div>
      
      {projects.length === 0 ? (
        <div className="empty-state">
          <p>No projects found. Make sure you have access to Jira projects.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="project-card"
              onClick={() => onProjectSelect(project)}
            >
              <div className="project-header">
                <h3>{project.name}</h3>
                <span className="project-key">{project.jira_project_key}</span>
              </div>
              
              <div className="project-details">
                {project.description && (
                  <p className="project-description">{project.description}</p>
                )}
                
                <div className="project-meta">
                  {project.project_type && (
                    <span className="project-type">Type: {project.project_type}</span>
                  )}
                  {project.lead_name && (
                    <span className="project-lead">Lead: {project.lead_name}</span>
                  )}
                </div>
              </div>
              
              <div className="project-actions">
                <button className="btn btn-primary">
                  Select Project
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
