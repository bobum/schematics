/**
 * Unit Tests for Authentication Module
 * Comprehensive test suite covering all authentication functionality
 */

const AuthenticationModule = require('./auth.js');

// Test framework setup
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(description, testFn) {
    this.tests.push({ description, testFn });
  }

  async run() {
    console.log('\n🧪 Running Authentication Module Tests\n');
    console.log('='.repeat(60));

    for (const { description, testFn } of this.tests) {
      try {
        await testFn();
        this.passed++;
        console.log(`✅ PASS: ${description}`);
      } catch (error) {
        this.failed++;
        console.log(`❌ FAIL: ${description}`);
        console.log(`   Error: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed, ${this.tests.length} total\n`);
    
    return this.failed === 0;
  }
}

// Assertion helpers
function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) throw new Error(message || `Expected ${expected} but got ${actual}`);
}

function assertTruthy(value, message) {
  if (!value) throw new Error(message || `Expected truthy value but got ${value}`);
}

// Initialize test runner
const runner = new TestRunner();
let auth;

function setup() {
  auth = new AuthenticationModule();
}

// REGISTRATION TESTS
runner.test('Registration: Should successfully register a valid user', () => {
  setup();
  const result = auth.register('testuser', 'password123', 'test@example.com');
  assert(result.success === true); assertEqual(result.message, 'User registered successfully');
});

runner.test('Registration: Should reject missing username', () => {
  setup();
  const result = auth.register('', 'password123', 'test@example.com');
  assert(result.success === false); assertEqual(result.message, 'All fields are required');
});

runner.test('Registration: Should reject missing password', () => {
  setup();
  const result = auth.register('testuser', '', 'test@example.com');
  assert(result.success === false); assertEqual(result.message, 'All fields are required');
});

runner.test('Registration: Should reject missing email', () => {
  setup();
  const result = auth.register('testuser', 'password123', '');
  assert(result.success === false); assertEqual(result.message, 'All fields are required');
});

runner.test('Registration: Should reject short username', () => {
  setup();
  const result = auth.register('ab', 'password123', 'test@example.com');
  assert(result.success === false); assertEqual(result.message, 'Username must be at least 3 characters');
});

runner.test('Registration: Should reject short password', () => {
  setup();
  const result = auth.register('testuser', 'pass', 'test@example.com');
  assert(result.success === false); assertEqual(result.message, 'Password must be at least 8 characters');
});

runner.test('Registration: Should reject invalid email', () => {
  setup();
  const result = auth.register('testuser', 'password123', 'invalid-email');
  assert(result.success === false); assertEqual(result.message, 'Invalid email format');
});

runner.test('Registration: Should reject duplicate username', () => {
  setup();
  auth.register('testuser', 'password123', 'test1@example.com');
  const result = auth.register('testuser', 'password456', 'test2@example.com');
  assert(result.success === false); assertEqual(result.message, 'Username already exists');
});

runner.test('Registration: Should reject duplicate email', () => {
  setup();
  auth.register('testuser1', 'password123', 'test@example.com');
  const result = auth.register('testuser2', 'password456', 'test@example.com');
  assert(result.success === false); assertEqual(result.message, 'Email already registered');
});

// LOGIN TESTS
runner.test('Login: Should successfully login', () => {
  setup();
  auth.register('testuser', 'password123', 'test@example.com');
  const result = auth.login('testuser', 'password123');
  assert(result.success === true); assertTruthy(result.token);
});

runner.test('Login: Should reject missing username', () => {
  setup();
  const result = auth.login('', 'password123');
  assert(result.success === false); assertEqual(result.message, 'Username and password are required');
});

runner.test('Login: Should reject missing password', () => {
  setup();
  const result = auth.login('testuser', '');
  assert(result.success === false); assertEqual(result.message, 'Username and password are required');
});

runner.test('Login: Should reject non-existent user', () => {
  setup();
  const result = auth.login('nonexistent', 'password123');
  assert(result.success === false); assertEqual(result.message, 'Invalid username or password');
});

runner.test('Login: Should reject incorrect password', () => {
  setup();
  auth.register('testuser', 'password123', 'test@example.com');
  const result = auth.login('testuser', 'wrongpassword');
  assert(result.success === false); assertEqual(result.message, 'Invalid username or password');
});

runner.test('Login: Should reject inactive account', () => {
  setup();
  auth.register('testuser', 'password123', 'test@example.com');
  auth.deactivateAccount('testuser');
  const result = auth.login('testuser', 'password123');
  assert(result.success === false); assertEqual(result.message, 'Account is inactive');
});

runner.test('Login: Should generate unique tokens', () => {
  setup();
  auth.register('testuser', 'password123', 'test@example.com');
  const r1 = auth.login('testuser', 'password123');
  const r2 = auth.login('testuser', 'password123');
  assert(r1.token !== r2.token);
});

// TOKEN VALIDATION TESTS
runner.test('Validation: Should validate valid token', () => {
  setup();
  auth.register('testuser', 'password123', 'test@example.com');
  const login = auth.login('testuser', 'password123');
  const result = auth.validateToken(login.token);
  assert(result.valid === true); assertEqual(result.username, 'testuser');
});

runner.test('Validation: Should reject missing token', () => {
  setup();
  const result = auth.validateToken('');
  assert(result.valid === false); assertEqual(result.message, 'Token is required');
});

runner.test('Validation: Should reject invalid token', () => {
  setup();
  const result = auth.validateToken('invalid');
  assert(result.valid === false); assertEqual(result.message, 'Invalid token');
});

runner.test('Validation: Should reject expired token', () => {
  setup();
  auth.register('testuser', 'password123', 'test@example.com');
  const login = auth.login('testuser', 'password123');
  auth.sessions.get(login.token).expiresAt = Date.now() - 1000;
  const result = auth.validateToken(login.token);
  assert(result.valid === false); assertEqual(result.message, 'Token expired');
});

// LOGOUT TESTS
runner.test('Logout: Should successfully logout', () => {
  setup();
  auth.register('testuser', 'password123', 'test@example.com');
  const login = auth.login('testuser', 'password123');
  const result = auth.logout(login.token);
  assert(result.success === true);
  assert(auth.validateToken(login.token).valid === false);
});

runner.test('Logout: Should reject missing token', () => {
  setup();
  const result = auth.logout('');
  assert(result.success === false); assertEqual(result.message, 'Token is required');
});

runner.test('Logout: Should reject invalid token', () => {
  setup();
  const result = auth.logout('invalid');
  assert(result.success === false); assertEqual(result.message, 'Invalid token');
});

// PASSWORD CHANGE TESTS
runner.test('Password: Should change password successfully', () => {
  setup();
  auth.register('testuser', 'password123', 'test@example.com');
  const result = auth.changePassword('testuser', 'password123', 'newpass123');
  assert(result.success === true);
  assert(auth.login('testuser', 'newpass123').success === true);
});

runner.test('Password: Should reject missing fields', () => {
  setup();
  const result = auth.changePassword('', 'pass123', 'newpass123');
  assert(result.success === false); assertEqual(result.message, 'All fields are required');
});

runner.test('Password: Should reject short new password', () => {
  setup();
  auth.register('testuser', 'password123', 'test@example.com');
  const result = auth.changePassword('testuser', 'password123', 'short');
  assert(result.success === false); assertEqual(result.message, 'New password must be at least 8 characters');
});

runner.test('Password: Should reject wrong current password', () => {
  setup();
  auth.register('testuser', 'password123', 'test@example.com');
  const result = auth.changePassword('testuser', 'wrong', 'newpass123');
  assert(result.success === false); assertEqual(result.message, 'Current password is incorrect');
});

runner.test('Password: Should reject non-existent user', () => {
  setup();
  const result = auth.changePassword('nobody', 'pass123', 'newpass123');
  assert(result.success === false); assertEqual(result.message, 'User not found');
});

runner.test('Password: Should invalidate all sessions', () => {
  setup();
  auth.register('testuser', 'password123', 'test@example.com');
  const l1 = auth.login('testuser', 'password123');
  const l2 = auth.login('testuser', 'password123');
  auth.changePassword('testuser', 'password123', 'newpass123');
  assert(auth.validateToken(l1.token).valid === false);
  assert(auth.validateToken(l2.token).valid === false);
});

// DEACTIVATION TESTS
runner.test('Deactivation: Should deactivate account', () => {
  setup();
  auth.register('testuser', 'password123', 'test@example.com');
  const result = auth.deactivateAccount('testuser');
  assert(result.success === true);
});

runner.test('Deactivation: Should reject missing username', () => {
  setup();
  const result = auth.deactivateAccount('');
  assert(result.success === false); assertEqual(result.message, 'Username is required');
});

runner.test('Deactivation: Should reject non-existent user', () => {
  setup();
  const result = auth.deactivateAccount('nobody');
  assert(result.success === false); assertEqual(result.message, 'User not found');
});

runner.test('Deactivation: Should invalidate sessions', () => {
  setup();
  auth.register('testuser', 'password123', 'test@example.com');
  const login = auth.login('testuser', 'password123');
  auth.deactivateAccount('testuser');
  assert(auth.validateToken(login.token).valid === false);
});

// USER INFO TESTS
runner.test('UserInfo: Should get user info', () => {
  setup();
  auth.register('testuser', 'password123', 'test@example.com');
  const info = auth.getUserInfo('testuser');
  assertEqual(info.username, 'testuser');
  assertEqual(info.email, 'test@example.com');
  assert(info.password === undefined);
});

runner.test('UserInfo: Should return null for non-existent user', () => {
  setup();
  const info = auth.getUserInfo('nobody');
  assert(info === null);
});

// EMAIL VALIDATION TESTS
runner.test('Email: Should validate correct email', () => {
  setup();
  assert(auth.isValidEmail('test@example.com') === true);
});

runner.test('Email: Should reject invalid email', () => {
  setup();
  assert(auth.isValidEmail('invalid') === false);
  assert(auth.isValidEmail('test@') === false);
  assert(auth.isValidEmail('@example.com') === false);
});

// SESSION CLEANUP TESTS
runner.test('Cleanup: Should clear expired sessions', () => {
  setup();
  auth.register('testuser', 'password123', 'test@example.com');
  const login = auth.login('testuser', 'password123');
  auth.sessions.get(login.token).expiresAt = Date.now() - 1000;
  const cleared = auth.clearExpiredSessions();
  assert(cleared === 1);
});

// Run all tests
if (require.main === module) {
  runner.run().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = runner;
