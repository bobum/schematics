# Authentication Module Tests

## Overview
Comprehensive unit tests for the authentication module covering all major flows and edge cases.

## Test Coverage

The test suite covers the following areas:

### 1. Login Flow (10 tests)
- Successful login with valid credentials
- Internal state updates after login
- localStorage persistence
- Invalid credentials handling
- Missing credentials validation
- Unique token generation

### 2. Logout Flow (5 tests)
- Successful logout
- State cleanup after logout
- localStorage clearing
- Logout without active session
- Re-login capability after logout

### 3. Token Refresh Flow (5 tests)
- Successful token refresh
- Token update after refresh
- localStorage update
- Refresh without token error handling
- Refresh token persistence

### 4. Authentication Status (4 tests)
- Not authenticated state
- Authenticated with valid token
- Post-logout authentication status
- Expired token handling

### 5. User Management (3 tests)
- Get user when not logged in
- Get user when logged in
- Get user after logout

### 6. Token Management (3 tests)
- Get token when not logged in
- Get token when logged in
- Token format validation

### 7. Token Refresh Check (3 tests)
- Check without login
- Check with fresh token
- Check with expiring token

### 8. Session Restoration (4 tests)
- Restore valid session
- No session to restore
- Expired session handling
- Invalid session data handling

### 9. Edge Cases (3 tests)
- Null username
- Null password
- Undefined credentials

## Running Tests

```bash
npm test
```

Or with coverage:

```bash
npm test -- --coverage
```

## Expected Coverage

Target: 80%+ code coverage

- Statements: >80%
- Branches: >80%
- Functions: >90%
- Lines: >80%

## Test Structure

Tests use Jest framework with the following structure:

- `describe()`: Groups related tests
- `beforeEach()`: Sets up fresh test environment
- `afterEach()`: Cleans up after each test
- `test()`: Individual test cases
- `expect()`: Assertions

## Mock Objects

The tests use a localStorage mock for Node.js environment compatibility:

```javascript
const localStorageMock = {
  getItem: (key) => store[key] || null,
  setItem: (key, value) => { store[key] = value.toString(); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { store = {}; }
};
```

## Test Data

Default test credentials:
- Username: `testuser`
- Password: `password123`

## Continuous Integration

These tests should be run automatically in CI/CD pipeline on:
- Pull request creation
- Before merging to main
- On main branch commits
