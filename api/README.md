# User Preferences REST API

## Overview
A comprehensive REST API for managing user preferences including theme settings, notifications, language preferences, display settings, and custom configurations.

## Features
- ✅ Full CRUD operations for user preferences
- ✅ Input validation and error handling
- ✅ In-memory storage (easily replaceable with database)
- ✅ Request logging
- ✅ CORS support
- ✅ Comprehensive test suite
- ✅ RESTful API design

## Installation

```bash
cd api
npm install
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Run Tests
```bash
npm test
```

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Get API Information
```http
GET /
```

Returns API documentation and available endpoints.

**Response:**
```json
{
  "message": "User Preferences API",
  "version": "1.0.0",
  "endpoints": {...}
}
```

---

#### 2. Get All Preferences
```http
GET /api/preferences
```

Retrieve all user preferences from the system.

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "userId": "uuid-1",
      "theme": "dark",
      "notifications": true,
      "language": "en",
      "displaySettings": {
        "fontSize": "medium",
        "density": "comfortable"
      },
      "customSettings": {},
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### 3. Get User Preferences
```http
GET /api/preferences/:userId
```

Retrieve preferences for a specific user.

**Parameters:**
- `userId` (path) - User identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-1",
    "theme": "dark",
    "notifications": true,
    "language": "en",
    "displaySettings": {
      "fontSize": "medium",
      "density": "comfortable"
    },
    "customSettings": {},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Preferences for user uuid-1 not found"
}
```

---

#### 4. Create Preferences
```http
POST /api/preferences
```

Create new user preferences.

**Request Body:**
```json
{
  "userId": "optional-uuid",
  "theme": "dark",
  "notifications": true,
  "language": "en",
  "displaySettings": {
    "fontSize": "medium",
    "density": "comfortable"
  },
  "customSettings": {
    "autoSave": true
  }
}
```

**Field Validations:**
- `theme`: Must be one of `light`, `dark`, or `auto`
- `notifications`: Must be boolean
- `language`: Must be string
- `displaySettings.fontSize`: Must be `small`, `medium`, or `large`
- `displaySettings.density`: Must be `compact`, `comfortable`, or `spacious`

**Response (201):**
```json
{
  "success": true,
  "message": "Preferences created successfully",
  "data": {...}
}
```

**Error Response (409):**
```json
{
  "success": false,
  "error": "Conflict",
  "message": "Preferences for user uuid-1 already exist. Use PUT or PATCH to update."
}
```

---

#### 5. Update Preferences (Full)
```http
PUT /api/preferences/:userId
```

Completely replace user preferences.

**Parameters:**
- `userId` (path) - User identifier

**Request Body:**
```json
{
  "theme": "light",
  "notifications": false,
  "language": "es",
  "displaySettings": {
    "fontSize": "large",
    "density": "spacious"
  },
  "customSettings": {}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {...}
}
```

---

#### 6. Update Preferences (Partial)
```http
PATCH /api/preferences/:userId
```

Partially update user preferences (only specified fields).

**Parameters:**
- `userId` (path) - User identifier

**Request Body:**
```json
{
  "theme": "dark"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {...}
}
```

---

#### 7. Delete Preferences
```http
DELETE /api/preferences/:userId
```

Delete user preferences.

**Parameters:**
- `userId` (path) - User identifier

**Response:**
```json
{
  "success": true,
  "message": "Preferences deleted successfully"
}
```

---

## Data Model

### Preference Object
```typescript
{
  userId: string;           // Unique user identifier (UUID)
  theme: 'light' | 'dark' | 'auto';  // Theme preference
  notifications: boolean;   // Enable/disable notifications
  language: string;         // Language code (e.g., 'en', 'es')
  displaySettings: {
    fontSize: 'small' | 'medium' | 'large';
    density: 'compact' | 'comfortable' | 'spacious';
  };
  customSettings: object;   // Flexible custom settings
  createdAt: string;        // ISO 8601 timestamp
  updatedAt: string;        // ISO 8601 timestamp
}
```

## Error Handling

All errors return a consistent format:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## Architecture

```
api/
├── server.js                 # Main Express server
├── routes/
│   └── preferences.js        # Preference endpoints
├── middleware/
│   ├── errorHandler.js       # Global error handler
│   └── logger.js             # Request logger
├── validators/
│   └── preferencesValidator.js  # Input validation
├── tests/
│   └── preferences.test.js   # API tests
├── package.json
└── README.md
```

## Testing

The API includes a comprehensive test suite using Jest and Supertest.

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage
- ✅ GET all preferences
- ✅ GET specific user preferences
- ✅ POST create new preferences
- ✅ PUT full update
- ✅ PATCH partial update
- ✅ DELETE preferences
- ✅ Input validation
- ✅ Error handling
- ✅ 404 routes

## Storage

Currently uses in-memory storage (Map). For production:

### Option 1: MongoDB
```javascript
const mongoose = require('mongoose');
// Define schema and connect
```

### Option 2: PostgreSQL
```javascript
const { Pool } = require('pg');
// Setup connection pool
```

### Option 3: Redis
```javascript
const redis = require('redis');
// Setup Redis client
```

## Security Considerations

### For Production:
1. **Authentication**: Add JWT or OAuth
2. **Rate Limiting**: Prevent abuse
3. **Input Sanitization**: Prevent XSS/injection
4. **HTTPS**: Enable SSL/TLS
5. **Environment Variables**: Store sensitive config

### Example with Authentication:
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  // Verify token
};

router.get('/', authenticateToken, handler);
```

## Environment Variables

Create `.env` file:

```env
PORT=3000
NODE_ENV=development
DB_CONNECTION_STRING=your_db_connection
JWT_SECRET=your_secret_key
```

## Integration Example

### Frontend JavaScript
```javascript
// Get user preferences
fetch('http://localhost:3000/api/preferences/user-123')
  .then(res => res.json())
  .then(data => console.log(data));

// Update theme
fetch('http://localhost:3000/api/preferences/user-123', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ theme: 'dark' })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### cURL Examples
```bash
# Get all preferences
curl http://localhost:3000/api/preferences

# Create preferences
curl -X POST http://localhost:3000/api/preferences \
  -H "Content-Type: application/json" \
  -d '{"theme":"dark","notifications":true}'

# Update theme
curl -X PATCH http://localhost:3000/api/preferences/user-123 \
  -H "Content-Type: application/json" \
  -d '{"theme":"light"}'
```

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication and authorization
- [ ] Rate limiting
- [ ] API versioning
- [ ] WebSocket support for real-time updates
- [ ] Preferences export/import
- [ ] Preferences history/audit log
- [ ] Multi-tenant support
- [ ] GraphQL endpoint option
- [ ] OpenAPI/Swagger documentation

## License
MIT

## Author
Software Developer Agent - Feature test_002

## Support
For issues or questions, please create an issue in the repository.