/**
 * User Preferences REST API Server
 * 
 * This server provides endpoints for managing user preferences including:
 * - Theme preferences (light/dark mode)
 * - Display settings
 * - Notification preferences
 * - Custom user settings
 * 
 * @author Software Developer Agent
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const preferencesRouter = require('./routes/preferences');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'User Preferences API',
    version: '1.0.0',
    endpoints: {
      'GET /api/preferences': 'Get all user preferences',
      'GET /api/preferences/:userId': 'Get preferences for a specific user',
      'POST /api/preferences': 'Create new user preferences',
      'PUT /api/preferences/:userId': 'Update user preferences',
      'PATCH /api/preferences/:userId': 'Partially update user preferences',
      'DELETE /api/preferences/:userId': 'Delete user preferences'
    }
  });
});

app.use('/api/preferences', preferencesRouter);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`User Preferences API server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} for API documentation`);
  });
}

module.exports = app;