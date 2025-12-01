/**
 * Unit Tests for Authentication Module
 * Test suite covering all authentication functionality
 */

// Import the authentication module
const AuthenticationModule = require('./auth.js');

/**
 * Simple Test Framework
 */
class TestRunner {
  constructor() {
    this.tests = [];
    this.passedTests = 0;
    this.failedTests = 0;
  }

  describe(suiteName, suiteFunction) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Test Suite: ${suiteName}`);
    console.log('='.repeat(60));
    suiteFunction();
  }

  it(testName, testFunction) {
    try {
      testFunction();
      this.passedTests++;
      console.log(`✓ ${testName}`);
    } catch (error) {
      this.failedTests++;
      console.log(`✗ ${testName}`);
      console.log(`  Error: ${error.message}`);
    }
  }

  expect(actual) {
    return {
      toBe: (expected) => {
        if (actual !== expected) {
          throw new Error(`Expected ${expected} but got ${actual}`);
        }
      },
      toEqual: (expected) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
        }
      },
      toBeTruthy: () => {
        if (!actual) {
          throw new Error(`Expected truthy value but got ${actual}`);
        }
      },
      toBeFalsy: () => {
        if (actual) {
          throw new Error(`Expected falsy value but got ${actual}`);
        }
      },
      toBeNull: () => {
        if (actual !== null) {
          throw new Error(`Expected null but got ${actual}`);
        }
      },
      toContain: (expected) => {
        if (!actual.includes(expected)) {
          throw new Error(`Expected to contain ${expected}`);
        }
      },
      toHaveProperty: (property) => {
        if (!(property in actual)) {
          throw new Error(`Expected to have property ${property}`);
        }
      }
    };
  }

  printSummary() {
    console.log(`\n${'='.repeat(60)}`);
    console.log('Test Summary');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${this.passedTests + this.failedTests}`);
    console.log(`Passed: ${this.passedTests}`);
    console.log(`Failed: ${this.failedTests}`);
    console.log(`Success Rate: ${((this.passedTests / (this.passedTests + this.failedTests)) * 100).toFixed(2)}%`);
    console.log('='.repeat(60));
  }
}

// Initialize test runner
const test = new TestRunner();

// Test Suite 1: User Registration
test.describe('User Registration', () => {
  let auth = new AuthenticationModule();

  test.it('should successfully register a valid user', () => {
    const result = auth.register('john_doe', 'Password123', 'john@example.com');
    test.expect(result.success).toBeTruthy();
    test.expect(result.message).toBe('User registered successfully');
  });

  test.it('should fail when username is missing', () => {
    const result = auth.register('', 'Password123', 'john@example.com');
    test.expect(result.success).toBeFalsy();
    test.expect(result.message).toBe('All fields are required');
  });

  test.it('should fail when password is missing', () => {
    const result = auth.register('user2', '', 'john@example.com');
    test.expect(result.success).toBeFalsy();
  });

  test.it('should fail when email is missing', () => {
    const result = auth.register('user3', 'Password123', '');
    test.expect(result.success).toBeFalsy();
  });

  test.it('should fail when username already exists', () => {
    const result = auth.register('john_doe', 'Password456', 'john2@example.com');
    test.expect(result.success).toBeFalsy();
    test.expect(result.message).toBe('Username already exists');
  });

  test.it('should fail with invalid email format', () => {
    const result = auth.register('user4', 'Password123', 'invalid-email');
    test.expect(result.success).toBeFalsy();
    test.expect(result.message).toBe('Invalid email format');
  });

  test.it('should fail with short password', () => {
    const result = auth.register('user5', 'Pass1', 'user5@example.com');
    test.expect(result.success).toBeFalsy();
  });

  test.it('should store user in the system', () => {
    test.expect(auth.userExists('john_doe')).toBeTruthy();
  });
});

// Test Suite 2: User Login
test.describe('User Login', () => {
  let auth2 = new AuthenticationModule();
  auth2.register('jane_doe', 'Password123', 'jane@example.com');

  test.it('should successfully login with valid credentials', () => {
    const result = auth2.login('jane_doe', 'Password123');
    test.expect(result.success).toBeTruthy();
    test.expect(result.message).toBe('Login successful');
    test.expect(result).toHaveProperty('token');
  });

  test.it('should fail when username is missing', () => {
    const result = auth2.login('', 'Password123');
    test.expect(result.success).toBeFalsy();
  });

  test.it('should fail when password is missing', () => {
    const result = auth2.login('jane_doe', '');
    test.expect(result.success).toBeFalsy();
  });

  test.it('should fail with non-existent user', () => {
    const result = auth2.login('non_existent', 'Password123');
    test.expect(result.success).toBeFalsy();
  });

  test.it('should fail with incorrect password', () => {
    const result = auth2.login('jane_doe', 'WrongPassword');
    test.expect(result.success).toBeFalsy();
  });

  test.it('should set current user after successful login', () => {
    test.expect(auth2.getCurrentUser()).toBe('jane_doe');
  });
});

// Test Suite 3: User Logout
test.describe('User Logout', () => {
  let auth3 = new AuthenticationModule();
  auth3.register('bob_smith', 'Password123', 'bob@example.com');
  const loginResult = auth3.login('bob_smith', 'Password123');
  const token = loginResult.token;

  test.it('should successfully logout with valid token', () => {
    const result = auth3.logout(token);
    test.expect(result.success).toBeTruthy();
    test.expect(result.message).toBe('Logout successful');
  });

  test.it('should fail when token is missing', () => {
    const result = auth3.logout('');
    test.expect(result.success).toBeFalsy();
  });

  test.it('should fail with invalid token', () => {
    const result = auth3.logout('invalid_token');
    test.expect(result.success).toBeFalsy();
  });

  test.it('should clear current user after logout', () => {
    test.expect(auth3.getCurrentUser()).toBeNull();
  });

  test.it('should invalidate session token after logout', () => {
    const validateResult = auth3.validateToken(token);
    test.expect(validateResult.valid).toBeFalsy();
  });
});

// Test Suite 4: Token Validation
test.describe('Token Validation', () => {
  let auth4 = new AuthenticationModule();
  auth4.register('alice_jones', 'Password123', 'alice@example.com');
  const loginResult = auth4.login('alice_jones', 'Password123');
  const token = loginResult.token;

  test.it('should validate a valid token', () => {
    const result = auth4.validateToken(token);
    test.expect(result.valid).toBeTruthy();
  });

  test.it('should fail when token is missing', () => {
    const result = auth4.validateToken('');
    test.expect(result.valid).toBeFalsy();
  });

  test.it('should fail with invalid token', () => {
    const result = auth4.validateToken('invalid_token');
    test.expect(result.valid).toBeFalsy();
  });

  test.it('should return user data for valid token', () => {
    const result = auth4.validateToken(token);
    test.expect(result).toHaveProperty('user');
  });
});

// Test Suite 5: Password Change
test.describe('Password Change', () => {
  let auth5 = new AuthenticationModule();
  auth5.register('charlie_brown', 'Password123', 'charlie@example.com');

  test.it('should successfully change password', () => {
    const result = auth5.changePassword('charlie_brown', 'Password123', 'NewPassword123');
    test.expect(result.success).toBeTruthy();
  });

  test.it('should allow login with new password', () => {
    const loginResult = auth5.login('charlie_brown', 'NewPassword123');
    test.expect(loginResult.success).toBeTruthy();
  });

  test.it('should fail when username is missing', () => {
    const result = auth5.changePassword('', 'Password123', 'NewPassword123');
    test.expect(result.success).toBeFalsy();
  });

  test.it('should fail with incorrect old password', () => {
    const auth6 = new AuthenticationModule();
    auth6.register('dave_wilson', 'Password123', 'dave@example.com');
    const result = auth6.changePassword('dave_wilson', 'WrongPassword', 'NewPassword123');
    test.expect(result.success).toBeFalsy();
  });

  test.it('should fail with short new password', () => {
    const auth7 = new AuthenticationModule();
    auth7.register('eve_adams', 'Password123', 'eve@example.com');
    const result = auth7.changePassword('eve_adams', 'Password123', 'Short1');
    test.expect(result.success).toBeFalsy();
  });

  test.it('should fail for non-existent user', () => {
    const result = auth5.changePassword('non_existent', 'Password123', 'NewPassword123');
    test.expect(result.success).toBeFalsy();
  });
});

// Test Suite 6: Helper Methods
test.describe('Helper Methods', () => {
  let auth8 = new AuthenticationModule();
  auth8.register('frank_miller', 'Password123', 'frank@example.com');

  test.it('should return current user when logged in', () => {
    auth8.login('frank_miller', 'Password123');
    test.expect(auth8.getCurrentUser()).toBe('frank_miller');
  });

  test.it('should return null when no user is logged in', () => {
    const auth9 = new AuthenticationModule();
    test.expect(auth9.getCurrentUser()).toBeNull();
  });

  test.it('should check if user exists', () => {
    test.expect(auth8.userExists('frank_miller')).toBeTruthy();
  });

  test.it('should return false for non-existent user', () => {
    test.expect(auth8.userExists('non_existent_user')).toBeFalsy();
  });

  test.it('should reset all data', () => {
    auth8.reset();
    test.expect(auth8.getCurrentUser()).toBeNull();
    test.expect(auth8.userExists('frank_miller')).toBeFalsy();
  });
});

// Print test summary
test.printSummary();

// Export for use in other test runners
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TestRunner, test };
}
