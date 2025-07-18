# Network Troubleshooting Guide

## Overview

This guide helps diagnose and resolve network errors in the Jira Issue Export/Import Tool frontend, particularly during login attempts.

## Common Network Error Scenarios

### 1. "Network Error: Unable to connect to server"
**Cause:** Frontend cannot reach the backend server
**Solutions:**
- Verify the backend server is running on the configured port (default: 8000)
- Check the `REACT_APP_API_URL` environment variable
- Ensure no firewall is blocking the connection

### 2. "Service temporarily unavailable"
**Cause:** Backend server is returning 503 status
**Solutions:**
- Check backend server logs for errors
- Verify database connectivity
- Restart the backend service

### 3. "Invalid Jira credentials or domain"
**Cause:** Authentication failure with Jira API
**Solutions:**
- Verify Jira email, token, and domain are correct
- Check that the Jira domain is accessible from the backend server
- Ensure the API token has proper permissions

## Configuration

### Environment Variables

Create a `.env` file in the frontend root directory:

```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_DEBUG=false
```

### Backend Connectivity

The frontend is configured to:
- Route ALL requests through the backend API (no direct Jira calls)
- Use proxy configuration for development
- Implement connection testing before authentication attempts

## API Endpoints

All frontend requests go through these backend endpoints:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/projects` - Get user's projects
- `GET /api/projects/{key}/issue-types` - Get project issue types

## Troubleshooting Tools

### Built-in Network Diagnostics

When network errors occur during login, a diagnostic tool will appear that can:
- Test backend connectivity
- Display the configured API URL
- Show detailed error information
- Provide timestamp of the last test

### Manual Testing

Test backend connectivity manually:

```bash
# Test backend health
curl -X GET http://localhost:8000/health

# Test login endpoint
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"jira_email":"test@example.com","jira_token":"test","jira_domain":"test.atlassian.net"}'
```

## Development vs Production

### Development
- Uses `proxy` configuration in package.json
- Default backend URL: `http://localhost:8000`
- CORS handled by proxy

### Production
- Requires explicit `REACT_APP_API_URL` environment variable
- Must handle CORS on backend
- May require additional network configuration

## Error Handling

The frontend implements comprehensive error handling:

1. **Network Errors**: No response from server
2. **Service Errors**: 503 status codes
3. **Server Errors**: 500+ status codes
4. **Authentication Errors**: 401 status codes (auto-redirect to login)

## Common Issues and Solutions

### Issue: "Failed to fetch"
**Solution:** Check if backend is running and accessible

### Issue: CORS errors in browser console
**Solution:** 
- In development: Verify proxy configuration
- In production: Configure CORS on backend

### Issue: Timeout errors
**Solution:** 
- Increase timeout in api.js (currently 30 seconds)
- Check network latency to Jira API

### Issue: "Module not found" errors
**Solution:** Install missing dependencies:
```bash
npm install axios react-router-dom
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

## Support

For additional support:
1. Check browser developer console for errors
2. Review network tab in developer tools
3. Check backend server logs
4. Use the built-in network diagnostics tool
