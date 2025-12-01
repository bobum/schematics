# Authentication Module - Unit Tests

## Overview
This document describes the comprehensive unit test suite for the Authentication Module. The tests cover all authentication functionality including user registration, login, token validation, logout, password management, and account deactivation.

## Files
- **auth.js** - Main authentication module implementation
- **auth.test.js** - Comprehensive unit test suite

## Test Coverage

The test suite includes **50 unit tests** covering the following areas:

### 1. User Registration (9 tests)
- ✅ Successful registration with valid credentials
- ✅ Validation of required fields (username, password, email)
- ✅ Username length validation (minimum 3 characters)
- ✅ Password length validation (minimum 8 characters)
- ✅ Email format validation
- ✅ Duplicate username prevention
- ✅ Duplicate email prevention

### 2. User Login (7 tests)
- ✅ Successful login with valid credentials
- ✅ Validation of required fields
- ✅ Non-existent user handling
- ✅ Incorrect password handling
- ✅ Inactive account blocking
- ✅ Unique token generation for multiple logins

### 3. Token Validation (4 tests)
- ✅ Valid token validation
- ✅ Missing token rejection
- ✅ Invalid token rejection
- ✅ Expired token handling

### 4. User Logout (3 tests)
- ✅ Successful logout
- ✅ Missing token validation
- ✅ Invalid token handling
- ✅ Token invalidation verification

### 5. Password Management (6 tests)
- ✅ Successful password change
- ✅ Required fields validation
- ✅ New password length validation
- ✅ Current password verification
- ✅ Non-existent user handling
- ✅ Session invalidation after password change

### 6. Account Deactivation (4 tests)
- ✅ Successful account deactivation
- ✅ Username validation
- ✅ Non-existent user handling
- ✅ Session invalidation after deactivation

### 7. User Information (2 tests)
- ✅ Retrieve user information
- ✅ Handle non-existent users
- ✅ Sensitive data exclusion (password)

### 8. Email Validation (2 tests)
- ✅ Valid email format acceptance
- ✅ Invalid email format rejection

### 9. Session Management (1 test)
- ✅ Expired session cleanup

## Running the Tests

### Prerequisites
- Node.js installed (v12 or higher recommended)

### Execute Tests
```bash
node auth.test.js
```

### Expected Output
```
🧪 Running Authentication Module Tests

============================================================
✅ PASS: Registration: Should successfully register a valid user
✅ PASS: Registration: Should reject missing username
... (all tests)

============================================================

📊 Test Results: 50 passed, 0 failed, 50 total
```

## Test Framework

The test suite uses a custom lightweight test framework with the following features:

### Test Runner
- Automatic test discovery and execution
- Clear pass/fail reporting
- Error message display for failed tests
- Summary statistics

### Assertion Helpers
- `assert(condition, message)` - General assertion
- `assertEqual(actual, expected, message)` - Equality check
- `assertTruthy(value, message)` - Truthy value check

### Test Structure
Each test follows this pattern:
```javascript
runner.test('Description', () => {
  setup(); // Create fresh auth instance
  // Test code
  assert(condition);
});
```

## Authentication Module API

### User Registration
```javascript
auth.register(username, password, email)
// Returns: { success: boolean, message: string, username?: string }
```

### User Login
```javascript
auth.login(username, password)
// Returns: { success: boolean, message: string, token?: string, expiresAt?: number }
```

### Token Validation
```javascript
auth.validateToken(token)
// Returns: { valid: boolean, username?: string, expiresAt?: number, message?: string }
```

### User Logout
```javascript
auth.logout(token)
// Returns: { success: boolean, message: string }
```

### Password Change
```javascript
auth.changePassword(username, oldPassword, newPassword)
// Returns: { success: boolean, message: string }
```

### Account Deactivation
```javascript
auth.deactivateAccount(username)
// Returns: { success: boolean, message: string }
```

### Get User Info
```javascript
auth.getUserInfo(username)
// Returns: { username, email, createdAt, isActive } | null
```

### Email Validation
```javascript
auth.isValidEmail(email)
// Returns: boolean
```

### Session Cleanup
```javascript
auth.clearExpiredSessions()
// Returns: number (count of cleared sessions)
```

## Security Features Tested

1. **Password Hashing** - Passwords are hashed before storage
2. **Token Generation** - Unique, random tokens for each session
3. **Token Expiration** - Sessions expire after 1 hour
4. **Session Invalidation** - Automatic cleanup on logout, password change, and deactivation
5. **Input Validation** - All inputs are validated for security
6. **Account Status** - Inactive accounts cannot login

## Test Best Practices

1. **Isolation** - Each test creates a fresh authentication instance
2. **Independence** - Tests don't depend on each other
3. **Clarity** - Test names clearly describe what is being tested
4. **Coverage** - Both success and failure scenarios are tested
5. **Atomicity** - Each test focuses on one specific behavior

## Continuous Integration

The test suite is designed to be integrated into CI/CD pipelines:

```bash
# Run tests and exit with appropriate code
node auth.test.js
echo $? # 0 for success, 1 for failure
```

## Future Enhancements

- Integration with popular test frameworks (Jest, Mocha)
- Code coverage reporting
- Performance benchmarks
- Load testing for concurrent sessions
- Integration tests with database backends
- API endpoint tests

## Contributing

When adding new features to the authentication module:

1. Write tests first (TDD approach)
2. Ensure all existing tests pass
3. Add tests for both success and failure cases
4. Update this documentation
5. Maintain test coverage above 90%

## License

MIT License - See LICENSE file for details

## Support

For issues or questions about the tests, please open an issue in the repository.
