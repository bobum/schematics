# Authentication Module - Unit Tests

## Overview
This directory contains the authentication module and comprehensive unit tests for user authentication functionality.

## Files
- `auth.js` - Authentication module with user management capabilities
- `auth.test.js` - Comprehensive unit test suite

## Authentication Module Features

### Core Functionality
1. **User Registration**
   - Register new users with username, password, and email
   - Email format validation
   - Password strength requirements (minimum 8 characters)
   - Duplicate username prevention

2. **User Login**
   - Authenticate users with username and password
   - Session token generation
   - Account status validation

3. **User Logout**
   - Session invalidation
   - Token-based logout

4. **Token Validation**
   - Verify session tokens
   - Session expiration handling (24-hour sessions)
   - User data retrieval

5. **Password Management**
   - Change password functionality
   - Old password verification
   - Automatic session invalidation on password change

6. **Helper Methods**
   - Check if user exists
   - Get current logged-in user
   - Reset system (useful for testing)

## Test Coverage

The test suite includes 40+ unit tests organized into 6 test suites:

### Test Suite 1: User Registration (8 tests)
- ✓ Successfully register valid user
- ✓ Fail when username is missing
- ✓ Fail when password is missing
- ✓ Fail when email is missing
- ✓ Fail when username already exists
- ✓ Fail with invalid email format
- ✓ Fail with short password
- ✓ Store user in the system

### Test Suite 2: User Login (6 tests)
- ✓ Successfully login with valid credentials
- ✓ Fail when username is missing
- ✓ Fail when password is missing
- ✓ Fail with non-existent user
- ✓ Fail with incorrect password
- ✓ Set current user after successful login

### Test Suite 3: User Logout (5 tests)
- ✓ Successfully logout with valid token
- ✓ Fail when token is missing
- ✓ Fail with invalid token
- ✓ Clear current user after logout
- ✓ Invalidate session token after logout

### Test Suite 4: Token Validation (4 tests)
- ✓ Validate a valid token
- ✓ Fail when token is missing
- ✓ Fail with invalid token
- ✓ Return user data for valid token

### Test Suite 5: Password Change (6 tests)
- ✓ Successfully change password
- ✓ Allow login with new password
- ✓ Fail when username is missing
- ✓ Fail with incorrect old password
- ✓ Fail with short new password
- ✓ Fail for non-existent user

### Test Suite 6: Helper Methods (5 tests)
- ✓ Return current user when logged in
- ✓ Return null when no user is logged in
- ✓ Check if user exists
- ✓ Return false for non-existent user
- ✓ Reset all data

## Running the Tests

### Node.js Environment
```bash
node auth.test.js
```

### Expected Output
The test runner will display:
- Test suite name and individual test results
- Pass/fail status for each test (✓ or ✗)
- Error messages for failed tests
- Final summary with total tests, passed, failed, and success rate

### Example Output
```
============================================================
Test Suite: User Registration
============================================================
✓ should successfully register a valid user
✓ should fail when username is missing
...

============================================================
Test Summary
============================================================
Total Tests: 40
Passed: 40
Failed: 0
Success Rate: 100.00%
============================================================
```

## API Reference

### AuthenticationModule Class

#### Constructor
```javascript
const auth = new AuthenticationModule();
```

#### Methods

**register(username, password, email)**
- Registers a new user
- Returns: `{success: boolean, message: string, user?: object}`

**login(username, password)**
- Authenticates a user
- Returns: `{success: boolean, message: string, token?: string, user?: object}`

**logout(token)**
- Logs out a user
- Returns: `{success: boolean, message: string}`

**validateToken(token)**
- Validates a session token
- Returns: `{valid: boolean, message?: string, user?: object}`

**changePassword(username, oldPassword, newPassword)**
- Changes user password
- Returns: `{success: boolean, message: string}`

**getCurrentUser()**
- Gets current logged-in user
- Returns: `string | null`

**userExists(username)**
- Checks if a user exists
- Returns: `boolean`

**reset()**
- Resets all authentication data
- Returns: `void`

## Security Notes

⚠️ **Important**: This is a demonstration module for testing purposes.

For production use, you should:
- Use proper password hashing (bcrypt, argon2, etc.)
- Implement HTTPS for secure transmission
- Add rate limiting for login attempts
- Use secure session token generation (crypto module)
- Implement CSRF protection
- Add proper database integration
- Implement password reset functionality
- Add two-factor authentication
- Log authentication events for security auditing

## Test Framework

The tests use a custom lightweight test framework included in `auth.test.js` with the following features:
- Test suite organization with `describe()`
- Individual test cases with `it()`
- Assertion methods: `toBe()`, `toEqual()`, `toBeTruthy()`, `toBeFalsy()`, `toBeNull()`, `toContain()`, `toHaveProperty()`
- Test summary reporting

## Integration

To use this authentication module in your application:

```javascript
// Import the module
const AuthenticationModule = require('./auth.js');

// Create an instance
const auth = new AuthenticationModule();

// Register a user
const regResult = auth.register('username', 'password123', 'user@example.com');

// Login
const loginResult = auth.login('username', 'password123');
const token = loginResult.token;

// Validate token
const validation = auth.validateToken(token);

// Logout
auth.logout(token);
```

## Contributing

When adding new authentication features:
1. Implement the feature in `auth.js`
2. Add comprehensive unit tests in `auth.test.js`
3. Update this README with new functionality
4. Ensure all tests pass before committing

## License

This code is part of the Visual Connection Schematics project.
