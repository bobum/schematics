/**
 * Client Integration Examples
 * 
 * Examples of how to integrate the User Preferences API
 * with frontend applications
 */

// Base API URL
const API_BASE_URL = 'http://localhost:3000/api/preferences';

/**
 * Preferences API Client
 */
class PreferencesClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get all preferences
   */
  async getAllPreferences() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error('Failed to fetch preferences');
      return await response.json();
    } catch (error) {
      console.error('Error getting preferences:', error);
      throw error;
    }
  }

  /**
   * Get preferences for a specific user
   */
  async getUserPreferences(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null; // User preferences not found
        }
        throw new Error('Failed to fetch user preferences');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw error;
    }
  }

  /**
   * Create new user preferences
   */
  async createPreferences(preferences) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create preferences');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating preferences:', error);
      throw error;
    }
  }

  /**
   * Update preferences (full replacement)
   */
  async updatePreferences(userId, preferences) {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update preferences');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  /**
   * Partially update preferences
   */
  async patchPreferences(userId, updates) {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to patch preferences');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error patching preferences:', error);
      throw error;
    }
  }

  /**
   * Delete user preferences
   */
  async deletePreferences(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete preferences');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting preferences:', error);
      throw error;
    }
  }

  /**
   * Update only the theme
   */
  async updateTheme(userId, theme) {
    return this.patchPreferences(userId, { theme });
  }

  /**
   * Update only notifications setting
   */
  async updateNotifications(userId, enabled) {
    return this.patchPreferences(userId, { notifications: enabled });
  }

  /**
   * Update display settings
   */
  async updateDisplaySettings(userId, displaySettings) {
    return this.patchPreferences(userId, { displaySettings });
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PreferencesClient;
}

// Example Usage
(async () => {
  // Initialize client
  const client = new PreferencesClient();

  try {
    // Example 1: Create new preferences
    console.log('Creating preferences...');
    const created = await client.createPreferences({
      theme: 'dark',
      notifications: true,
      language: 'en',
      displaySettings: {
        fontSize: 'medium',
        density: 'comfortable'
      }
    });
    console.log('Created:', created);

    const userId = created.data.userId;

    // Example 2: Get user preferences
    console.log('\nGetting preferences...');
    const preferences = await client.getUserPreferences(userId);
    console.log('Retrieved:', preferences);

    // Example 3: Update theme
    console.log('\nUpdating theme...');
    const updatedTheme = await client.updateTheme(userId, 'light');
    console.log('Updated theme:', updatedTheme);

    // Example 4: Update display settings
    console.log('\nUpdating display settings...');
    const updatedDisplay = await client.updateDisplaySettings(userId, {
      fontSize: 'large',
      density: 'spacious'
    });
    console.log('Updated display:', updatedDisplay);

    // Example 5: Get all preferences
    console.log('\nGetting all preferences...');
    const all = await client.getAllPreferences();
    console.log('All preferences:', all);

    // Example 6: Delete preferences
    console.log('\nDeleting preferences...');
    const deleted = await client.deletePreferences(userId);
    console.log('Deleted:', deleted);

  } catch (error) {
    console.error('Example error:', error.message);
  }
})();

/**
 * Integration with localStorage for caching
 */
class CachedPreferencesClient extends PreferencesClient {
  constructor(baseUrl, cacheKey = 'userPreferences') {
    super(baseUrl);
    this.cacheKey = cacheKey;
  }

  /**
   * Get preferences with localStorage cache
   */
  async getUserPreferencesWithCache(userId) {
    // Try to get from cache first
    const cached = localStorage.getItem(`${this.cacheKey}_${userId}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch from API
    const preferences = await this.getUserPreferences(userId);
    if (preferences) {
      localStorage.setItem(`${this.cacheKey}_${userId}`, JSON.stringify(preferences));
    }
    return preferences;
  }

  /**
   * Update preferences and cache
   */
  async patchPreferencesWithCache(userId, updates) {
    const result = await this.patchPreferences(userId, updates);
    if (result.success) {
      localStorage.setItem(`${this.cacheKey}_${userId}`, JSON.stringify(result.data));
    }
    return result;
  }

  /**
   * Clear cache
   */
  clearCache(userId) {
    localStorage.removeItem(`${this.cacheKey}_${userId}`);
  }
}