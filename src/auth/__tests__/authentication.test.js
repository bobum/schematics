/**
 * Unit Tests for Authentication Module
 * Tests login, logout, token refresh flows with comprehensive coverage
 */

const AuthenticationService = require('../authentication');

// Mock localStorage
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

describe('AuthenticationService', () => {
  let authService;

  beforeEach(() => {
    authService = new AuthenticationService();
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Login Flow Tests', () => {
    test('should successfully login with valid credentials', async () => {
      const result = await authService.login('testuser', 'password123');

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.username).toBe('testuser');
      expect(result.user.email).toBe('testuser@example.com');
      expect(result.accessToken).toBeDefined();
      expect(result.accessToken).toContain('access_');
      expect(result.message).toBe('Login successful');
    });

    test('should store user data after successful login', async () => {
      await authService.login('testuser', 'password123');

      expect(authService.getCurrentUser()).toBeDefined();
      expect(authService.getCurrentUser().username).toBe('testuser');
      expect(authService.getAccessToken()).toBeDefined();
      expect(authService.isAuthenticated()).toBe(true);
    });

    test('should persist session to localStorage on login', async () => {
      await authService.login('testuser', 'password123');

      const sessionData = localStorage.getItem('auth_session');
      expect(sessionData).toBeDefined();
      
      const parsed = JSON.parse(sessionData);
      expect(parsed.user.username).toBe('testuser');
      expect(parsed.accessToken).toBeDefined();
      expect(parsed.refreshToken).toBeDefined();
    });

    test('should throw error when username is missing', async () => {
      await expect(authService.login('', 'password123'))
        .rejects.toThrow('Username and password are required');
    });

    test('should throw error when password is missing', async () => {
      await expect(authService.login('testuser', ''))
        .rejects.toThrow('Username and password are required');
    });

    test('should throw error when username is too short', async () => {
      await expect(authService.login('ab', 'password123'))
        .rejects.toThrow('Username must be at least 3 characters');
    });

    test('should throw error when password is too short', async () => {
      await expect(authService.login('testuser', '12345'))
        .rejects.toThrow('Password must be at least 6 characters');
    });

    test('should throw error with invalid credentials', async () => {
      await expect(authService.login('wronguser', 'wrongpass123'))
        .rejects.toThrow('Invalid credentials');
    });

    test('should set token expiry after login', async () => {
      const beforeLogin = Date.now();
      await authService.login('testuser', 'password123');
      
      expect(authService.tokenExpiry).toBeGreaterThan(beforeLogin);
      expect(authService.tokenExpiry).toBeLessThanOrEqual(Date.now() + authService.sessionTimeout + 100);
    });
  });

  describe('Logout Flow Tests', () => {
    beforeEach(async () => {
      await authService.login('testuser', 'password123');
    });

    test('should successfully logout authenticated user', () => {
      const result = authService.logout();

      expect(result.success).toBe(true);
      expect(result.message).toContain('testuser');
      expect(result.message).toContain('logged out successfully');
    });

    test('should clear user data after logout', () => {
      authService.logout();

      expect(authService.getCurrentUser()).toBeNull();
      expect(authService.getAccessToken()).toBeNull();
      expect(authService.refreshToken).toBeNull();
      expect(authService.tokenExpiry).toBeNull();
    });

    test('should clear localStorage after logout', () => {
      authService.logout();

      const sessionData = localStorage.getItem('auth_session');
      expect(sessionData).toBeNull();
    });

    test('should set isAuthenticated to false after logout', () => {
      authService.logout();

      expect(authService.isAuthenticated()).toBe(false);
    });

    test('should throw error when logging out without active session', () => {
      authService.logout();
      
      expect(() => authService.logout()).toThrow('No user is currently logged in');
    });
  });

  describe('Token Refresh Flow Tests', () => {
    beforeEach(async () => {
      await authService.login('testuser', 'password123');
    });

    test('should successfully refresh access token', async () => {
      const oldToken = authService.getAccessToken();
      
      const result = await authService.refreshAccessToken();

      expect(result.success).toBe(true);
      expect(result.accessToken).toBeDefined();
      expect(result.accessToken).not.toBe(oldToken);
      expect(result.message).toBe('Token refreshed successfully');
    });

    test('should update token expiry after refresh', async () => {
      const oldExpiry = authService.tokenExpiry;
      
      await new Promise(resolve => setTimeout(resolve, 10));
      await authService.refreshAccessToken();

      expect(authService.tokenExpiry).toBeGreaterThan(oldExpiry);
    });

    test('should persist new token to localStorage', async () => {
      await authService.refreshAccessToken();

      const sessionData = localStorage.getItem('auth_session');
      const parsed = JSON.parse(sessionData);
      
      expect(parsed.accessToken).toBe(authService.getAccessToken());
    });

    test('should throw error when refreshing without refresh token', async () => {
      authService.refreshToken = null;

      await expect(authService.refreshAccessToken())
        .rejects.toThrow('No refresh token available');
    });

    test('should throw error when refreshing without active session', async () => {
      authService.logout();
      authService.refreshToken = 'refresh_token_123';

      await expect(authService.refreshAccessToken())
        .rejects.toThrow('No active session');
    });

    test('should maintain user session after token refresh', async () => {
      const userBefore = authService.getCurrentUser();
      
      await authService.refreshAccessToken();
      
      expect(authService.getCurrentUser()).toEqual(userBefore);
      expect(authService.isAuthenticated()).toBe(true);
    });

    test('should handle token refresh failure gracefully', async () => {
      authService.refreshToken = 'invalid_token';

      await expect(authService.refreshAccessToken())
        .rejects.toThrow('Token refresh failed');
      
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('Session Management Tests', () => {
    test('isAuthenticated should return false with no session', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    test('isAuthenticated should return true with valid session', async () => {
      await authService.login('testuser', 'password123');
      expect(authService.isAuthenticated()).toBe(true);
    });

    test('isAuthenticated should return false with expired token', async () => {
      await authService.login('testuser', 'password123');
      authService.tokenExpiry = Date.now() - 1000;
      expect(authService.isAuthenticated()).toBe(false);
    });

    test('should restore valid session from localStorage', async () => {
      await authService.login('testuser', 'password123');
      const token = authService.getAccessToken();

      const newAuthService = new AuthenticationService();
      const restored = newAuthService.restoreSession();

      expect(restored).toBe(true);
      expect(newAuthService.getCurrentUser().username).toBe('testuser');
      expect(newAuthService.getAccessToken()).toBe(token);
      expect(newAuthService.isAuthenticated()).toBe(true);
    });

    test('should not restore expired session', async () => {
      await authService.login('testuser', 'password123');
      
      const sessionData = JSON.parse(localStorage.getItem('auth_session'));
      sessionData.tokenExpiry = Date.now() - 1000;
      localStorage.setItem('auth_session', JSON.stringify(sessionData));

      const newAuthService = new AuthenticationService();
      const restored = newAuthService.restoreSession();

      expect(restored).toBe(false);
      expect(localStorage.getItem('auth_session')).toBeNull();
    });

    test('should return false when restoring with no session data', () => {
      const restored = authService.restoreSession();
      expect(restored).toBe(false);
    });

    test('should handle corrupted session data gracefully', () => {
      localStorage.setItem('auth_session', 'invalid json data');
      const restored = authService.restoreSession();
      expect(restored).toBe(false);
      expect(localStorage.getItem('auth_session')).toBeNull();
    });
  });

  describe('Token Expiry Management Tests', () => {
    beforeEach(async () => {
      await authService.login('testuser', 'password123');
    });

    test('needsTokenRefresh should return false with fresh token', () => {
      expect(authService.needsTokenRefresh()).toBe(false);
    });

    test('needsTokenRefresh should return true when token expires soon', () => {
      authService.tokenExpiry = Date.now() + (3 * 60 * 1000);
      expect(authService.needsTokenRefresh()).toBe(true);
    });

    test('needsTokenRefresh should return false with no expiry set', () => {
      authService.tokenExpiry = null;
      expect(authService.needsTokenRefresh()).toBe(false);
    });
  });

  describe('Getter Methods Tests', () => {
    test('getCurrentUser should return null when not authenticated', () => {
      expect(authService.getCurrentUser()).toBeNull();
    });

    test('getCurrentUser should return user object when authenticated', async () => {
      await authService.login('testuser', 'password123');
      
      const user = authService.getCurrentUser();
      expect(user).toBeDefined();
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('testuser@example.com');
      expect(user.role).toBe('user');
    });

    test('getAccessToken should return null when not authenticated', () => {
      expect(authService.getAccessToken()).toBeNull();
    });

    test('getAccessToken should return token when authenticated', async () => {
      await authService.login('testuser', 'password123');
      
      const token = authService.getAccessToken();
      expect(token).toBeDefined();
      expect(token).toContain('access_');
    });
  });

  describe('Edge Cases Tests', () => {
    test('should handle multiple login attempts correctly', async () => {
      await authService.login('testuser', 'password123');
      const firstToken = authService.getAccessToken();
      
      await authService.login('testuser', 'password123');
      const secondToken = authService.getAccessToken();
      
      expect(secondToken).not.toBe(firstToken);
      expect(authService.isAuthenticated()).toBe(true);
    });

    test('should handle rapid token refresh requests', async () => {
      await authService.login('testuser', 'password123');
      
      const [result1, result2] = await Promise.all([
        authService.refreshAccessToken(),
        authService.refreshAccessToken()
      ]);
      
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });

    test('_generateToken should create unique tokens', () => {
      const token1 = authService._generateToken('access');
      const token2 = authService._generateToken('access');
      
      expect(token1).not.toBe(token2);
      expect(token1).toContain('access_');
    });
  });
});
