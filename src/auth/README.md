# Authentication Module

## Overview

Comprehensive authentication module providing secure user authentication, session management, and token-based authorization.

## Features

- **Login Flow**: Secure user authentication with credential validation
- **Logout Flow**: Complete session cleanup and token invalidation
- **Token Refresh**: Automatic token renewal for uninterrupted sessions
- **Session Management**: Persistent sessions with localStorage
- **Token Expiry Management**: Automatic expiry detection and refresh suggestions

## Installation

```bash
npm install
```

## Usage

### Basic Authentication

```javascript
const AuthenticationService = require('./authentication');

const authService = new AuthenticationService();

// Login
try {
  const result = await authService.login('username', 'password');
  console.log('Login successful:', result.user);
  console.log('Access Token:', result.accessToken);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Check authentication status
if (authService.isAuthenticated()) {
  console.log('User is authenticated');
  const user = authService.getCurrentUser();
  console.log('Current user:', user.username);
}

// Logout
try {
  const result = authService.logout();
  console.log(result.message);
} catch (error) {
  console.error('Logout failed:', error.message);
}
```

### Token Management

```javascript
// Check if token needs refresh
if (authService.needsTokenRefresh()) {
  try {
    const result = await authService.refreshAccessToken();
    console.log('Token refreshed:', result.accessToken);
  } catch (error) {
    console.error('Token refresh failed:', error.message);
  }
}

// Get current access token
const token = authService.getAccessToken();
console.log('Current token:', token);
```

### Session Persistence

```javascript
// Restore session on page load
const authService = new AuthenticationService();
if (authService.restoreSession()) {
  console.log('Session restored successfully');
  console.log('User:', authService.getCurrentUser().username);
} else {
  console.log('No valid session found');
}
```

## API Reference

### `login(username, password)`

Authenticates a user with credentials.

**Parameters:**
- `username` (string): User's username (minimum 3 characters)
- `password` (string): User's password (minimum 6 characters)

**Returns:** Promise<Object>
```javascript
{
  success: true,
  user: {
    id: '12345',
    username: 'testuser',
    email: 'testuser@example.com',
    role: 'user'
  },
  accessToken: 'access_token_here',
  message: 'Login successful'
}
```

**Throws:**
- `Error`: If credentials are missing or invalid
- `Error`: If authentication fails

### `logout()`

Logs out the current user and clears all session data.

**Returns:** Object
```javascript
{
  success: true,
  message: 'User username logged out successfully'
}
```

**Throws:**
- `Error`: If no user is currently logged in

### `refreshAccessToken()`

Refreshes the access token using the refresh token.

**Returns:** Promise<Object>
```javascript
{
  success: true,
  accessToken: 'new_access_token',
  message: 'Token refreshed successfully'
}
```

**Throws:**
- `Error`: If no refresh token is available
- `Error`: If no active session exists
- `Error`: If token refresh fails

### `isAuthenticated()`

Checks if the current session is valid.

**Returns:** boolean
- `true` if user is authenticated with valid token
- `false` otherwise

### `getCurrentUser()`

Gets the current authenticated user.

**Returns:** Object | null
- User object if authenticated
- `null` if not authenticated

### `getAccessToken()`

Gets the current access token.

**Returns:** string | null
- Access token if authenticated
- `null` if not authenticated

### `needsTokenRefresh()`

Checks if the token expires within 5 minutes.

**Returns:** boolean
- `true` if token needs refresh
- `false` otherwise

### `restoreSession()`

Restores session from localStorage.

**Returns:** boolean
- `true` if session restored successfully
- `false` if no valid session found

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Verbose Output

```bash
npm run test:verbose
```

## Test Coverage

The authentication module has comprehensive unit tests with **80%+ code coverage** across:

### Test Suites:

1. **Login Flow Tests** (10 tests)
   - Successful login with valid credentials
   - Session data storage
   - localStorage persistence
   - Username/password validation
   - Error handling for invalid credentials
   - Token expiry setup

2. **Logout Flow Tests** (5 tests)
   - Successful logout
   - Session data cleanup
   - localStorage clearing
   - Authentication state reset
   - Error handling for logout without session

3. **Token Refresh Flow Tests** (7 tests)
   - Successful token refresh
   - Token expiry updates
   - localStorage synchronization
   - Error handling for missing tokens
   - Session maintenance during refresh
   - Graceful failure handling

4. **Session Management Tests** (6 tests)
   - Authentication state checking
   - Session restoration from localStorage
   - Expired session handling
   - Corrupted data handling

5. **Token Expiry Management Tests** (3 tests)
   - Token refresh detection
   - Expiry time validation

6. **Getter Methods Tests** (4 tests)
   - getCurrentUser() functionality
   - getAccessToken() functionality

7. **Edge Cases Tests** (3 tests)
   - Multiple login attempts
   - Rapid token refresh requests
   - Token uniqueness

**Total: 38 comprehensive unit tests**

## Security Features

- Input validation for username and password
- Token-based authentication (simulated)
- Automatic session expiry (1 hour)
- Secure token refresh mechanism
- Session cleanup on logout
- Protection against corrupted session data

## Session Management

- Sessions are stored in localStorage for persistence
- Automatic session restoration on page reload
- Expired sessions are automatically cleaned up
- Token expiry is tracked and validated

## Error Handling

All methods include comprehensive error handling:

- Missing or invalid credentials
- Expired tokens
- Failed authentication attempts
- Network errors (simulated)
- Corrupted session data
- Missing refresh tokens

## Configuration

### Session Timeout

Default session timeout is 1 hour (3600000 milliseconds). This can be modified in the constructor:

```javascript
const authService = new AuthenticationService();
authService.sessionTimeout = 7200000; // 2 hours
```

### Token Refresh Threshold

Tokens are suggested for refresh when they expire within 5 minutes. This is configurable in the `needsTokenRefresh()` method.

## Browser Compatibility

- Requires localStorage support
- Compatible with modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ syntax (requires transpilation for older browsers)

## Best Practices

1. **Check authentication status** before protected operations
2. **Refresh tokens proactively** before they expire
3. **Handle logout errors gracefully** (user may already be logged out)
4. **Restore sessions** on application startup
5. **Clear sessions** on critical errors

## Example: Complete Authentication Flow

```javascript
const AuthenticationService = require('./authentication');

class App {
  constructor() {
    this.authService = new AuthenticationService();
    this.initialize();
  }

  initialize() {
    // Try to restore previous session
    if (this.authService.restoreSession()) {
      console.log('Welcome back,', this.authService.getCurrentUser().username);
      this.checkTokenRefresh();
    } else {
      this.showLoginForm();
    }
  }

  async handleLogin(username, password) {
    try {
      const result = await this.authService.login(username, password);
      console.log('Login successful!');
      this.showDashboard();
      this.startTokenRefreshTimer();
    } catch (error) {
      console.error('Login failed:', error.message);
      this.showError(error.message);
    }
  }

  handleLogout() {
    try {
      this.authService.logout();
      console.log('Logged out successfully');
      this.showLoginForm();
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  }

  async checkTokenRefresh() {
    if (this.authService.needsTokenRefresh()) {
      try {
        await this.authService.refreshAccessToken();
        console.log('Token refreshed');
      } catch (error) {
        console.error('Token refresh failed:', error.message);
        this.showLoginForm();
      }
    }
  }

  startTokenRefreshTimer() {
    // Check every minute if token needs refresh
    setInterval(() => this.checkTokenRefresh(), 60000);
  }
}
```

## License

MIT License

## Support

For issues and questions, please refer to the test suite for usage examples.
