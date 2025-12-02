# Authentication Module Documentation

## Overview
The Authentication Module provides comprehensive user authentication, session management, and token handling functionality for the Visual Connection Schematics application.

## Features

### Core Functionality
1. **User Authentication**: Secure login with username/password
2. **Session Management**: Token-based session handling
3. **Token Refresh**: Automatic token renewal
4. **Session Persistence**: localStorage-based session restoration
5. **Security**: Token expiry and validation

## API Reference

### Class: AuthenticationModule

#### Constructor
```javascript
const auth = new AuthenticationModule();
```
Creates a new authentication instance with null initial state.

### Methods

#### login(username, password)
Authenticates a user with credentials.

**Parameters:**
- `username` (string): User's username
- `password` (string): User's password

**Returns:** Promise<Object>
```javascript
{
  success: true,
  token: 'access_abc123...',
  refreshToken: 'refresh_def456...',
  user: {
    id: 1,
    username: 'testuser',
    email: 'testuser@example.com'
  },
  expiresIn: 3600
}
```

**Throws:**
- Error: 'Username is required and must be a string'
- Error: 'Password is required and must be a string'
- Error: 'Invalid username or password'

**Example:**
```javascript
try {
  const result = await auth.login('testuser', 'password123');
  console.log('Logged in:', result.user.username);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

#### logout()
Logs out the current user and clears session.

**Returns:** Promise<Object>
```javascript
{
  success: true,
  message: 'Logged out successfully'
}
```

**Throws:**
- Error: 'No active session to logout'

**Example:**
```javascript
try {
  await auth.logout();
  console.log('Logged out successfully');
} catch (error) {
  console.error('Logout failed:', error.message);
}
```

#### refreshAuthToken()
Refreshes the authentication token.

**Returns:** Promise<Object>
```javascript
{
  success: true,
  token: 'access_new789...',
  expiresIn: 3600
}
```

**Throws:**
- Error: 'No refresh token available'

**Example:**
```javascript
if (auth.needsRefresh()) {
  try {
    const result = await auth.refreshAuthToken();
    console.log('Token refreshed');
  } catch (error) {
    console.error('Refresh failed:', error.message);
  }
}
```

#### isAuthenticated()
Checks if user is currently authenticated.

**Returns:** boolean

**Example:**
```javascript
if (auth.isAuthenticated()) {
  console.log('User is authenticated');
} else {
  console.log('User needs to login');
}
```

#### getCurrentUser()
Retrieves current user information.

**Returns:** Object | null
```javascript
{
  id: 1,
  username: 'testuser',
  email: 'testuser@example.com'
}
```

**Example:**
```javascript
const user = auth.getCurrentUser();
if (user) {
  console.log('Current user:', user.username);
}
```

#### getToken()
Retrieves current authentication token.

**Returns:** string | null

**Example:**
```javascript
const token = auth.getToken();
if (token) {
  // Use token for API calls
  fetch('/api/data', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
```

#### needsRefresh()
Checks if token needs refresh (expires in < 5 minutes).

**Returns:** boolean

**Example:**
```javascript
if (auth.needsRefresh()) {
  await auth.refreshAuthToken();
}
```

#### restoreSession()
Restores session from localStorage.

**Returns:** boolean - true if session was restored and valid

**Example:**
```javascript
// On app initialization
if (auth.restoreSession()) {
  console.log('Session restored');
} else {
  console.log('No valid session found');
}
```

## Usage Examples

### Complete Login Flow
```javascript
const auth = new AuthenticationModule();

// Try to restore existing session
if (!auth.restoreSession()) {
  // No valid session, prompt for login
  try {
    const result = await auth.login('username', 'password');
    console.log('Logged in as:', result.user.username);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}
```

### Automatic Token Refresh
```javascript
// Check token status periodically
setInterval(async () => {
  if (auth.isAuthenticated() && auth.needsRefresh()) {
    try {
      await auth.refreshAuthToken();
      console.log('Token refreshed automatically');
    } catch (error) {
      console.error('Auto-refresh failed:', error.message);
      // Redirect to login
    }
  }
}, 60000); // Check every minute
```

### Protected API Calls
```javascript
async function fetchProtectedData() {
  if (!auth.isAuthenticated()) {
    throw new Error('User not authenticated');
  }

  const token = auth.getToken();
  const response = await fetch('/api/protected', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.status === 401) {
    // Token expired, try refresh
    await auth.refreshAuthToken();
    return fetchProtectedData(); // Retry
  }

  return response.json();
}
```

## Security Considerations

### Token Storage
- Tokens are stored in localStorage
- Clear tokens on logout
- Validate token expiry before use

### Best Practices
1. **Always validate input**: Username and password are validated
2. **Check authentication**: Use `isAuthenticated()` before protected operations
3. **Refresh tokens**: Monitor and refresh tokens before expiry
4. **Handle errors**: Implement proper error handling for all auth operations
5. **Clear sessions**: Always logout when user leaves

### Token Expiry
- Access tokens expire in 1 hour
- Tokens should be refreshed when `needsRefresh()` returns true
- Expired tokens are automatically detected by `isAuthenticated()`

## Testing

See [tests/README.md](../tests/README.md) for comprehensive test documentation.

Run tests:
```bash
npm test
```

Run with coverage:
```bash
npm run test:coverage
```

## Error Handling

All methods use Promises and can be handled with try/catch or .catch():

```javascript
// Using async/await
try {
  await auth.login(username, password);
} catch (error) {
  if (error.message.includes('Invalid')) {
    // Handle invalid credentials
  } else {
    // Handle other errors
  }
}

// Using promises
auth.login(username, password)
  .then(result => console.log('Success'))
  .catch(error => console.error('Error:', error));
```

## Browser Compatibility

Requires:
- localStorage support
- Promise support (or polyfill)
- ES6 classes support (or transpilation)

## Future Enhancements

- [ ] Multi-factor authentication
- [ ] Biometric authentication support
- [ ] OAuth integration
- [ ] Remember me functionality
- [ ] Password strength validation
- [ ] Account lockout after failed attempts
- [ ] Session timeout warnings
