/**
 * User Preferences API Routes
 * Provides REST endpoints for managing user preferences
 */

const express = require('express');
const router = express.Router();
const userPreferencesController = require('../controllers/userPreferencesController');
const { validatePreferences, validateUserId } = require('../middleware/validation');
const authenticate = require('../middleware/authenticate');

/**
 * @route   GET /api/preferences/:userId
 * @desc    Get user preferences by user ID
 * @access  Private
 */
router.get('/:userId', authenticate, validateUserId, userPreferencesController.getUserPreferences);

/**
 * @route   POST /api/preferences
 * @desc    Create new user preferences
 * @access  Private
 */
router.post('/', authenticate, validatePreferences, userPreferencesController.createUserPreferences);

/**
 * @route   PUT /api/preferences/:userId
 * @desc    Update user preferences
 * @access  Private
 */
router.put('/:userId', authenticate, validateUserId, validatePreferences, userPreferencesController.updateUserPreferences);

/**
 * @route   PATCH /api/preferences/:userId
 * @desc    Partially update user preferences
 * @access  Private
 */
router.patch('/:userId', authenticate, validateUserId, userPreferencesController.patchUserPreferences);

/**
 * @route   DELETE /api/preferences/:userId
 * @desc    Delete user preferences
 * @access  Private
 */
router.delete('/:userId', authenticate, validateUserId, userPreferencesController.deleteUserPreferences);

module.exports = router;
