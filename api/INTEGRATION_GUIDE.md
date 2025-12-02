# User Preferences API Integration Guide

This guide will help you integrate the User Preferences API into your application.

## Quick Start

### 1. Installation

```bash
cd api
npm install
```

### 2. Basic Integration

```javascript
const express = require('express');
const preferencesRouter = require('./api/preferences');

const app = express();
app.use(express.json());
app.use('/api/preferences', preferencesRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### 3. Test the API

```bash
# Get preferences (returns defaults for new users)
curl http://localhost:3000/api/preferences?userId=test-user

# Update preferences
curl -X PUT http://localhost:3000/api/preferences?userId=test-user \
  -H "Content-Type: application/json" \
  -d '{"theme": "dark", "language": "es"}'
```

## Authentication Integration

The API is designed to work with authentication middleware. Here's how to integrate it:

### Express Session Authentication

```javascript
const session = require('express-session');
const preferencesRouter = require('./api/preferences');

// Setup session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Please log in'
    });
  }
}

// Mount with authentication
app.use('/api/preferences', requireAuth, preferencesRouter);
```

### JWT Authentication

```javascript
const jwt = require('jsonwebtoken');
const preferencesRouter = require('./api/preferences');

// JWT verification middleware
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No token provided'
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }
    req.user = decoded;
    next();
  });
}

// Mount with JWT authentication
app.use('/api/preferences', verifyToken, preferencesRouter);
```

## Database Integration

The default implementation uses in-memory storage. For production, integrate a database:

### MongoDB Example

```javascript
const mongoose = require('mongoose');

// Define schema
const PreferencesSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  theme: { type: String, default: 'light' },
  language: { type: String, default: 'en' },
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: false },
    sms: { type: Boolean, default: false }
  },
  privacy: {
    profileVisible: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: false }
  },
  updatedAt: { type: Date, default: Date.now }
});

const Preferences = mongoose.model('Preferences', PreferencesSchema);

// Update GET endpoint
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    let preferences = await Preferences.findOne({ userId });
    
    if (!preferences) {
      preferences = await Preferences.create({
        userId,
        ...defaultPreferences
      });
    }
    
    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

// Update PUT endpoint
router.put('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = await Preferences.findOneAndUpdate(
      { userId },
      { $set: { ...req.body, updatedAt: Date.now() } },
      { new: true, upsert: true }
    );
    
    res.json({
      success: true,
      message: 'Preferences updated',
      data: preferences
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});
```

### PostgreSQL Example

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  database: 'myapp',
  port: 5432
});

// Create table
/*
CREATE TABLE user_preferences (
  user_id VARCHAR(255) PRIMARY KEY,
  preferences JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

// GET endpoint
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT preferences FROM user_preferences WHERE user_id = $1',
      [userId]
    );
    
    const preferences = result.rows[0]?.preferences || defaultPreferences;
    
    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

// PUT endpoint
router.put('/', async (req, res) => {
  try {
    const userId = req.user.id;
    
    await pool.query(
      `INSERT INTO user_preferences (user_id, preferences, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id)
       DO UPDATE SET preferences = $2, updated_at = CURRENT_TIMESTAMP`,
      [userId, JSON.stringify(req.body)]
    );
    
    res.json({
      success: true,
      message: 'Preferences updated',
      data: req.body
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});
```

## Frontend Integration Examples

### React Hook

```javascript
import { useState, useEffect } from 'react';

function useUserPreferences(userId) {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPreferences();
  }, [userId]);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/preferences?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setPreferences(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates) => {
    try {
      const response = await fetch(`/api/preferences?userId=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPreferences(data.data);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { preferences, loading, error, updatePreferences, refetch: fetchPreferences };
}

// Usage in component
function SettingsPage() {
  const { preferences, loading, updatePreferences } = useUserPreferences('user123');

  const handleThemeChange = async (theme) => {
    const result = await updatePreferences({ theme });
    if (result.success) {
      console.log('Theme updated!');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => handleThemeChange('dark')}>Dark Mode</button>
      <button onClick={() => handleThemeChange('light')}>Light Mode</button>
    </div>
  );
}
```

### Vanilla JavaScript

```javascript
class PreferencesAPI {
  constructor(baseURL = '/api/preferences') {
    this.baseURL = baseURL;
  }

  async get(userId) {
    const response = await fetch(`${this.baseURL}?userId=${userId}`);
    return response.json();
  }

  async update(userId, preferences) {
    const response = await fetch(`${this.baseURL}?userId=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences)
    });
    return response.json();
  }
}

// Usage
const preferencesAPI = new PreferencesAPI();

// Get preferences
preferencesAPI.get('user123')
  .then(data => console.log('Preferences:', data.data));

// Update preferences
preferencesAPI.update('user123', { theme: 'dark' })
  .then(data => console.log('Updated:', data.data));
```

## Error Handling Best Practices

### Client-Side

```javascript
async function updatePreferences(userId, preferences) {
  try {
    const response = await fetch(`/api/preferences?userId=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences)
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle HTTP errors
      if (response.status === 400) {
        console.error('Invalid data:', data.message);
      } else if (response.status === 401) {
        console.error('Not authenticated');
        // Redirect to login
      } else if (response.status === 500) {
        console.error('Server error:', data.message);
      }
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error('Failed to update preferences:', error);
    throw error;
  }
}
```

## Testing

### Run Tests

```bash
npm test
```

### Example Test

```javascript
const request = require('supertest');
const app = require('./server.example');

test('should update and retrieve preferences', async () => {
  // Update preferences
  const updateResponse = await request(app)
    .put('/api/preferences?userId=test-123')
    .send({ theme: 'dark' })
    .expect(200);

  expect(updateResponse.body.success).toBe(true);

  // Verify update
  const getResponse = await request(app)
    .get('/api/preferences?userId=test-123')
    .expect(200);

  expect(getResponse.body.data.theme).toBe('dark');
});
```

## Monitoring and Logging

```javascript
const morgan = require('morgan');

// Add request logging
app.use(morgan('combined'));

// Add custom logging for preferences API
router.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log({
      method: req.method,
      path: req.path,
      userId: req.query.userId,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });
  
  next();
});
```

## Security Checklist

- [ ] Implement authentication middleware
- [ ] Validate user authorization (users can only access their own preferences)
- [ ] Add rate limiting
- [ ] Sanitize user inputs
- [ ] Use HTTPS in production
- [ ] Implement CORS properly
- [ ] Add request size limits
- [ ] Log security events
- [ ] Use environment variables for secrets
- [ ] Implement audit logging

## Support

For issues or questions, please refer to the main README.md or contact the development team.