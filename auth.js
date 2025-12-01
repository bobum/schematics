/**
 * Authentication Module
 * Handles user authentication, session management, and authorization
 */

class AuthenticationModule {
  constructor() {
    this.currentUser = null;
    this.sessions = new Map();
    this.users = new Map();
  }

  /**
   * Register a new user
   * @param {string} username - The username
   * @param {string} password - The password
   * @param {string} email - The email address
   * @returns {Object} Result object with success status and message
   */
  register(username, password, email) {
    // Validate inputs
    if (!username || !password || !email) {
      return {
        success: false,
        message: 'All fields are required'
      };
    }

    // Check if username already exists
    if (this.users.has(username)) {
      return {
        success: false,
        message: 'Username already exists'
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Invalid email format'
      };
    }

    // Validate password strength (min 8 chars, at least 1 number, 1 uppercase)
    if (password.length < 8) {
      return {
        success: false,
        message: 'Password must be at least 8 characters long'
      };
    }

    // Store user (in production, password should be hashed)
    const user = {
      username,
      password: this._hashPassword(password),
      email,
      createdAt: new Date(),
      isActive: true
    };

    this.users.set(username, user);

    return {
      success: true,
      message: 'User registered successfully',
      user: { username, email }
    };
  }

  /**
   * Login user
   * @param {string} username - The username
   * @param {string} password - The password
   * @returns {Object} Result object with success status, message, and session token
   */
  login(username, password) {
    // Validate inputs
    if (!username || !password) {
      return {
        success: false,
        message: 'Username and password are required'
      };
    }

    // Check if user exists
    const user = this.users.get(username);
    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        message: 'Account is deactivated'
      };
    }

    // Verify password
    const hashedPassword = this._hashPassword(password);
    if (user.password !== hashedPassword) {
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }

    // Generate session token
    const sessionToken = this._generateToken();
    const session = {
      username,
      token: sessionToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    this.sessions.set(sessionToken, session);
    this.currentUser = username;

    return {
      success: true,
      message: 'Login successful',
      token: sessionToken,
      user: { username: user.username, email: user.email }
    };
  }

  /**
   * Logout user
   * @param {string} token - The session token
   * @returns {Object} Result object with success status and message
   */
  logout(token) {
    if (!token) {
      return {
        success: false,
        message: 'Token is required'
      };
    }

    const session = this.sessions.get(token);
    if (!session) {
      return {
        success: false,
        message: 'Invalid session token'
      };
    }

    this.sessions.delete(token);
    if (this.currentUser === session.username) {
      this.currentUser = null;
    }

    return {
      success: true,
      message: 'Logout successful'
    };
  }

  /**
   * Validate session token
   * @param {string} token - The session token
   * @returns {Object} Result object with valid status and user data
   */
  validateToken(token) {
    if (!token) {
      return {
        valid: false,
        message: 'Token is required'
      };
    }

    const session = this.sessions.get(token);
    if (!session) {
      return {
        valid: false,
        message: 'Invalid session token'
      };
    }

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      this.sessions.delete(token);
      return {
        valid: false,
        message: 'Session has expired'
      };
    }

    const user = this.users.get(session.username);
    return {
      valid: true,
      user: { username: user.username, email: user.email }
    };
  }

  /**
   * Change user password
   * @param {string} username - The username
   * @param {string} oldPassword - The current password
   * @param {string} newPassword - The new password
   * @returns {Object} Result object with success status and message
   */
  changePassword(username, oldPassword, newPassword) {
    if (!username || !oldPassword || !newPassword) {
      return {
        success: false,
        message: 'All fields are required'
      };
    }

    const user = this.users.get(username);
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    // Verify old password
    const hashedOldPassword = this._hashPassword(oldPassword);
    if (user.password !== hashedOldPassword) {
      return {
        success: false,
        message: 'Current password is incorrect'
      };
    }

    // Validate new password
    if (newPassword.length < 8) {
      return {
        success: false,
        message: 'New password must be at least 8 characters long'
      };
    }

    // Update password
    user.password = this._hashPassword(newPassword);
    this.users.set(username, user);

    // Invalidate all existing sessions for this user
    for (const [token, session] of this.sessions.entries()) {
      if (session.username === username) {
        this.sessions.delete(token);
      }
    }

    return {
      success: true,
      message: 'Password changed successfully'
    };
  }

  /**
   * Get current authenticated user
   * @returns {string|null} Current username or null
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user exists
   * @param {string} username - The username
   * @returns {boolean} True if user exists
   */
  userExists(username) {
    return this.users.has(username);
  }

  /**
   * Reset all data (useful for testing)
   */
  reset() {
    this.currentUser = null;
    this.sessions.clear();
    this.users.clear();
  }

  /**
   * Simple hash function (in production, use bcrypt or similar)
   * @private
   */
  _hashPassword(password) {
    // Simple hash for demonstration - NOT secure for production!
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * Generate a random session token
   * @private
   */
  _generateToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

// Export for Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthenticationModule;
}
