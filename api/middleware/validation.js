/**
 * Validation Middleware
 * Validates request data for user preferences endpoints
 */

const { body, param } = require('express-validator');

/**
 * Validate user ID parameter
 */
exports.validateUserId = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isString()
    .withMessage('User ID must be a string')
    .trim()
];

/**
 * Validate user preferences data
 */
exports.validatePreferences = [
  body('userId')
    .optional()
    .isString()
    .withMessage('User ID must be a string')
    .trim(),
  
  body('theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Theme must be one of: light, dark, auto'),
  
  body('language')
    .optional()
    .isString()
    .withMessage('Language must be a string')
    .isLength({ min: 2, max: 5 })
    .withMessage('Language code must be between 2 and 5 characters')
    .matches(/^[a-z]{2}(-[A-Z]{2})?$/)
    .withMessage('Language must be a valid language code (e.g., en, en-US)'),
  
  body('notifications')
    .optional()
    .isObject()
    .withMessage('Notifications must be an object'),
  
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification setting must be a boolean'),
  
  body('notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notification setting must be a boolean'),
  
  body('notifications.sms')
    .optional()
    .isBoolean()
    .withMessage('SMS notification setting must be a boolean'),
  
  body('privacy')
    .optional()
    .isObject()
    .withMessage('Privacy must be an object'),
  
  body('privacy.profileVisibility')
    .optional()
    .isIn(['public', 'private', 'friends'])
    .withMessage('Profile visibility must be one of: public, private, friends'),
  
  body('privacy.showEmail')
    .optional()
    .isBoolean()
    .withMessage('Show email setting must be a boolean'),
  
  body('privacy.showPhone')
    .optional()
    .isBoolean()
    .withMessage('Show phone setting must be a boolean')
];
