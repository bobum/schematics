/**
 * Unit Tests for Authentication Module
 * Comprehensive tests covering login, logout, token refresh
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
const AuthenticationModule = require('../src/auth.js');

describe('AuthenticationModule', () => {
  let auth;

  beforeEach(() => {
    auth = new AuthenticationModule();
    localStorage.clear();
  });

  describe('Login Flow', () => {
    test('successful login with valid credentials', async () => {
      const result = await auth.login('testuser', 'password123');
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.user.username).toBe('testuser');
      expect(auth.token).not.toBeNull();
    });

    test('reject invalid credentials', async () => {
      await expect(auth.login('testuser', 'wrong'))
        .rejects.toThrow('Invalid username or password');
    });

    test('reject missing username', async () => {
      await expect(auth.login('', 'password123'))
        .rejects.toThrow('Username is required');
    });

    test('reject missing password', async () => {
      await expect(auth.login('testuser', ''))
        .rejects.toThrow('Password is required');
    });

    test('store data in localStorage', async () => {
      await auth.login('testuser', 'password123');
      const stored = localStorage.getItem('auth_session');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored).token).toBeDefined();
    });

    test('set token expiry correctly', async () => {
      const before = Date.now();
      await auth.login('testuser', 'password123');
      expect(auth.tokenExpiryTime).toBeGreaterThan(before + 3500000);
    });
  });

  describe('Logout Flow', () => {
    test('successful logout clears all data', async () => {
      await auth.login('testuser', 'password123');
      const result = await auth.logout();
      expect(result.success).toBe(true);
      expect(auth.token).toBeNull();
      expect(auth.user).toBeNull();
    });

    test('clear localStorage on logout', async () => {
      await auth.login('testuser', 'password123');
      await auth.logout();
      expect(localStorage.getItem('auth_session')).toBeNull();
    });

    test('error when logout without session', async () => {
      await expect(auth.logout())
        .rejects.toThrow('No active session');
    });
  });

  describe('Token Refresh Flow', () => {
    test('successfully refresh token', async () => {
      await auth.login('testuser', 'password123');
      const oldToken = auth.token;
      await new Promise(r => setTimeout(r, 10));
      const result = await auth.refreshAuthToken();
      expect(result.success).toBe(true);
      expect(result.token).not.toBe(oldToken);
    });

    test('error when no refresh token', async () => {
      await expect(auth.refreshAuthToken())
        .rejects.toThrow('No refresh token');
    });

    test('update expiry after refresh', async () => {
      await auth.login('testuser', 'password123');
      const oldExpiry = auth.tokenExpiryTime;
      await new Promise(r => setTimeout(r, 10));
      await auth.refreshAuthToken();
      expect(auth.tokenExpiryTime).toBeGreaterThan(oldExpiry);
    });

    test('maintain user after refresh', async () => {
      await auth.login('testuser', 'password123');
      const user = auth.user;
      await auth.refreshAuthToken();
      expect(auth.user).toEqual(user);
    });
  });

  describe('Authentication Status', () => {
    test('false when not logged in', () => {
      expect(auth.isAuthenticated()).toBe(false);
    });

    test('true when logged in', async () => {
      await auth.login('testuser', 'password123');
      expect(auth.isAuthenticated()).toBe(true);
    });

    test('false when token expired', async () => {
      await auth.login('testuser', 'password123');
      auth.tokenExpiryTime = Date.now() - 1000;
      expect(auth.isAuthenticated()).toBe(false);
    });
  });

  describe('User and Token Access', () => {
    test('getCurrentUser returns null when not auth', () => {
      expect(auth.getCurrentUser()).toBeNull();
    });

    test('getCurrentUser returns user when auth', async () => {
      await auth.login('testuser', 'password123');
      const user = auth.getCurrentUser();
      expect(user.username).toBe('testuser');
    });

    test('getToken returns null when not auth', () => {
      expect(auth.getToken()).toBeNull();
    });

    test('getToken returns token when auth', async () => {
      await auth.login('testuser', 'password123');
      expect(auth.getToken()).toContain('access_');
    });
  });

  describe('Token Refresh Check', () => {
    test('needsRefresh false when not auth', () => {
      expect(auth.needsRefresh()).toBe(false);
    });

    test('needsRefresh false with time remaining', async () => {
      await auth.login('testuser', 'password123');
      expect(auth.needsRefresh()).toBe(false);
    });

    test('needsRefresh true when expiring soon', async () => {
      await auth.login('testuser', 'password123');
      auth.tokenExpiryTime = Date.now() + (4 * 60 * 1000);
      expect(auth.needsRefresh()).toBe(true);
    });
  });

  describe('Session Restoration', () => {
    test('false when no stored session', () => {
      expect(auth.restoreSession()).toBe(false);
    });

    test('restore from localStorage', async () => {
      await auth.login('testuser', 'password123');
      const token = auth.token;
      const newAuth = new AuthenticationModule();
      newAuth.restoreSession();
      expect(newAuth.token).toBe(token);
    });

    test('false for expired session', async () => {
      await auth.login('testuser', 'password123');
      const data = JSON.parse(localStorage.getItem('auth_session'));
      data.tokenExpiryTime = Date.now() - 1000;
      localStorage.setItem('auth_session', JSON.stringify(data));
      const newAuth = new AuthenticationModule();
      expect(newAuth.restoreSession()).toBe(false);
    });

    test('handle corrupted data', () => {
      localStorage.setItem('auth_session', 'invalid');
      expect(auth.restoreSession()).toBe(false);
    });
  });
});
