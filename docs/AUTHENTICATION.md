# Authentication Module Documentation

## Overview

The Authentication Module provides a complete authentication system with login, logout, token management, and session persistence.

## Features

### ✅ Login Flow
- Secure credential validation
- Token generation (access + refresh)
- User session creation
- localStorage persistence
- Automatic expiry time setting (1 hour)

### ✅ Logout Flow
- Complete session cleanup
- Token invalidation
- localStorage clearing
- User state reset

### ✅ Token Refresh
- Automatic token renewal
- Refresh token validation
- Extended session lifetime
- Storage synchronization

### ✅ Session Management
- Persistent sessions via localStorage
- Automatic session restoration
- Expiry validation
- Secure session data handling

## API Reference

### Constructor

```javascript
const auth = new AuthenticationModule();
```

Initializes a new authentication instance with null values for all properties.

### Methods

#### `login(username, password)`

Authenticates a user with username and password.

**Parameters:**
- `username` (string): User's username
- `password` (string): User's password

**Returns:** Promise<Object>
```javascript
{
  success: true,
  token: 'tok_...',
  refreshToken: 'tok_...',
  user: {
    id: '12345',
    username: 'testuser',
    email: 'testuser@example.com',
    roles: ['user']
  },
  expiresAt: 1234567890000
}
```

**Example:**
```javascript
try {
  const result = await auth.login('testuser', 'password123');
  console.log('Logged in:', result.user.username);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

#### `logout()`

Logs out the current user and clears all session data.

**Returns:** Promise<Object>
```javascript
{
  success: true,
  message: 'Logged out successfully'
}
```

**Example:**
```javascript
const result = await auth.logout();
console.log(result.message);
```

#### `refreshAuthToken()`

Refreshes the authentication token using the refresh token.

**Returns:** Promise<Object>
```javascript
{
  success: true,
  token: 'tok_...',
  expiresAt: 1234567890000
}
```

**Example:**
```javascript
try {
  const result = await auth.refreshAuthToken();
  console.log('Token refreshed:', result.token);
} catch (error) {
  console.error('Refresh failed:', error.message);
}
```

#### `isAuthenticated()`

Checks if the user is currently authenticated.

**Returns:** boolean

**Example:**
```javascript
if (auth.isAuthenticated()) {
  console.log('User is logged in');
} else {
  console.log('User is not logged in');
}
```

#### `getCurrentUser()`

Retrieve the current user information.

**Returns:** Object | null

**Example:**
```javascript
const user = auth.getCurrentUser();
if (user) {
  console.log('Current user:', user.username);
}
```

#### `getToken()`

Get the current authentication token.

**Returns:** string | null

**Example:**
```javascript
const token = auth.getToken();
if (token) {
  // Use token in API calls
  fetch('/api/data', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
```

#### `needsTokenRefresh()`

Check if the token will expire within 5 minutes.

**Returns:** boolean

**Example:**
```javascript
if (auth.needsTokenRefresh()) {
  await auth.refreshAuthToken();
}
```

#### `restoreSession()`

Restore a previously saved session from localStorage.

**Returns:** boolean

**Example:**
```javascript
const restored = auth.restoreSession();
if (restored) {
  console.log('Session restored successfully');
} else {
  console.log('No valid session to restore');
}
```

## Usage Examples

### Basic Login Flow

```javascript
const auth = new AuthenticationModule();

// Try to restore previous session
if (!auth.restoreSession()) {
  // No valid session, show login form
  const result = await auth.login('username', 'password');
  console.log('Logged in as:', result.user.username);
}
```

### Protected Route Check

```javascript
function requireAuth() {
  if (!auth.isAuthenticated()) {
    // Redirect to login
    window.location.href = '/login';
    return false;
  }
  return true;
}
```

### Automatic Token Refresh

```javascript
// Check and refresh token periodically
setInterval(async () => {
  if (auth.isAuthenticated() && auth.needsTokenRefresh()) {
    try {
      await auth.refreshAuthToken();
      console.log('Token refreshed automatically');
    } catch (error) {
      console.error('Auto-refresh failed:', error);
      // Redirect to login
    }
  }
}, 60000); // Check every minute
```

### API Request with Token

```javascript
async function apiRequest(endpoint, options = {}) {
  if (!auth.isAuthenticated()) {
    throw new Error('Not authenticated');
  }

  const token = auth.getToken();
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  return fetch(endpoint, { ...options, headers });
}
```

## Security Considerations

1. **Token Storage**: Tokens are stored in localStorage. For production use, consider using httpOnly cookies for enhanced security.

2. **HTTPS Only**: Always use HTTPS in production to protect tokens in transit.

3. **Token Expiry**: Tokens expire after 1 hour. Implement automatic refresh or require re-authentication.

4. **Refresh Token**: The refresh token should have a longer lifetime and be properly secured.

5. **Input Validation**: Always validate user inputs on both client and server side.

## Error Handling

All async methods can throw errors. Always use try-catch:

```javascript
try {
  await auth.login(username, password);
} catch (error) {
  if (error.message === 'Invalid credentials') {
    // Show error to user
  } else {
    // Handle other errors
  }
}
```

## Testing

Comprehensive unit tests are provided in `tests/auth.test.js`. Run tests with:

```bash
npm test
```

See `tests/README.md` for detailed test documentation.

## Browser Compatibility

Requires:
- localStorage support
- ES6+ (async/await, Promises)
- Modern browsers (Chrome, Firefox, Safari, Edge)

## Node.js Usage

The module can be used in Node.js with a localStorage polyfill:

```javascript
const AuthenticationModule = require('./src/auth');
global.localStorage = require('node-localstorage').LocalStorage;

const auth = new AuthenticationModule();
```
