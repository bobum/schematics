/**
 * Authentication Module
 * Handles user authentication, token management, and session control
 */

class AuthenticationModule {
  constructor() {
    this.token = null;
    this.refreshToken = null;
    this.user = null;
    this.tokenExpiryTime = null;
  }

  /**
   * Authenticate user with username and password
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<Object>} Authentication result with token and user info
   */
  async login(username, password) {
    // Validate input
    if (!username || typeof username !== 'string') {
      throw new Error('Username is required and must be a string');
    }
    if (!password || typeof password !== 'string') {
      throw new Error('Password is required and must be a string');
    }

    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate authentication logic
        if (username === 'testuser' && password === 'password123') {
          const token = this._generateToken();
          const refreshToken = this._generateToken('refresh');
          const expiryTime = Date.now() + 3600000; // 1 hour from now

          this.token = token;
          this.refreshToken = refreshToken;
          this.tokenExpiryTime = expiryTime;
          this.user = {
            id: 1,
            username: username,
            email: `${username}@example.com`
          };

          // Store in localStorage
          this._saveToStorage();

          resolve({
            success: true,
            token: token,
            refreshToken: refreshToken,
            user: this.user,
            expiresIn: 3600
          });
        } else {
          reject(new Error('Invalid username or password'));
        }
      }, 100);
    });
  }

  /**
   * Logout user and clear session
   * @returns {Promise<Object>} Logout result
   */
  async logout() {
    if (!this.token) {
      throw new Error('No active session to logout');
    }

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Clear all authentication data
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

    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if refresh token is still valid
        if (this.refreshToken) {
          const newToken = this._generateToken();
          const newExpiryTime = Date.now() + 3600000; // 1 hour from now

          this.token = newToken;
          this.tokenExpiryTime = newExpiryTime;

          // Update localStorage
          this._saveToStorage();

          resolve({
            success: true,
            token: newToken,
            expiresIn: 3600
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
   * @returns {string|null} Token or null if not authenticated
   */
  getToken() {
    return this.token;
  }

  /**
   * Check if token needs refresh (expires in less than 5 minutes)
   * @returns {boolean} True if token needs refresh
   */
  needsRefresh() {
    if (!this.tokenExpiryTime) {
      return false;
    }
    const fiveMinutes = 5 * 60 * 1000;
    return (this.tokenExpiryTime - Date.now()) < fiveMinutes;
  }

  /**
   * Restore session from localStorage
   * @returns {boolean} True if session was restored
   */
  restoreSession() {
    try {
      const storedData = localStorage.getItem('auth_session');
      if (storedData) {
        const data = JSON.parse(storedData);
        this.token = data.token;
        this.refreshToken = data.refreshToken;
        this.user = data.user;
        this.tokenExpiryTime = data.tokenExpiryTime;
        return this.isAuthenticated();
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  // Private helper methods

  /**
   * Generate a mock token
   * @private
   * @param {string} type - Token type (access or refresh)
   * @returns {string} Generated token
   */
  _generateToken(type = 'access') {
    const prefix = type === 'refresh' ? 'refresh_' : 'access_';
    return prefix + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Save authentication data to localStorage
   * @private
   */
  _saveToStorage() {
    try {
      const data = {
        token: this.token,
        refreshToken: this.refreshToken,
        user: this.user,
        tokenExpiryTime: this.tokenExpiryTime
      };
      localStorage.setItem('auth_session', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  /**
   * Clear authentication data from localStorage
   * @private
   */
  _clearStorage() {
    try {
      localStorage.removeItem('auth_session');
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthenticationModule;
}
