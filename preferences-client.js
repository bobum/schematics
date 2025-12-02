/**
 * User Preferences API Client
 * 
 * This module provides functions to interact with the user preferences API.
 * It handles GET and PUT requests with proper error handling.
 */

const API_BASE_URL = 'http://localhost:3000';

/**
 * Fetch user preferences from the API
 * @returns {Promise<Object>} User preferences object
 * @throws {Error} If the request fails
 */
async function getUserPreferences() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/preferences`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch preferences');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching preferences:', error);
    throw error;
  }
}

/**
 * Update user preferences via the API
 * @param {Object} preferences - Object containing preference updates
 * @returns {Promise<Object>} Updated preferences object
 * @throws {Error} If the request fails or validation errors occur
 */
async function updateUserPreferences(preferences) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update preferences');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
}

/**
 * Update a single preference field
 * @param {string} field - Preference field name
 * @param {*} value - New value for the field
 * @returns {Promise<Object>} Updated preferences object
 */
async function updatePreference(field, value) {
  return updateUserPreferences({ [field]: value });
}

/**
 * Load and apply user preferences to the application
 */
async function loadAndApplyPreferences() {
  try {
    const preferences = await getUserPreferences();
    
    // Apply theme
    if (preferences.theme) {
      document.documentElement.setAttribute('data-theme', preferences.theme);
    }
    
    // Apply font size
    if (preferences.fontSize) {
      document.body.style.fontSize = getFontSizeValue(preferences.fontSize);
    }
    
    // Store in localStorage as backup
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    return preferences;
  } catch (error) {
    console.error('Failed to load preferences, using defaults:', error);
    // Fall back to localStorage if API fails
    const stored = localStorage.getItem('userPreferences');
    return stored ? JSON.parse(stored) : null;
  }
}

/**
 * Convert fontSize preference to CSS value
 * @param {string} size - 'small', 'medium', or 'large'
 * @returns {string} CSS font-size value
 */
function getFontSizeValue(size) {
  const sizes = {
    small: '14px',
    medium: '16px',
    large: '18px'
  };
  return sizes[size] || sizes.medium;
}

/**
 * Initialize preferences on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  loadAndApplyPreferences();
});

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getUserPreferences,
    updateUserPreferences,
    updatePreference,
    loadAndApplyPreferences
  };
}
