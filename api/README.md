# User Preferences REST API

## Overview
REST API endpoint for managing user preferences - Feature test_002

This API provides a complete CRUD (Create, Read, Update, Delete) interface for managing user preferences with persistent storage.

## Features

- ✅ RESTful API design
- ✅ JSON data format
- ✅ File-based persistent storage
- ✅ CORS enabled for frontend integration
- ✅ Comprehensive error handling
- ✅ Request logging
- ✅ Health check endpoint
- ✅ Full test coverage

## Installation

```bash
cd api
npm install
```

## Running the Server

### Production Mode
```bash
npm start
```

### Development Mode (with auto-reload)
```bash
npm run dev
```

The server will start on `http://localhost:3000` by default.

## Testing

Run the test suite:
```bash
npm test
```

## API Endpoints

### Health Check
```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "User Preferences API"
}
```

---

### Get All Preferences
```
GET /api/preferences
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user123": {
      "theme": "dark",
      "language": "en",
      "notifications": true,
      "userId": "user123",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "count": 1
}
```

---

### Get User Preferences
```
GET /api/preferences/:userId
```

**Parameters:**
- `userId` (path parameter) - Unique user identifier

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "theme": "dark",
    "language": "en",
    "notifications": true,
    "userId": "user123",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "userId": "user123"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "User preferences not found",
  "userId": "user123"
}
```

---

### Create/Replace User Preferences
```
POST /api/preferences/:userId
```

**Parameters:**
- `userId` (path parameter) - Unique user identifier

**Request Body:**
```json
{
  "theme": "dark",
  "language": "en",
  "notifications": true,
  "emailFrequency": "daily"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Preferences saved successfully",
  "data": {
    "theme": "dark",
    "language": "en",
    "notifications": true,
    "emailFrequency": "daily",
    "userId": "user123",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid preferences data",
  "message": "Request body must be a valid JSON object"
}
```

---

### Update User Preferences
```
PUT /api/preferences/:userId
```

**Parameters:**
- `userId` (path parameter) - Unique user identifier

**Request Body (partial update):**
```json
{
  "theme": "light"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "theme": "light",
    "language": "en",
    "notifications": true,
    "userId": "user123",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "User preferences not found",
  "userId": "user123"
}
```

---

### Delete User Preferences
```
DELETE /api/preferences/:userId
```

**Parameters:**
- `userId` (path parameter) - Unique user identifier

**Success Response (200):**
```json
{
  "success": true,
  "message": "Preferences deleted successfully",
  "deletedData": {
    "theme": "dark",
    "language": "en",
    "userId": "user123"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "User preferences not found",
  "userId": "user123"
}
```

---

## Data Storage

Preferences are stored in a JSON file at `api/data/preferences.json`.

**File Structure:**
```json
{
  "user123": {
    "theme": "dark",
    "language": "en",
    "notifications": true,
    "userId": "user123",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "user456": {
    "theme": "light",
    "language": "fr",
    "userId": "user456",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid data)
- `404` - Not Found (user doesn't exist)
- `500` - Internal Server Error

## CORS Configuration

CORS is enabled for all origins. To restrict origins in production:

```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

## Environment Variables

- `PORT` - Server port (default: 3000)

## Example Usage

### Using cURL

```bash
# Create preferences
curl -X POST http://localhost:3000/api/preferences/user123 \
  -H "Content-Type: application/json" \
  -d '{"theme":"dark","language":"en"}'

# Get preferences
curl http://localhost:3000/api/preferences/user123

# Update preferences
curl -X PUT http://localhost:3000/api/preferences/user123 \
  -H "Content-Type: application/json" \
  -d '{"theme":"light"}'

# Delete preferences
curl -X DELETE http://localhost:3000/api/preferences/user123
```

### Using JavaScript (Fetch API)

```javascript
// Create preferences
fetch('http://localhost:3000/api/preferences/user123', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    theme: 'dark',
    language: 'en',
    notifications: true
  })
})
.then(response => response.json())
.then(data => console.log(data));

// Get preferences
fetch('http://localhost:3000/api/preferences/user123')
  .then(response => response.json())
  .then(data => console.log(data));

// Update preferences
fetch('http://localhost:3000/api/preferences/user123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ theme: 'light' })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Architecture

```
api/
├── server.js           # Main Express server
├── package.json        # Dependencies and scripts
├── data/              # Data storage directory
│   └── preferences.json # User preferences data
├── tests/             # Test suite
│   └── api.test.js    # API endpoint tests
└── README.md          # This file
```

## Dependencies

- **express**: Web framework
- **cors**: Enable CORS
- **body-parser**: Parse JSON request bodies

## Development Dependencies

- **nodemon**: Auto-reload during development
- **jest**: Testing framework
- **supertest**: HTTP testing

## Best Practices Implemented

1. **RESTful Design**: Follows REST conventions for resource manipulation
2. **Error Handling**: Comprehensive error handling with appropriate status codes
3. **Validation**: Input validation for all endpoints
4. **Logging**: Request logging for debugging
5. **Testing**: Full test coverage with Jest
6. **Documentation**: Complete API documentation
7. **CORS**: Enabled for frontend integration
8. **Metadata**: Automatic timestamp tracking

## Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- Authentication and authorization
- Rate limiting
- Input sanitization
- Request validation middleware
- API versioning
- Caching layer
- Backup mechanism for data file

## Support

For issues or questions, please refer to the project documentation or contact the development team.

## License

MIT
