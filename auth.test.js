/**
 * Comprehensive Unit Tests for Authentication Module
 * Tests cover: login flow, logout flow, token refresh, and edge cases
 * Target: 80%+ code coverage
 */

// Mock localStorage for Node.js environment
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

// Import the module
const AuthenticationModule = require('./auth.js');

/**
 * Test Suite: Authentication Module - Login Flow
 */
describe('Authentication Module - Login Flow', () => {
  let auth;

  beforeEach(() => {
    auth = new AuthenticationModule();
    localStorage.clear();
  });

  test('should successfully login with valid credentials', async () => {
    const result = await auth.login('testuser', 'password123');
    
    expect(result).toBeDefined();
    expect(result.token).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.user.username).toBe('testuser');
    expect(result.user.email).toBe('testuser@example.com');
    expect(result.expiresIn).toBe(3600);
  });

  test('should set authentication state after successful login', async () => {
    await auth.login('testuser', 'password123');
    
    expect(auth.isAuthenticated()).toBe(true);
    expect(auth.getToken()).toBeDefined();
    expect(auth.getCurrentUser()).toBeDefined();
    expect(auth.getCurrentUser().username).toBe('testuser');
  });

  test('should reject login with invalid credentials', async () => {
    await expect(auth.login('wronguser', 'wrongpass'))
      .rejects
      .toThrow('Invalid credentials');
    
    expect(auth.isAuthenticated()).toBe(false);
  });

  test('should reject login with missing username', async () => {
    await expect(auth.login('', 'password123'))
      .rejects
      .toThrow('Username and password are required');
  });

  test('should reject login with missing password', async () => {
    await expect(auth.login('testuser', ''))
      .rejects
      .toThrow('Username and password are required');
  });

  test('should reject login with short username', async () => {
    await expect(auth.login('ab', 'password123'))
      .rejects
      .toThrow('Username must be at least 3 characters');
  });

  test('should reject login with short password', async () => {
    await expect(auth.login('testuser', '12345'))
      .rejects
      .toThrow('Password must be at least 6 characters');
  });

  test('should persist session to localStorage after login', async () => {
    await auth.login('testuser', 'password123');
    
    const sessionData = localStorage.getItem('auth_session');
    expect(sessionData).toBeDefined();
    
    const parsed = JSON.parse(sessionData);
    expect(parsed.token).toBeDefined();
    expect(parsed.refreshToken).toBeDefined();
    expect(parsed.user.username).toBe('testuser');
  });

  test('should notify listeners on successful login', async () => {
    const listener = jest.fn();
    auth.addListener(listener);
    
    await auth.login('testuser', 'password123');
    
    expect(listener).toHaveBeenCalledWith('login', expect.objectContaining({
      username: 'testuser'
    }));
  });

  test('should generate unique tokens for each login', async () => {
    const result1 = await auth.login('testuser', 'password123');
    auth = new AuthenticationModule();
    const result2 = await auth.login('testuser', 'password123');
    
    expect(result1.token).not.toBe(result2.token);
    expect(result1.refreshToken).not.toBe(result2.refreshToken);
  });
});

/**
 * Test Suite: Authentication Module - Logout Flow
 */
describe('Authentication Module - Logout Flow', () => {
  let auth;

  beforeEach(() => {
    auth = new AuthenticationModule();
    localStorage.clear();
  });

  test('should successfully logout authenticated user', async () => {
    await auth.login('testuser', 'password123');
    expect(auth.isAuthenticated()).toBe(true);
    
    const result = await auth.logout();
    
    expect(result).toBe(true);
    expect(auth.isAuthenticated()).toBe(false);
  });

  test('should clear all authentication data on logout', async () => {
    await auth.login('testuser', 'password123');
    await auth.logout();
    
    expect(auth.token).toBeNull();
    expect(auth.refreshToken).toBeNull();
    expect(auth.user).toBeNull();
    expect(auth.tokenExpiry).toBeNull();
  });

  test('should remove session from localStorage on logout', async () => {
    await auth.login('testuser', 'password123');
    expect(localStorage.getItem('auth_session')).toBeDefined();
    
    await auth.logout();
    
    expect(localStorage.getItem('auth_session')).toBeNull();
  });

  test('should throw error when logging out without active session', async () => {
    await expect(auth.logout())
      .rejects
      .toThrow('No active session to logout');
  });

  test('should notify listeners on logout', async () => {
    const listener = jest.fn();
    await auth.login('testuser', 'password123');
    auth.addListener(listener);
    
    await auth.logout();
    
    expect(listener).toHaveBeenCalledWith('logout', expect.objectContaining({
      username: 'testuser'
    }));
  });

  test('should return null for getCurrentUser after logout', async () => {
    await auth.login('testuser', 'password123');
    expect(auth.getCurrentUser()).toBeDefined();
    
    await auth.logout();
    
    expect(auth.getCurrentUser()).toBeNull();
  });

  test('should return null for getToken after logout', async () => {
    await auth.login('testuser', 'password123');
    expect(auth.getToken()).toBeDefined();
    
    await auth.logout();
    
    expect(auth.getToken()).toBeNull();
  });
});

/**
 * Test Suite: Authentication Module - Token Refresh
 */
describe('Authentication Module - Token Refresh', () => {
  let auth;

  beforeEach(() => {
    auth = new AuthenticationModule();
    localStorage.clear();
  });

  test('should successfully refresh token with valid refresh token', async () => {
    await auth.login('testuser', 'password123');
    const oldToken = auth.token;
    
    const result = await auth.refreshAuthToken();
    
    expect(result).toBeDefined();
    expect(result.token).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.token).not.toBe(oldToken);
  });

  test('should update token and refreshToken after refresh', async () => {
    await auth.login('testuser', 'password123');
    const oldToken = auth.token;
    const oldRefreshToken = auth.refreshToken;
    
    await auth.refreshAuthToken();
    
    expect(auth.token).not.toBe(oldToken);
    expect(auth.refreshToken).not.toBe(oldRefreshToken);
  });

  test('should update tokenExpiry after refresh', async () => {
    await auth.login('testuser', 'password123');
    const oldExpiry = auth.tokenExpiry;
    
    await new Promise(resolve => setTimeout(resolve, 10));
    await auth.refreshAuthToken();
    
    expect(auth.tokenExpiry).toBeGreaterThan(oldExpiry);
  });

  test('should throw error when refreshing without refresh token', async () => {
    await expect(auth.refreshAuthToken())
      .rejects
      .toThrow('No refresh token available');
  });

  test('should throw error with invalid refresh token', async () => {
    auth.refreshToken = 'invalid_token';
    
    await expect(auth.refreshAuthToken())
      .rejects
      .toThrow('Invalid refresh token');
  });

  test('should persist updated session after token refresh', async () => {
    await auth.login('testuser', 'password123');
    await auth.refreshAuthToken();
    
    const sessionData = localStorage.getItem('auth_session');
    const parsed = JSON.parse(sessionData);
    
    expect(parsed.token).toBe(auth.token);
    expect(parsed.refreshToken).toBe(auth.refreshToken);
  });

  test('should notify listeners on token refresh', async () => {
    await auth.login('testuser', 'password123');
    const listener = jest.fn();
    auth.addListener(listener);
    
    await auth.refreshAuthToken();
    
    expect(listener).toHaveBeenCalledWith('tokenRefresh', expect.objectContaining({
      token: expect.any(String)
    }));
  });

  test('should maintain authentication state after refresh', async () => {
    await auth.login('testuser', 'password123');
    await auth.refreshAuthToken();
    
    expect(auth.isAuthenticated()).toBe(true);
    expect(auth.getCurrentUser()).toBeDefined();
  });

  test('should clear session on refresh with invalid token', async () => {
    auth.refreshToken = 'invalid_token';
    
    try {
      await auth.refreshAuthToken();
    } catch (error) {
      expect(localStorage.getItem('auth_session')).toBeNull();
    }
  });
});

/**
 * Test Suite: Authentication Module - Token Validation
 */
describe('Authentication Module - Token Validation', () => {
  let auth;

  beforeEach(() => {
    auth = new AuthenticationModule();
    localStorage.clear();
  });

  test('should return false for isAuthenticated without login', () => {
    expect(auth.isAuthenticated()).toBe(false);
  });

  test('should return true for isAuthenticated after login', async () => {
    await auth.login('testuser', 'password123');
    expect(auth.isAuthenticated()).toBe(true);
  });

  test('should return false for isAuthenticated with expired token', async () => {
    await auth.login('testuser', 'password123');
    auth.tokenExpiry = Date.now() - 1000;
    
    expect(auth.isAuthenticated()).toBe(false);
  });

  test('should return null for getToken when not authenticated', () => {
    expect(auth.getToken()).toBeNull();
  });

  test('should return null for getCurrentUser when not authenticated', () => {
    expect(auth.getCurrentUser()).toBeNull();
  });

  test('should correctly identify when token needs refresh', async () => {
    await auth.login('testuser', 'password123');
    auth.tokenExpiry = Date.now() + (4 * 60 * 1000);
    
    expect(auth.shouldRefreshToken()).toBe(true);
  });

  test('should return false for shouldRefreshToken when plenty of time left', async () => {
    await auth.login('testuser', 'password123');
    auth.tokenExpiry = Date.now() + (10 * 60 * 1000);
    
    expect(auth.shouldRefreshToken()).toBe(false);
  });

  test('should return false for shouldRefreshToken without token', () => {
    expect(auth.shouldRefreshToken()).toBe(false);
  });
});

/**
 * Test Suite: Authentication Module - Session Restoration
 */
describe('Authentication Module - Session Restoration', () => {
  let auth;

  beforeEach(() => {
    auth = new AuthenticationModule();
    localStorage.clear();
  });

  test('should restore valid session from localStorage', async () => {
    await auth.login('testuser', 'password123');
    const token = auth.token;
    
    const newAuth = new AuthenticationModule();
    const restored = newAuth.restoreSession();
    
    expect(restored).toBe(true);
    expect(newAuth.isAuthenticated()).toBe(true);
    expect(newAuth.token).toBe(token);
  });

  test('should return false when no session exists', () => {
    const restored = auth.restoreSession();
    expect(restored).toBe(false);
  });

  test('should not restore expired session', async () => {
    await auth.login('testuser', 'password123');
    
    const sessionData = JSON.parse(localStorage.getItem('auth_session'));
    sessionData.tokenExpiry = Date.now() - 1000;
    localStorage.setItem('auth_session', JSON.stringify(sessionData));
    
    const newAuth = new AuthenticationModule();
    const restored = newAuth.restoreSession();
    
    expect(restored).toBe(false);
    expect(localStorage.getItem('auth_session')).toBeNull();
  });

  test('should handle corrupted session data gracefully', () => {
    localStorage.setItem('auth_session', 'invalid json{');
    
    const restored = auth.restoreSession();
    expect(restored).toBe(false);
  });

  test('should restore user data from session', async () => {
    await auth.login('testuser', 'password123');
    
    const newAuth = new AuthenticationModule();
    newAuth.restoreSession();
    
    expect(newAuth.getCurrentUser()).toBeDefined();
    expect(newAuth.getCurrentUser().username).toBe('testuser');
  });
});

/**
 * Test Suite: Authentication Module - Event Listeners
 */
describe('Authentication Module - Event Listeners', () => {
  let auth;

  beforeEach(() => {
    auth = new AuthenticationModule();
    localStorage.clear();
  });

  test('should add listener successfully', () => {
    const listener = jest.fn()