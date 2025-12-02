/**
 * Unit Tests for Authentication Module
 * Comprehensive test suite covering login, logout, and token refresh flows
 * Target: 80%+ code coverage
 */

const AuthenticationModule = require('../src/auth');

// Mock localStorage for Node.js environment
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock;

describe('AuthenticationModule', () => {
  let auth;

  beforeEach(() => {
    auth = new AuthenticationModule();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Constructor and Initialization', () => {
    test('should initialize with null values', () => {
      expect(auth.token).toBeNull();
      expect(auth.refreshToken).toBeNull();
      expect(auth.user).toBeNull();
      expect(auth.tokenExpiryTime).toBeNull();
    });

    test('should create a new instance', () => {
      expect(auth).toBeInstanceOf(AuthenticationModule);
    });
  });

  describe('Login Flow', () => {
    test('should successfully login with valid credentials', async () => {
      const result = await auth.login('testuser', 'password123');
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.username).toBe('testuser');
      expect(result.user.email).toBe('testuser@example.com');
      expect(result.expiresAt).toBeDefined();
    });

    test('should set internal token after successful login', async () => {
      await auth.login('testuser', 'password123');
      expect(auth.token).not.toBeNull();
      expect(auth.refreshToken).not.toBeNull();
      expect(auth.user).not.toBeNull();
      expect(auth.tokenExpiryTime).not.toBeNull();
    });

    test('should store session in localStorage after login', async () => {
      await auth.login('testuser', 'password123');
      const storedData = localStorage.getItem('auth_session');
      expect(storedData).not.toBeNull();
      const session = JSON.parse(storedData);
      expect(session.token).toBe(auth.token);
      expect(session.user.username).toBe('testuser');
    });

    test('should reject login with invalid credentials', async () => {
      await expect(auth.login('testuser', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });

    test('should reject login with missing username', async () => {
      await expect(auth.login('', 'password123')).rejects.toThrow('Username and password are required');
    });

    test('should reject login with missing password', async () => {
      await expect(auth.login('testuser', '')).rejects.toThrow('Username and password are required');
    });

    test('should reject login with both credentials missing', async () => {
      await expect(auth.login('', '')).rejects.toThrow('Username and password are required');
    });

    test('should generate unique tokens on each login', async () => {
      const result1 = await auth.login('testuser', 'password123');
      const auth2 = new AuthenticationModule();
      const result2 = await auth2.login('testuser', 'password123');
      expect(result1.token).not.toBe(result2.token);
      expect(result1.refreshToken).not.toBe(result2.refreshToken);
    });
  });

  describe('Logout Flow', () => {
    test('should successfully logout', async () => {
      await auth.login('testuser', 'password123');
      const result = await auth.logout();
      expect(result.success).toBe(true);
      expect(result.message).toBe('Logged out successfully');
    });

    test('should clear all tokens after logout', async () => {
      await auth.login('testuser', 'password123');
      expect(auth.token).not.toBeNull();
      await auth.logout();
      expect(auth.token).toBeNull();
      expect(auth.refreshToken).toBeNull();
      expect(auth.user).toBeNull();
      expect(auth.tokenExpiryTime).toBeNull();
    });

    test('should clear localStorage after logout', async () => {
      await auth.login('testuser', 'password123');
      expect(localStorage.getItem('auth_session')).not.toBeNull();
      await auth.logout();
      expect(localStorage.getItem('auth_session')).toBeNull();
    });

    test('should handle logout when not logged in', async () => {
      const result = await auth.logout();
      expect(result.success).toBe(true);
    });

    test('should be able to login again after logout', async () => {
      await auth.login('testuser', 'password123');
      await auth.logout();
      const result = await auth.login('testuser', 'password123');
      expect(result.success).toBe(true);
      expect(auth.token).not.toBeNull();
    });
  });

  describe('Token Refresh Flow', () => {
    test('should successfully refresh token', async () => {
      await auth.login('testuser', 'password123');
      const oldToken = auth.token;
      const result = await auth.refreshAuthToken();
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.token).not.toBe(oldToken);
      expect(result.expiresAt).toBeDefined();
    });

    test('should update internal token after refresh', async () => {
      await auth.login('testuser', 'password123');
      const oldToken = auth.token;
      await auth.refreshAuthToken();
      expect(auth.token).not.toBe(oldToken);
    });

    test('should update localStorage after token refresh', async () => {
      await auth.login('testuser', 'password123');
      const oldToken = auth.token;
      await auth.refreshAuthToken();
      const storedData = localStorage.getItem('auth_session');
      const session = JSON.parse(storedData);
      expect(session.token).toBe(auth.token);
      expect(session.token).not.toBe(oldToken);
    });

    test('should reject refresh without refresh token', async () => {
      await expect(auth.refreshAuthToken()).rejects.toThrow('No refresh token available');
    });

    test('should maintain refresh token after access token refresh', async () => {
      await auth.login('testuser', 'password123');
      const refreshToken = auth.refreshToken;
      await auth.refreshAuthToken();
      expect(auth.refreshToken).toBe(refreshToken);
    });
  });

  describe('Authentication Status', () => {
    test('should return false when not authenticated', () => {
      expect(auth.isAuthenticated()).toBe(false);
    });

    test('should return true when authenticated with valid token', async () => {
      await auth.login('testuser', 'password123');
      expect(auth.isAuthenticated()).toBe(true);
    });

    test('should return false after logout', async () => {
      await auth.login('testuser', 'password123');
      await auth.logout();
      expect(auth.isAuthenticated()).toBe(false);
    });

    test('should return false with expired token', async () => {
      await auth.login('testuser', 'password123');
      auth.tokenExpiryTime = Date.now() - 1000;
      expect(auth.isAuthenticated()).toBe(false);
    });
  });

  describe('Get Current User', () => {
    test('should return null when not logged in', () => {
      expect(auth.getCurrentUser()).toBeNull();
    });

    test('should return user object when logged in', async () => {
      await auth.login('testuser', 'password123');
      const user = auth.getCurrentUser();
      expect(user).not.toBeNull();
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('testuser@example.com');
      expect(user.id).toBeDefined();
      expect(user.roles).toContain('user');
    });

    test('should return null after logout', async () => {
      await auth.login('testuser', 'password123');
      await auth.logout();
      expect(auth.getCurrentUser()).toBeNull();
    });
  });

  describe('Get Token', () => {
    test('should return null when not logged in', () => {
      expect(auth.getToken()).toBeNull();
    });

    test('should return token when logged in', async () => {
      await auth.login('testuser', 'password123');
      const token = auth.getToken();
      expect(token).not.toBeNull();
      expect(typeof token).toBe('string');
      expect(token).toMatch(/^tok_/);
    });
  });

  describe('Token Refresh Check', () => {
    test('should return false when not logged in', () => {
      expect(auth.needsTokenRefresh()).toBe(false);
    });

    test('should return false with fresh token', async () => {
      await auth.login('testuser', 'password123');
      expect(auth.needsTokenRefresh()).toBe(false);
    });

    test('should return true when token expires soon', async () => {
      await auth.login('testuser', 'password123');
      auth.tokenExpiryTime = Date.now() + (4 * 60 * 1000);
      expect(auth.needsTokenRefresh()).toBe(true);
    });
  });

  describe('Session Restoration', () => {
    test('should restore valid session from localStorage', async () => {
      await auth.login('testuser', 'password123');
      const originalToken = auth.token;
      const auth2 = new AuthenticationModule();
      const restored = auth2.restoreSession();
      expect(restored).toBe(true);
      expect(auth2.token).toBe(originalToken);
    });

    test('should not restore when no session exists', () => {
      const restored = auth.restoreSession();
      expect(restored).toBe(false);
      expect(auth.token).toBeNull();
    });

    test('should not restore expired session', async () => {
      await auth.login('testuser', 'password123');
      const storedData = localStorage.getItem('auth_session');
      const session = JSON.parse(storedData);
      session.tokenExpiryTime = Date.now() - 1000;
      localStorage.setItem('auth_session', JSON.stringify(session));
      const auth2 = new AuthenticationModule();
      const restored = auth2.restoreSession();
      expect(restored).toBe(false);
    });

    test('should handle invalid session data', () => {
      localStorage.setItem('auth_session', 'invalid json');
      const restored = auth.restoreSession();
      expect(restored).toBe(false);
    });
  });

  describe('Private Helper Methods', () => {
    test('_generateToken should create unique tokens', () => {
      const token1 = auth._generateToken();
      const token2 = auth._generateToken();
      expect(token1).not.toBe(token2);
      expect(token1).toMatch(/^tok_/);
    });
  });

  describe('Edge Cases', () => {
    test('should handle null username', async () => {
      await expect(auth.login(null, 'password123')).rejects.toThrow();
    });

    test('should handle null password', async () => {
      await expect(auth.login('testuser', null)).rejects.toThrow();
    });

    test('should handle undefined credentials', async () => {
      await expect(auth.login(undefined, undefined)).rejects.toThrow();
    });
  });
});
