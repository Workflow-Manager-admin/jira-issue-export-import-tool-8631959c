import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the API service to avoid axios import issues
jest.mock('./services/api', () => ({
  authAPI: {
    login: jest.fn(),
    logout: jest.fn(),
    refreshSession: jest.fn(),
    getSessionInfo: jest.fn(),
  },
  projectsAPI: {
    getProjects: jest.fn(),
    getProjectDetails: jest.fn(),
    getProjectIssueTypes: jest.fn(),
  },
  utils: {
    isAuthenticated: jest.fn(() => false),
    getUserSession: jest.fn(() => null),
    testConnection: jest.fn(() => Promise.resolve(true)),
    getApiBaseUrl: jest.fn(() => 'http://localhost:8000'),
  },
}));

test('renders Jira Issue Export/Import Tool', () => {
  render(<App />);
  const titleElement = screen.getByText(/Jira Issue Export\/Import Tool/i);
  expect(titleElement).toBeInTheDocument();
});
