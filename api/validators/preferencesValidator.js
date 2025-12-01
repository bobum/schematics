/**
 * Preference Validators
 * 
 * Middleware functions for validating user preference data
 */

/**
 * Validate user ID parameter
 */
const validateUserId = (req, res, next) => {
  const { userId } = req.params;
  
  if (!userId || userId.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'User ID is required'
    });
  }
  
  next();
};

/**
 * Validate preference data
 */
const validatePreferences = (req, res, next) => {
  const { theme, notifications, language, displaySettings } = req.body;
  
  // Validate theme if provided
  if (theme && !['light', 'dark', 'auto'].includes(theme)) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Theme must be one of: light, dark, auto'
    });
  }
  
  // Validate notifications if provided
  if (notifications !== undefined && typeof notifications !== 'boolean') {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Notifications must be a boolean value'
    });
  }
  
  // Validate language if provided
  if (language && typeof language !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Language must be a string'
    });
  }
  
  // Validate displaySettings if provided
  if (displaySettings) {
    if (typeof displaySettings !== 'object' || Array.isArray(displaySettings)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Display settings must be an object'
      });
    }
    
    if (displaySettings.fontSize && !['small', 'medium', 'large'].includes(displaySettings.fontSize)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Font size must be one of: small, medium, large'
      });
    }
    
    if (displaySettings.density && !['compact', 'comfortable', 'spacious'].includes(displaySettings.density)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Density must be one of: compact, comfortable, spacious'
      });
    }
  }
  
  next();
};

module.exports = {
  validateUserId,
  validatePreferences
};