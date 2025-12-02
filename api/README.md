# User Preferences API

## Overview
REST API for managing user preferences in the Visual Connection Schematics application.

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Get User Preferences
Retrieve the current user preferences.

**Endpoint:** `GET /api/preferences`

**Response:**
```json
{
  "success": true,
  "data": {
    "theme": "light",
    "language": "en",
    "notifications": true,
    "fontSize": "medium",
    "autoSave": true
  }
}
```

**Status Codes:**
- `200 OK` - Preferences retrieved successfully
- `500 Internal Server Error` - Server error occurred

---

### 2. Update User Preferences
Update one or more user preferences.

**Endpoint:** `PUT /api/preferences`

**Request Body:**
```json
{
  "theme": "dark",
  "fontSize": "large",
  "notifications": false
}
```

**Valid Fields:**
- `theme` - "light" or "dark"
- `language` - Language code (e.g., "en", "es", "fr")
- `notifications` - Boolean (true/false)
- `fontSize` - "small", "medium", or "large"
- `autoSave` - Boolean (true/false)

**Success Response:**
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "theme": "dark",
    "language": "en",
    "notifications": false,
    "fontSize": "large",
    "autoSave": true
  }
}
```

**Error Responses:**

*Empty Request Body:*
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Request body cannot be empty"
}
```

*Invalid Fields:*
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Invalid fields: invalidField",
  "validFields": ["theme", "language", "notifications", "fontSize", "autoSave"]
}
```

*Invalid Theme Value:*
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Theme must be either 'light' or 'dark'"
}
```

*Invalid Font Size:*
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Font size must be 'small', 'medium', or 'large'"
}
```

**Status Codes:**
- `200 OK` - Preferences updated successfully
- `400 Bad Request` - Invalid input data
- `500 Internal Server Error` - Server error occurred

---

### 3. Health Check
Check if the API server is running.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status Codes:**
- `200 OK` - API is healthy

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### Common Error Types:
- `Bad Request` (400) - Invalid input or missing required fields
- `Not Found` (404) - Endpoint does not exist
- `Internal Server Error` (500) - Unexpected server error

---

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. For development with auto-reload:
```bash
npm run dev
```

---

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

---

## Example Usage

### Using cURL

**Get Preferences:**
```bash
curl http://localhost:3000/api/preferences
```

**Update Preferences:**
```bash
curl -X PUT http://localhost:3000/api/preferences \
  -H "Content-Type: application/json" \
  -d '{"theme": "dark", "fontSize": "large"}'
```

### Using JavaScript Fetch

**Get Preferences:**
```javascript
fetch('http://localhost:3000/api/preferences')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**Update Preferences:**
```javascript
fetch('http://localhost:3000/api/preferences', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    theme: 'dark',
    fontSize: 'large',
    notifications: false
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

## CORS Configuration

The API is configured to accept requests from any origin using CORS middleware. In production, configure CORS to accept only specific origins:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

---

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Database integration (MongoDB, PostgreSQL)
- [ ] Rate limiting
- [ ] API versioning
- [ ] Request logging
- [ ] Multi-user support with user IDs
- [ ] Preference presets/templates
- [ ] Preference history/audit log

---

## License
MIT
