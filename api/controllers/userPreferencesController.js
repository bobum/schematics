/**
 * User Preferences Controller
 * Handles business logic for user preferences operations
 */

const UserPreferences = require('../models/UserPreferences');
const { validationResult } = require('express-validator');

/**
 * Get user preferences by user ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const preferences = await UserPreferences.findByUserId(userId);
    
    if (!preferences) {
      return res.status(404).json({
        success: false,
        message: 'User preferences not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user preferences',
      error: error.message
    });
  }
};

/**
 * Create new user preferences
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createUserPreferences = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { userId, theme, language, notifications, privacy } = req.body;
    
    // Check if preferences already exist
    const existingPreferences = await UserPreferences.findByUserId(userId);
    if (existingPreferences) {
      return res.status(409).json({
        success: false,
        message: 'User preferences already exist. Use PUT to update.'
      });
    }
    
    const newPreferences = await UserPreferences.create({
      userId,
      theme,
      language,
      notifications,
      privacy
    });
    
    res.status(201).json({
      success: true,
      message: 'User preferences created successfully',
      data: newPreferences
    });
  } catch (error) {
    console.error('Error creating user preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user preferences',
      error: error.message
    });
  }
};

/**
 * Update user preferences (full update)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateUserPreferences = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { userId } = req.params;
    const { theme, language, notifications, privacy } = req.body;
    
    const updatedPreferences = await UserPreferences.update(userId, {
      theme,
      language,
      notifications,
      privacy
    });
    
    if (!updatedPreferences) {
      return res.status(404).json({
        success: false,
        message: 'User preferences not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User preferences updated successfully',
      data: updatedPreferences
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user preferences',
      error: error.message
    });
  }
};

/**
 * Partially update user preferences
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.patchUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    const updatedPreferences = await UserPreferences.patch(userId, updates);
    
    if (!updatedPreferences) {
      return res.status(404).json({
        success: false,
        message: 'User preferences not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User preferences updated successfully',
      data: updatedPreferences
    });
  } catch (error) {
    console.error('Error patching user preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error patching user preferences',
      error: error.message
    });
  }
};

/**
 * Delete user preferences
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const deleted = await UserPreferences.delete(userId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User preferences not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User preferences deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user preferences',
      error: error.message
    });
  }
};
