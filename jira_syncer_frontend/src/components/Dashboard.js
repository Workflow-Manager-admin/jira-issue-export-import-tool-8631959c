import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectsAPI } from '../services/api';
import ProjectList from './ProjectList';
import ProjectDetails from './ProjectDetails';

// PUBLIC_INTERFACE
const Dashboard = () => {
  /**
   * Main dashboard component for project management
   * @returns {React.Component} Dashboard component
   */
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getProjects();
      setProjects(response.projects);
    } catch (error) {
      setError('Failed to load projects');
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>Jira Issue Export/Import Tool</h1>
        </div>
        <div className="navbar-user">
          <span>Welcome, {user?.jira_email}</span>
          <span className="domain">({user?.jira_domain})</span>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </nav>
      
      <main className="main-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {!selectedProject ? (
          <ProjectList 
            projects={projects} 
            onProjectSelect={handleProjectSelect}
            onRefresh={loadProjects}
          />
        ) : (
          <ProjectDetails 
            project={selectedProject} 
            onBack={handleBackToProjects}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
