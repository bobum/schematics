/**
 * Authentication Module
 * Handles user authentication, token management, and session control
 */

class AuthenticationModule {
  constructor() {
    this.token = null;
    this.refreshToken = null;
    this.user = null;
    this.tokenExpiry = null;
    this.listeners = [];
  }

  /**
   * Authenticates a user with credentials
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<Object>} Authentication result with token and user info
   */
  async login(username, password) {
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock authentication logic
        if (username === 'testuser' && password === 'password123') {
          const authData = {
            token: this._generateToken(),
            refreshToken: this._generateRefreshToken(),
            user: {
              id: '12345',
              username: username,
              email: `${username}@example.com`,
              role: 'user'
            },
            expiresIn: 3600 // 1 hour
          };

          this.token = authData.token;
          this.refreshToken = authData.refreshToken;
          this.user = authData.user;
          this.tokenExpiry = Date.now() + (authData.expiresIn * 1000);

          // Store in localStorage
          this._persistSession();

          // Notify listeners
          this._notifyListeners('login', this.user);

          resolve(authData);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 100);
    });
  }

  /**
   * Logs out the current user
   * @returns {Promise<boolean>} Success status
   */
  async logout() {
    if (!this.isAuthenticated()) {
      throw new Error('No active session to logout');
    }

    // Simulate API call to invalidate token
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.user;
        
        // Clear session data
        this.token = null;
        this.refreshToken = null;
        this.user = null;
        this.tokenExpiry = null;

        // Clear localStorage
        this._clearSession();

        // Notify listeners
        this._notifyListeners('logout', user);

        resolve(true);
      }, 50);
    });
  }

  /**
   * Refreshes the authentication token
   * @returns {Promise<Object>} New token data
   */
  async refreshAuthToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validate refresh token (mock validation)
        if (this.refreshToken && this.refreshToken.startsWith('refresh_')) {
          const newAuthData = {
            token: this._generateToken(),
            refreshToken: this._generateRefreshToken(),
            expiresIn: 3600
          };

          this.token = newAuthData.token;
          this.refreshToken = newAuthData.refreshToken;
          this.tokenExpiry = Date.now() + (newAuthData.expiresIn * 1000);

          // Update localStorage
          this._persistSession();

          // Notify listeners
          this._notifyListeners('tokenRefresh', { token: newAuthData.token });

          resolve(newAuthData);
        } else {
          this._clearSession();
          reject(new Error('Invalid refresh token'));
        }
      }, 100);
    });
  }

  /**
   * Checks if user is currently authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    if (!this.token || !this.tokenExpiry) {
      return false;
    }

    // Check if token is expired
    return Date.now() < this.tokenExpiry;
  }

  /**
   * Gets current authenticated user
   * @returns {Object|null} User object or null
   */
  getCurrentUser() {
    return this.isAuthenticated() ? this.user : null;
  }

  /**
   * Gets current authentication token
   * @returns {string|null} Token or null
   */
  getToken() {
    return this.isAuthenticated() ? this.token : null;
  }

  /**
   * Checks if token needs refresh (within 5 minutes of expiry)
   * @returns {boolean} Whether token should be refreshed
   */
  shouldRefreshToken() {
    if (!this.tokenExpiry) {
      return false;
    }

    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() > (this.tokenExpiry - fiveMinutes);
  }

  /**
   * Restores session from localStorage
   * @returns {boolean} Whether session was restored
   */
  restoreSession() {
    try {
      const sessionData = localStorage.getItem('auth_session');
      if (!sessionData) {
        return false;
      }

      const parsed = JSON.parse(sessionData);
      
      // Check if session is still valid
      if (parsed.tokenExpiry && Date.now() < parsed.tokenExpiry) {
        this.token = parsed.token;
        this.refreshToken = parsed.refreshToken;
        this.user = parsed.user;
        this.tokenExpiry = parsed.tokenExpiry;
        return true;
      }

      // Session expired, clear it
      this._clearSession();
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Adds event listener for auth events
   * @param {Function} callback - Callback function
   */
  addListener(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  /**
   * Removes event listener
   * @param {Function} callback - Callback function to remove
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  // Private methods

  _generateToken() {
    return `token_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
  }

  _generateRefreshToken() {
    return `refresh_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
  }

  _persistSession() {
    try {
      const sessionData = {
        token: this.token,
        refreshToken: this.refreshToken,
        user: this.user,
        tokenExpiry: this.tokenExpiry
      };
      localStorage.setItem('auth_session', JSON.stringify(sessionData));
    } catch (error) {
      console.error('Failed to persist session:', error);
    }
  }

  _clearSession() {
    try {
      localStorage.removeItem('auth_session');
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  _notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }
}

// Export for use in tests and application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthenticationModule;
}
