/**
 * User Preferences API Endpoint
 * 
 * Provides REST API endpoints for managing user preferences:
 * - GET /api/preferences - Retrieve user preferences
 * - PUT /api/preferences - Update user preferences
 */

const express = require('express');
const router = express.Router();

// In-memory storage for preferences (in production, use a database)
const preferencesStore = new Map();

// Default preferences structure
const defaultPreferences = {
  theme: 'light',
  language: 'en',
  notifications: {
    email: true,
    push: false,
    sms: false
  },
  privacy: {
    profileVisible: true,
    showEmail: false
  }
};

/**
 * GET /api/preferences
 * Retrieves user preferences
 * 
 * @param {string} userId - User ID from query params or auth token
 * @returns {object} User preferences object
 */
router.get('/', async (req, res) => {
  try {
    // Extract user ID from query params or authorization header
    const userId = req.query.userId || req.user?.id;
    
    if (!userId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'User ID is required'
      });
    }

    // Retrieve preferences or return defaults
    const preferences = preferencesStore.get(userId) || defaultPreferences;
    
    res.status(200).json({
      success: true,
      data: preferences,
      userId: userId
    });
  } catch (error) {
    console.error('Error retrieving preferences:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve user preferences'
    });
  }
});

/**
 * PUT /api/preferences
 * Updates user preferences
 * 
 * @param {string} userId - User ID from query params or auth token
 * @param {object} preferences - Preferences object to update
 * @returns {object} Updated preferences
 */
router.put('/', async (req, res) => {
  try {
    // Extract user ID
    const userId = req.query.userId || req.user?.id;
    
    if (!userId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'User ID is required'
      });
    }

    // Validate request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Preferences data is required'
      });
    }

    // Get current preferences or defaults
    const currentPreferences = preferencesStore.get(userId) || { ...defaultPreferences };
    
    // Merge new preferences with existing ones
    const updatedPreferences = {
      ...currentPreferences,
      ...req.body,
      // Deep merge for nested objects
      notifications: {
        ...currentPreferences.notifications,
        ...(req.body.notifications || {})
      },
      privacy: {
        ...currentPreferences.privacy,
        ...(req.body.privacy || {})
      }
    };

    // Validate preferences structure
    const validationError = validatePreferences(updatedPreferences);
    if (validationError) {
      return res.status(400).json({
        error: 'Bad Request',
        message: validationError
      });
    }

    // Store updated preferences
    preferencesStore.set(userId, updatedPreferences);
    
    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: updatedPreferences,
      userId: userId
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update user preferences'
    });
  }
});

/**
 * Validates preferences structure
 * @param {object} preferences - Preferences to validate
 * @returns {string|null} Error message or null if valid
 */
function validatePreferences(preferences) {
  // Validate theme
  if (preferences.theme && !['light', 'dark', 'auto'].includes(preferences.theme)) {
    return 'Invalid theme value. Must be one of: light, dark, auto';
  }

  // Validate language
  if (preferences.language && typeof preferences.language !== 'string') {
    return 'Invalid language value. Must be a string';
  }

  // Validate notifications
  if (preferences.notifications) {
    const { email, push, sms } = preferences.notifications;
    if (email !== undefined && typeof email !== 'boolean') {
      return 'Invalid notifications.email value. Must be a boolean';
    }
    if (push !== undefined && typeof push !== 'boolean') {
      return 'Invalid notifications.push value. Must be a boolean';
    }
    if (sms !== undefined && typeof sms !== 'boolean') {
      return 'Invalid notifications.sms value. Must be a boolean';
    }
  }

  // Validate privacy
  if (preferences.privacy) {
    const { profileVisible, showEmail } = preferences.privacy;
    if (profileVisible !== undefined && typeof profileVisible !== 'boolean') {
      return 'Invalid privacy.profileVisible value. Must be a boolean';
    }
    if (showEmail !== undefined && typeof showEmail !== 'boolean') {
      return 'Invalid privacy.showEmail value. Must be a boolean';
    }
  }

  return null;
}

module.exports = router;