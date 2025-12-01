/**
 * User Preferences REST API Server
 * test_002: API endpoint for user preferences
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'preferences.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Load preferences from file
async function loadPreferences() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {}; // Return empty object if file doesn't exist
    }
    throw error;
  }
}

// Save preferences to file
async function savePreferences(preferences) {
  await ensureDataDirectory();
  await fs.writeFile(DATA_FILE, JSON.stringify(preferences, null, 2), 'utf8');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'User Preferences API'
  });
});

// GET all user preferences
app.get('/api/preferences', async (req, res) => {
  try {
    const preferences = await loadPreferences();
    res.json({
      success: true,
      data: preferences,
      count: Object.keys(preferences).length
    });
  } catch (error) {
    console.error('Error loading preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load preferences',
      message: error.message
    });
  }
});

// GET specific user preferences by userId
app.get('/api/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await loadPreferences();
    
    if (preferences[userId]) {
      res.json({
        success: true,
        data: preferences[userId],
        userId: userId
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'User preferences not found',
        userId: userId
      });
    }
  } catch (error) {
    console.error('Error loading user preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load user preferences',
      message: error.message
    });
  }
});

// POST create or update user preferences
app.post('/api/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userPreferences = req.body;
    
    // Validate request body
    if (!userPreferences || typeof userPreferences !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid preferences data',
        message: 'Request body must be a valid JSON object'
      });
    }
    
    const preferences = await loadPreferences();
    
    // Add metadata
    const timestamp = new Date().toISOString();
    preferences[userId] = {
      ...userPreferences,
      userId: userId,
      updatedAt: timestamp,
      createdAt: preferences[userId]?.createdAt || timestamp
    };
    
    await savePreferences(preferences);
    
    res.json({
      success: true,
      message: 'Preferences saved successfully',
      data: preferences[userId]
    });
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save preferences',
      message: error.message
    });
  }
});

// PUT update specific preference fields for a user
app.put('/api/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    // Validate request body
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid update data',
        message: 'Request body must be a valid JSON object'
      });
    }
    
    const preferences = await loadPreferences();
    
    if (!preferences[userId]) {
      return res.status(404).json({
        success: false,
        error: 'User preferences not found',
        userId: userId
      });
    }
    
    // Merge updates with existing preferences
    preferences[userId] = {
      ...preferences[userId],
      ...updates,
      userId: userId,
      updatedAt: new Date().toISOString()
    };
    
    await savePreferences(preferences);
    
    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: preferences[userId]
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences',
      message: error.message
    });
  }
});

// DELETE user preferences
app.delete('/api/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await loadPreferences();
    
    if (!preferences[userId]) {
      return res.status(404).json({
        success: false,
        error: 'User preferences not found',
        userId: userId
      });
    }
    
    const deletedData = preferences[userId];
    delete preferences[userId];
    
    await savePreferences(preferences);
    
    res.json({
      success: true,
      message: 'Preferences deleted successfully',
      deletedData: deletedData
    });
  } catch (error) {
    console.error('Error deleting preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete preferences',
      message: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, async () => {
  await ensureDataDirectory();
  console.log(`User Preferences API Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`API Base URL: http://localhost:${PORT}/api/preferences`);
});

module.exports = app;
