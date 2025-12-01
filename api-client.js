/**
 * User Preferences API Client
 * Frontend integration for test_002 feature
 * 
 * This module provides easy-to-use functions for interacting with the
 * User Preferences REST API from the frontend application.
 */

class UserPreferencesAPI {
  /**
   * Initialize the API client
   * @param {string} baseURL - Base URL of the API server (default: http://localhost:3000)
   */
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.apiPath = '/api/preferences';
  }

  /**
   * Make an API request
   * @private
   */
  async _request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Check API health status
   * @returns {Promise<Object>} Health status
   */
  async checkHealth() {
    return this._request('/api/health');
  }

  /**
   * Get all user preferences
   * @returns {Promise<Object>} All preferences
   */
  async getAllPreferences() {
    return this._request(this.apiPath);
  }

  /**
   * Get preferences for a specific user
   * @param {string} userId - User identifier
   * @returns {Promise<Object>} User preferences
   */
  async getUserPreferences(userId) {
    return this._request(`${this.apiPath}/${userId}`);
  }

  /**
   * Create or replace user preferences
   * @param {string} userId - User identifier
   * @param {Object} preferences - Preference data
   * @returns {Promise<Object>} Created/updated preferences
   */
  async savePreferences(userId, preferences) {
    return this._request(`${this.apiPath}/${userId}`, {
      method: 'POST',
      body: JSON.stringify(preferences)
    });
  }

  /**
   * Update specific preference fields for a user
   * @param {string} userId - User identifier
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated preferences
   */
  async updatePreferences(userId, updates) {
    return this._request(`${this.apiPath}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  /**
   * Delete user preferences
   * @param {string} userId - User identifier
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deletePreferences(userId) {
    return this._request(`${this.apiPath}/${userId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Get a specific preference value
   * @param {string} userId - User identifier
   * @param {string} key - Preference key
   * @returns {Promise<any>} Preference value
   */
  async getPreference(userId, key) {
    const response = await this.getUserPreferences(userId);
    return response.data[key];
  }

  /**
   * Set a specific preference value
   * @param {string} userId - User identifier
   * @param {string} key - Preference key
   * @param {any} value - Preference value
   * @returns {Promise<Object>} Updated preferences
   */
  async setPreference(userId, key, value) {
    return this.updatePreferences(userId, { [key]: value });
  }
}

// Create a singleton instance
const preferencesAPI = new UserPreferencesAPI();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UserPreferencesAPI, preferencesAPI };
}

/**
 * USAGE EXAMPLES:
 * 
 * // Initialize the API client
 * const api = new UserPreferencesAPI('http://localhost:3000');
 * 
 * // Or use the singleton
 * // const api = preferencesAPI;
 * 
 * // Check API health
 * api.checkHealth()
 *   .then(health => console.log('API Status:', health.status));
 * 
 * // Save user preferences
 * api.savePreferences('user123', {
 *   theme: 'dark',
 *   language: 'en',
 *   notifications: true
 * })
 *   .then(result => console.log('Saved:', result));
 * 
 * // Get user preferences
 * api.getUserPreferences('user123')
 *   .then(result => console.log('Preferences:', result.data));
 * 
 * // Update a single preference
 * api.setPreference('user123', 'theme', 'light')
 *   .then(result => console.log('Updated:', result));
 * 
 * // Get a single preference
 * api.getPreference('user123', 'theme')
 *   .then(theme => console.log('Theme:', theme));
 * 
 * // Delete preferences
 * api.deletePreferences('user123')
 *   .then(result => console.log('Deleted:', result));
 */
