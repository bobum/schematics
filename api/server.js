const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for user preferences (in production, use a database)
let userPreferences = {
  theme: 'light',
  language: 'en',
  notifications: true,
  fontSize: 'medium',
  autoSave: true
};

// GET /api/preferences - Get user preferences
app.get('/api/preferences', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: userPreferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve preferences',
      message: error.message
    });
  }
});

// PUT /api/preferences - Update user preferences
app.put('/api/preferences', (req, res) => {
  try {
    const updates = req.body;
    
    // Validate that request body is not empty
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Request body cannot be empty'
      });
    }
    
    // Validate preference fields
    const validFields = ['theme', 'language', 'notifications', 'fontSize', 'autoSave'];
    const invalidFields = Object.keys(updates).filter(field => !validFields.includes(field));
    
    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: `Invalid fields: ${invalidFields.join(', ')}`,
        validFields: validFields
      });
    }
    
    // Validate theme value if provided
    if (updates.theme && !['light', 'dark'].includes(updates.theme)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Theme must be either "light" or "dark"'
      });
    }
    
    // Validate fontSize value if provided
    if (updates.fontSize && !['small', 'medium', 'large'].includes(updates.fontSize)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Font size must be "small", "medium", or "large"'
      });
    }
    
    // Update preferences
    userPreferences = { ...userPreferences, ...updates };
    
    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: userPreferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`User Preferences API server running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET  /api/preferences - Get user preferences`);
  console.log(`  PUT  /api/preferences - Update user preferences`);
  console.log(`  GET  /api/health - Health check`);
});

module.exports = app;
