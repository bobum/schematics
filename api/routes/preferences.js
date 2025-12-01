/**
 * User Preferences Routes
 * 
 * RESTful endpoints for managing user preferences
 * 
 * Endpoints:
 * - GET    /api/preferences          - Get all preferences
 * - GET    /api/preferences/:userId  - Get user preferences
 * - POST   /api/preferences          - Create new preferences
 * - PUT    /api/preferences/:userId  - Update preferences (full)
 * - PATCH  /api/preferences/:userId  - Update preferences (partial)
 * - DELETE /api/preferences/:userId  - Delete preferences
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { validatePreferences, validateUserId } = require('../validators/preferencesValidator');

// In-memory storage (replace with database in production)
const preferencesStore = new Map();

/**
 * GET /api/preferences
 * Retrieve all user preferences
 */
router.get('/', (req, res) => {
  try {
    const allPreferences = Array.from(preferencesStore.values());
    res.json({
      success: true,
      count: allPreferences.length,
      data: allPreferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve preferences',
      message: error.message
    });
  }
});

/**
 * GET /api/preferences/:userId
 * Retrieve preferences for a specific user
 */
router.get('/:userId', validateUserId, (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = preferencesStore.get(userId);
    
    if (!preferences) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Preferences for user ${userId} not found`
      });
    }
    
    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve preferences',
      message: error.message
    });
  }
});

/**
 * POST /api/preferences
 * Create new user preferences
 */
router.post('/', validatePreferences, (req, res) => {
  try {
    const userId = req.body.userId || uuidv4();
    
    // Check if preferences already exist
    if (preferencesStore.has(userId)) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: `Preferences for user ${userId} already exist. Use PUT or PATCH to update.`
      });
    }
    
    const preferences = {
      userId,
      theme: req.body.theme || 'light',
      notifications: req.body.notifications !== undefined ? req.body.notifications : true,
      language: req.body.language || 'en',
      displaySettings: req.body.displaySettings || {
        fontSize: 'medium',
        density: 'comfortable'
      },
      customSettings: req.body.customSettings || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    preferencesStore.set(userId, preferences);
    
    res.status(201).json({
      success: true,
      message: 'Preferences created successfully',
      data: preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create preferences',
      message: error.message
    });
  }
});

/**
 * PUT /api/preferences/:userId
 * Update user preferences (full replacement)
 */
router.put('/:userId', validateUserId, validatePreferences, (req, res) => {
  try {
    const { userId } = req.params;
    const existingPreferences = preferencesStore.get(userId);
    
    if (!existingPreferences) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Preferences for user ${userId} not found`
      });
    }
    
    const updatedPreferences = {
      userId,
      theme: req.body.theme || 'light',
      notifications: req.body.notifications !== undefined ? req.body.notifications : true,
      language: req.body.language || 'en',
      displaySettings: req.body.displaySettings || {
        fontSize: 'medium',
        density: 'comfortable'
      },
      customSettings: req.body.customSettings || {},
      createdAt: existingPreferences.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    preferencesStore.set(userId, updatedPreferences);
    
    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: updatedPreferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences',
      message: error.message
    });
  }
});

/**
 * PATCH /api/preferences/:userId
 * Partially update user preferences
 */
router.patch('/:userId', validateUserId, (req, res) => {
  try {
    const { userId } = req.params;
    const existingPreferences = preferencesStore.get(userId);
    
    if (!existingPreferences) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Preferences for user ${userId} not found`
      });
    }
    
    // Merge existing preferences with updates
    const updatedPreferences = {
      ...existingPreferences,
      ...req.body,
      userId, // Ensure userId doesn't change
      createdAt: existingPreferences.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    };
    
    // Deep merge for nested objects
    if (req.body.displaySettings) {
      updatedPreferences.displaySettings = {
        ...existingPreferences.displaySettings,
        ...req.body.displaySettings
      };
    }
    
    if (req.body.customSettings) {
      updatedPreferences.customSettings = {
        ...existingPreferences.customSettings,
        ...req.body.customSettings
      };
    }
    
    preferencesStore.set(userId, updatedPreferences);
    
    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: updatedPreferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences',
      message: error.message
    });
  }
});

/**
 * DELETE /api/preferences/:userId
 * Delete user preferences
 */
router.delete('/:userId', validateUserId, (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!preferencesStore.has(userId)) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Preferences for user ${userId} not found`
      });
    }
    
    preferencesStore.delete(userId);
    
    res.json({
      success: true,
      message: 'Preferences deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete preferences',
      message: error.message
    });
  }
});

module.exports = router;