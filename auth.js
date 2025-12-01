/**
 * Authentication Module
 * Handles user authentication, session management, and token validation
 */

class AuthenticationModule {
  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.tokenExpiry = 3600000; // 1 hour in milliseconds
  }

  /**
   * Registers a new user
   * @param {string} username - The username
   * @param {string} password - The password
   * @param {string} email - The email address
   * @returns {Object} Result object with success status and message
   */
  register(username, password, email) {
    // Validate inputs
    if (!username || !password || !email) {
      return { success: false, message: 'All fields are required' };
    }

    if (username.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters' };
    }

    if (password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters' };
    }

    if (!this.isValidEmail(email)) {
      return { success: false, message: 'Invalid email format' };
    }

    // Check if user already exists
    if (this.users.has(username)) {
      return { success: false, message: 'Username already exists' };
    }

    // Check if email is already registered
    for (let [, user] of this.users) {
      if (user.email === email) {
        return { success: false, message: 'Email already registered' };
      }
    }

    // Hash password (simplified for demo)
    const hashedPassword = this.hashPassword(password);

    // Store user
    this.users.set(username, {
      username,
      password: hashedPassword,
      email,
      createdAt: Date.now(),
      isActive: true
    });

    return { success: true, message: 'User registered successfully', username };
  }

  /**
   * Authenticates a user and creates a session
   * @param {string} username - The username
   * @param {string} password - The password
   * @returns {Object} Result object with success status, message, and token
   */
  login(username, password) {
    // Validate inputs
    if (!username || !password) {
      return { success: false, message: 'Username and password are required' };
    }

    // Check if user exists
    const user = this.users.get(username);
    if (!user) {
      return { success: false, message: 'Invalid username or password' };
    }

    // Check if account is active
    if (!user.isActive) {
      return { success: false, message: 'Account is inactive' };
    }

    // Verify password
    const hashedPassword = this.hashPassword(password);
    if (user.password !== hashedPassword) {
      return { success: false, message: 'Invalid username or password' };
    }

    // Generate session token
    const token = this.generateToken();
    const expiresAt = Date.now() + this.tokenExpiry;

    // Store session
    this.sessions.set(token, {
      username,
      createdAt: Date.now(),
      expiresAt
    });

    return {
      success: true,
      message: 'Login successful',
      token,
      expiresAt
    };
  }

  /**
   * Logs out a user by invalidating their session
   * @param {string} token - The session token
   * @returns {Object} Result object with success status and message
   */
  logout(token) {
    if (!token) {
      return { success: false, message: 'Token is required' };
    }

    if (!this.sessions.has(token)) {
      return { success: false, message: 'Invalid token' };
    }

    this.sessions.delete(token);
    return { success: true, message: 'Logout successful' };
  }

  /**
   * Validates a session token
   * @param {string} token - The session token
   * @returns {Object} Result object with validity status and user info
   */
  validateToken(token) {
    if (!token) {
      return { valid: false, message: 'Token is required' };
    }

    const session = this.sessions.get(token);
    if (!session) {
      return { valid: false, message: 'Invalid token' };
    }

    // Check if token is expired
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(token);
      return { valid: false, message: 'Token expired' };
    }

    return {
      valid: true,
      username: session.username,
      expiresAt: session.expiresAt
    };
  }

  /**
   * Changes a user's password
   * @param {string} username - The username
   * @param {string} oldPassword - The current password
   * @param {string} newPassword - The new password
   * @returns {Object} Result object with success status and message
   */
  changePassword(username, oldPassword, newPassword) {
    if (!username || !oldPassword || !newPassword) {
      return { success: false, message: 'All fields are required' };
    }

    if (newPassword.length < 8) {
      return { success: false, message: 'New password must be at least 8 characters' };
    }

    const user = this.users.get(username);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Verify old password
    const hashedOldPassword = this.hashPassword(oldPassword);
    if (user.password !== hashedOldPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }

    // Update password
    user.password = this.hashPassword(newPassword);
    this.users.set(username, user);

    // Invalidate all existing sessions for this user
    for (let [token, session] of this.sessions) {
      if (session.username === username) {
        this.sessions.delete(token);
      }
    }

    return { success: true, message: 'Password changed successfully' };
  }

  /**
   * Deactivates a user account
   * @param {string} username - The username
   * @returns {Object} Result object with success status and message
   */
  deactivateAccount(username) {
    if (!username) {
      return { success: false, message: 'Username is required' };
    }

    const user = this.users.get(username);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    user.isActive = false;
    this.users.set(username, user);

    // Invalidate all sessions for this user
    for (let [token, session] of this.sessions) {
      if (session.username === username) {
        this.sessions.delete(token);
      }
    }

    return { success: true, message: 'Account deactivated successfully' };
  }

  /**
   * Gets user information (excluding sensitive data)
   * @param {string} username - The username
   * @returns {Object} User information or null if not found
   */
  getUserInfo(username) {
    const user = this.users.get(username);
    if (!user) {
      return null;
    }

    return {
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      isActive: user.isActive
    };
  }

  /**
   * Validates email format
   * @param {string} email - The email address
   * @returns {boolean} True if valid, false otherwise
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Simple password hashing (for demo purposes)
   * In production, use bcrypt or similar
   * @param {string} password - The password to hash
   * @returns {string} Hashed password
   */
  hashPassword(password) {
    // Simple hash for demo - in production use bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * Generates a random session token
   * @returns {string} Random token
   */
  generateToken() {
    return Math.random().toString(36).substring(2) + 
           Date.now().toString(36) + 
           Math.random().toString(36).substring(2);
  }

  /**
   * Clears all expired sessions
   * @returns {number} Number of sessions cleared
   */
  clearExpiredSessions() {
    let cleared = 0;
    const now = Date.now();
    
    for (let [token, session] of this.sessions) {
      if (now > session.expiresAt) {
        this.sessions.delete(token);
        cleared++;
      }
    }
    
    return cleared;
  }

  /**
   * Resets the authentication module (for testing)
   */
  reset() {
    this.users.clear();
    this.sessions.clear();
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthenticationModule;
}
