/**
 * Authentication Module
 * Handles user authentication, login, logout, and token management
 */

class AuthenticationModule {
  constructor() {
    this.token = null;
    this.refreshToken = null;
    this.user = null;
    this.tokenExpiryTime = null;
  }

  /**
   * Login user with credentials
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<Object>} Login response with token and user info
   */
  async login(username, password) {
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate authentication logic
        if (username === 'testuser' && password === 'password123') {
          const token = this._generateToken();
          const refreshToken = this._generateToken();
          const expiryTime = Date.now() + 3600000; // 1 hour from now

          this.token = token;
          this.refreshToken = refreshToken;
          this.tokenExpiryTime = expiryTime;
          this.user = {
            id: '12345',
            username: username,
            email: `${username}@example.com`,
            roles: ['user']
          };

          // Store in localStorage
          this._saveToStorage();

          resolve({
            success: true,
            token: token,
            refreshToken: refreshToken,
            user: this.user,
            expiresAt: expiryTime
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 100);
    });
  }

  /**
   * Logout user and clear session
   * @returns {Promise<Object>} Logout response
   */
  async logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.token = null;
        this.refreshToken = null;
        this.user = null;
        this.tokenExpiryTime = null;

        // Clear localStorage
        this._clearStorage();

        resolve({
          success: true,
          message: 'Logged out successfully'
        });
      }, 50);
    });
  }

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} New token information
   */
  async refreshAuthToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate token refresh
        if (this.refreshToken) {
          const newToken = this._generateToken();
          const newExpiryTime = Date.now() + 3600000; // 1 hour from now

          this.token = newToken;
          this.tokenExpiryTime = newExpiryTime;

          // Update storage
          this._saveToStorage();

          resolve({
            success: true,
            token: newToken,
            expiresAt: newExpiryTime
          });
        } else {
          reject(new Error('Invalid refresh token'));
        }
      }, 100);
    });
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    if (!this.token || !this.tokenExpiryTime) {
      return false;
    }

    // Check if token is expired
    return Date.now() < this.tokenExpiryTime;
  }

  /**
   * Get current user information
   * @returns {Object|null} User object or null if not authenticated
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Get current authentication token
   * @returns {string|null} Authentication token
   */
  getToken() {
    return this.token;
  }

  /**
   * Check if token needs refresh (within 5 minutes of expiry)
   * @returns {boolean} Whether token needs refresh
   */
  needsTokenRefresh() {
    if (!this.tokenExpiryTime) {
      return false;
    }

    const fiveMinutes = 5 * 60 * 1000;
    return (this.tokenExpiryTime - Date.now()) < fiveMinutes;
  }

  /**
   * Restore session from localStorage
   * @returns {boolean} Whether session was restored
   */
  restoreSession() {
    try {
      const storedData = localStorage.getItem('auth_session');
      if (!storedData) {
        return false;
      }

      const session = JSON.parse(storedData);
      
      // Check if session is still valid
      if (session.tokenExpiryTime && Date.now() < session.tokenExpiryTime) {
        this.token = session.token;
        this.refreshToken = session.refreshToken;
        this.user = session.user;
        this.tokenExpiryTime = session.tokenExpiryTime;
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  // Private helper methods

  /**
   * Generate a random token
   * @private
   */
  _generateToken() {
    return 'tok_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
  }

  /**
   * Save session to localStorage
   * @private
   */
  _saveToStorage() {
    try {
      const session = {
        token: this.token,
        refreshToken: this.refreshToken,
        user: this.user,
        tokenExpiryTime: this.tokenExpiryTime
      };
      localStorage.setItem('auth_session', JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session to storage:', error);
    }
  }

  /**
   * Clear session from localStorage
   * @private
   */
  _clearStorage() {
    try {
      localStorage.removeItem('auth_session');
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

// Export for use in both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthenticationModule;
} else {
  window.AuthenticationModule = AuthenticationModule;
}
