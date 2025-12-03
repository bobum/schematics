/**
 * Comprehensive Unit Tests for Authentication Module
 * Tests cover: login flow, logout flow, token refresh, and edge cases
 * Target: 80%+ code coverage
 */

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.localStorage = localStorageMock;
const AuthenticationModule = require('./auth.js');

describe('Authentication Module - Login Flow', () => {
  let auth;
  beforeEach(() => { auth = new AuthenticationModule(); localStorage.clear(); });

  test('should successfully login with valid credentials', async () => {
    const result = await auth.login('testuser', 'password123');
    expect(result.token).toBeDefined();
    expect(result.user.username).toBe('testuser');
  });

  test('should reject invalid credentials', async () => {
    await expect(auth.login('wrong', 'wrong')).rejects.toThrow('Invalid credentials');
  });

  test('should validate username length', async () => {
    await expect(auth.login('ab', 'password123')).rejects.toThrow('at least 3 characters');
  });

  test('should validate password length', async () => {
    await expect(auth.login('testuser', '12345')).rejects.toThrow('at least 6 characters');
  });
});

describe('Authentication Module - Logout Flow', () => {
  let auth;
  beforeEach(() => { auth = new AuthenticationModule(); localStorage.clear(); });

  test('should successfully logout', async () => {
    await auth.login('testuser', 'password123');
    const result = await auth.logout();
    expect(result).toBe(true);
    expect(auth.isAuthenticated()).toBe(false);
  });

  test('should clear all data on logout', async () => {
    await auth.login('testuser', 'password123');
    await auth.logout();
    expect(auth.token).toBeNull();
    expect(auth.user).toBeNull();
  });

  test('should throw error without active session', async () => {
    await expect(auth.logout()).rejects.toThrow('No active session');
  });
});

describe('Authentication Module - Token Refresh', () => {
  let auth;
  beforeEach(() => { auth = new AuthenticationModule(); localStorage.clear(); });

  test('should refresh token successfully', async () => {
    await auth.login('testuser', 'password123');
    const oldToken = auth.token;
    const result = await auth.refreshAuthToken();
    expect(result.token).toBeDefined();
    expect(result.token).not.toBe(oldToken);
  });

  test('should throw error without refresh token', async () => {
    await expect(auth.refreshAuthToken()).rejects.toThrow('No refresh token');
  });

  test('should maintain authentication after refresh', async () => {
    await auth.login('testuser', 'password123');
    await auth.refreshAuthToken();
    expect(auth.isAuthenticated()).toBe(true);
  });
});

describe('Authentication Module - Token Validation', () => {
  let auth;
  beforeEach(() => { auth = new AuthenticationModule(); localStorage.clear(); });

  test('should validate authenticated state', async () => {
    expect(auth.isAuthenticated()).toBe(false);
    await auth.login('testuser', 'password123');
    expect(auth.isAuthenticated()).toBe(true);
  });

  test('should detect expired tokens', async () => {
    await auth.login('testuser', 'password123');
    auth.tokenExpiry = Date.now() - 1000;
    expect(auth.isAuthenticated()).toBe(false);
  });

  test('should identify when refresh needed', async () => {
    await auth.login('testuser', 'password123');
    auth.tokenExpiry = Date.now() + (4 * 60 * 1000);
    expect(auth.shouldRefreshToken()).toBe(true);
  });
});

describe('Authentication Module - Session Restoration', () => {
  let auth;
  beforeEach(() => { auth = new AuthenticationModule(); localStorage.clear(); });

  test('should restore valid session', async () => {
    await auth.login('testuser', 'password123');
    const newAuth = new AuthenticationModule();
    expect(newAuth.restoreSession()).toBe(true);
    expect(newAuth.isAuthenticated()).toBe(true);
  });

  test('should not restore expired session', async () => {
    await auth.login('testuser', 'password123');
    const data = JSON.parse(localStorage.getItem('auth_session'));
    data.tokenExpiry = Date.now() - 1000;
    localStorage.setItem('auth_session', JSON.stringify(data));
    const newAuth = new AuthenticationModule();
    expect(newAuth.restoreSession()).toBe(false);
  });

  test('should handle corrupted data', () => {
    localStorage.setItem('auth_session', 'invalid');
    expect(auth.restoreSession()).toBe(false);
  });
});

describe('Authentication Module - Event Listeners', () => {
  let auth;
  beforeEach(() => { auth = new AuthenticationModule(); localStorage.clear(); });

  test('should notify on login', async () => {
    const listener = jest.fn();
    auth.addListener(listener);
    await auth.login('testuser', 'password123');
    expect(listener).toHaveBeenCalledWith('login', expect.any(Object));
  });

  test('should notify on logout', async () => {
    const listener = jest.fn();
    await auth.login('testuser', 'password123');
    auth.addListener(listener);
    await auth.logout();
    expect(listener).toHaveBeenCalledWith('logout', expect.any(Object));
  });

  test('should remove listeners', () => {
    const listener = jest.fn();
    auth.addListener(listener);
    auth.removeListener(listener);
    expect(auth.listeners).toHaveLength(0);
  });
});

console.log('All tests defined successfully!');
