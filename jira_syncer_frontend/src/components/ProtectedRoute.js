import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
const ProtectedRoute = ({ children }) => {
  /**
   * Protected route component that requires authentication
   * Redirects to login if not authenticated, shows loading while checking
   * @param {Object} props - Component props
   * @param {React.ReactNode} props.children - Child components to render if authenticated
   * @returns {React.Component} ProtectedRoute component
   */
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Verifying authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
