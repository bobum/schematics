# Authentication Module Test Suite

## Overview
Comprehensive unit tests for the authentication module covering login, logout, and token refresh functionality with 80%+ code coverage.

## Test Coverage

### Login Flow Tests
- ✅ Successful login with valid credentials
- ✅ Rejection of invalid credentials
- ✅ Validation of missing username
- ✅ Validation of missing password
- ✅ Validation of non-string inputs
- ✅ localStorage persistence
- ✅ Token expiry time setting
- ✅ Unique token generation

### Logout Flow Tests
- ✅ Successful logout clearing all session data
- ✅ localStorage cleanup
- ✅ Error handling when no active session
- ✅ Logout after token expiry

### Token Refresh Tests
- ✅ Successful token refresh
- ✅ Error when no refresh token available
- ✅ Token expiry update after refresh
- ✅ User data persistence during refresh
- ✅ localStorage update after refresh

### Authentication Status Tests
- ✅ Status check when not authenticated
- ✅ Status check when authenticated
- ✅ Status check with expired token
- ✅ Status check after logout

### User & Token Access Tests
- ✅ getCurrentUser() behavior
- ✅ getToken() behavior
- ✅ User data structure validation
- ✅ Token format validation

### Token Refresh Check Tests
- ✅ needsRefresh() when not authenticated
- ✅ needsRefresh() with sufficient time remaining
- ✅ needsRefresh() when expiring soon (< 5 minutes)

### Session Restoration Tests
- ✅ Restoration from localStorage
- ✅ Handling of expired sessions
- ✅ Handling of corrupted data
- ✅ Behavior with no stored session

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run with Coverage Report
```bash
npm run test:coverage
```

### Watch Mode (for development)
```bash
npm run test:watch
```

## Code Coverage Goals

The test suite is designed to achieve:
- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+
- **Statements**: 80%+

## Test Structure

```
tests/
├── auth.test.js          # Main test file
└── README.md             # This file
```

## Key Test Scenarios

### 1. Login Flow
Tests validate:
- Credential validation (username, password)
- Input type checking
- Token generation and storage
- User data structure
- Error handling

### 2. Logout Flow
Tests validate:
- Session cleanup
- localStorage cleanup
- State reset
- Error handling for invalid states

### 3. Token Refresh Flow
Tests validate:
- Token regeneration
- Expiry time updates
- User data persistence
- Refresh token requirement
- Storage synchronization

### 4. Session Management
Tests validate:
- Authentication status checks
- Session restoration
- Expired session handling
- Data corruption handling

## Test Utilities

### localStorage Mock
A custom mock implementation is used to simulate browser localStorage:
```javascript
const localStorageMock = {
  getItem: (key) => store[key] || null,
  setItem: (key, value) => { store[key] = value.toString(); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { store = {}; }
};
```

## Best Practices Applied

1. **Isolation**: Each test is independent with fresh state
2. **Cleanup**: beforeEach/afterEach ensure clean test environment
3. **Async Handling**: Proper async/await usage
4. **Error Testing**: Comprehensive error case coverage
5. **Edge Cases**: Tests include boundary conditions
6. **Mocking**: External dependencies (localStorage) are mocked

## Adding New Tests

When adding new functionality to the auth module:

1. Add test cases to appropriate describe block
2. Follow naming convention: `test('description', ...)`
3. Ensure cleanup in afterEach
4. Test both success and failure paths
5. Update this README with new test coverage

## Troubleshooting

### Tests Failing
- Ensure Jest and dependencies are installed
- Check Node.js version (14+ recommended)
- Verify localStorage mock is properly initialized

### Coverage Not Meeting Threshold
- Run `npm run test:coverage` to see detailed report
- Check untested branches in coverage/lcov-report/index.html
- Add tests for uncovered code paths

## Future Enhancements

- [ ] Integration tests with backend API
- [ ] Performance tests for token operations
- [ ] Security tests for token validation
- [ ] Cross-browser compatibility tests
- [ ] Stress tests for concurrent operations
