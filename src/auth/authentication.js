/**
 * Authentication Module
 * Handles user authentication, token management, and session control
 */

class AuthenticationService {
  constructor() {
    this.currentUser = null;
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    this.sessionTimeout = 3600000; // 1 hour in milliseconds
  }

  /**
   * Authenticates a user with username and password
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<Object>} Authentication result with tokens
   */
  async login(username, password) {
    // Validate input
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    try {
      // Simulate API call
      const response = await this._authenticateUser(username, password);
      
      if (!response.success) {
        throw new Error('Invalid credentials');
      }

      // Store authentication data
      this.currentUser = response.user;
      this.accessToken = response.accessToken;
      this.refreshToken = response.refreshToken;
      this.tokenExpiry = Date.now() + this.sessionTimeout;

      // Store in localStorage for persistence
      this._persistSession();

      return {
        success: true,
        user: this.currentUser,
        accessToken: this.accessToken,
        message: 'Login successful'
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Logs out the current user and clears session data
   * @returns {Object} Logout result
   */
  logout() {
    if (!this.currentUser) {
      throw new Error('No user is currently logged in');
    }

    const username = this.currentUser.username;

    // Clear all authentication data
    this.currentUser = null;
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;

    // Clear localStorage
    this._clearSession();

    return {
      success: true,
      message: `User ${username} logged out successfully`
    };
  }

  /**
   * Refreshes the access token using the refresh token
   * @returns {Promise<Object>} New access token
   */
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    if (!this.currentUser) {
      throw new Error('No active session');
    }

    try {
      // Simulate API call to refresh token
      const response = await this._refreshTokenAPI(this.refreshToken);
      
      if (!response.success) {
        throw new Error('Token refresh failed');
      }

      // Update tokens
      this.accessToken = response.accessToken;
      this.refreshToken = response.refreshToken || this.refreshToken;
      this.tokenExpiry = Date.now() + this.sessionTimeout;

      // Update localStorage
      this._persistSession();

      return {
        success: true,
        accessToken: this.accessToken,
        message: 'Token refreshed successfully'
      };
    } catch (error) {
      // Clear session on refresh failure
      this.logout();
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  /**
   * Checks if the current session is valid
   * @returns {boolean} True if session is valid
   */
  isAuthenticated() {
    if (!this.currentUser || !this.accessToken) {
      return false;
    }

    // Check if token has expired
    if (this.tokenExpiry && Date.now() > this.tokenExpiry) {
      return false;
    }

    return true;
  }

  /**
   * Gets the current authenticated user
   * @returns {Object|null} Current user or null
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Gets the current access token
   * @returns {string|null} Current access token or null
   */
  getAccessToken() {
    return this.accessToken;
  }

  /**
   * Checks if token needs refresh (expires in less than 5 minutes)
   * @returns {boolean} True if token needs refresh
   */
  needsTokenRefresh() {
    if (!this.tokenExpiry) {
      return false;
    }

    const fiveMinutes = 5 * 60 * 1000;
    return (this.tokenExpiry - Date.now()) < fiveMinutes;
  }

  /**
   * Simulates user authentication API call
   * @private
   */
  async _authenticateUser(username, password) {
    // Simulate network delay
    await this._delay(100);

    // Simulate authentication logic
    if (username === 'testuser' && password === 'password123') {
      return {
        success: true,
        user: {
          id: '12345',
          username: username,
          email: `${username}@example.com`,
          role: 'user'
        },
        accessToken: this._generateToken('access'),
        refreshToken: this._generateToken('refresh')
      };
    }

    return { success: false };
  }

  /**
   * Simulates token refresh API call
   * @private
   */
  async _refreshTokenAPI(refreshToken) {
    // Simulate network delay
    await this._delay(100);

    // Validate refresh token format
    if (!refreshToken.startsWith('refresh_')) {
      return { success: false };
    }

    return {
      success: true,
      accessToken: this._generateToken('access'),
      refreshToken: this._generateToken('refresh')
    };
  }

  /**
   * Generates a mock token
   * @private
   */
  _generateToken(type) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${type}_${timestamp}_${random}`;
  }

  /**
   * Persists session to localStorage
   * @private
   */
  _persistSession() {
    if (typeof localStorage !== 'undefined') {
      const sessionData = {
        user: this.currentUser,
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        tokenExpiry: this.tokenExpiry
      };
      localStorage.setItem('auth_session', JSON.stringify(sessionData));
    }
  }

  /**
   * Clears session from localStorage
   * @private
   */
  _clearSession() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth_session');
    }
  }

  /**
   * Restores session from localStorage
   */
  restoreSession() {
    if (typeof localStorage === 'undefined') {
      return false;
    }

    const sessionData = localStorage.getItem('auth_session');
    if (!sessionData) {
      return false;
    }

    try {
      const data = JSON.parse(sessionData);
      
      // Check if session has expired
      if (data.tokenExpiry && Date.now() > data.tokenExpiry) {
        this._clearSession();
        return false;
      }

      this.currentUser = data.user;
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.tokenExpiry = data.tokenExpiry;

      return true;
    } catch (error) {
      this._clearSession();
      return false;
    }
  }

  /**
   * Utility function to simulate delay
   * @private
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthenticationService;
}