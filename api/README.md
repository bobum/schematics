# User Preferences API

REST API endpoints for managing user preferences.

## Endpoints

### GET /api/preferences

Retrieve user preferences.

**Query Parameters:**
- `userId` (required): The user's unique identifier

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "theme": "light",
    "language": "en",
    "notifications": {
      "email": true,
      "push": false,
      "sms": false
    },
    "privacy": {
      "profileVisible": true,
      "showEmail": false
    }
  },
  "userId": "user123"
}
```

**Error Responses:**

400 Bad Request - Missing userId:
```json
{
  "error": "Bad Request",
  "message": "User ID is required"
}
```

500 Internal Server Error:
```json
{
  "error": "Internal Server Error",
  "message": "Failed to retrieve user preferences"
}
```

**Example Usage:**
```bash
curl -X GET "http://localhost:3000/api/preferences?userId=user123"
```

---

### PUT /api/preferences

Update user preferences.

**Query Parameters:**
- `userId` (required): The user's unique identifier

**Request Body:**
```json
{
  "theme": "dark",
  "language": "es",
  "notifications": {
    "email": false,
    "push": true
  },
  "privacy": {
    "profileVisible": false
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "theme": "dark",
    "language": "es",
    "notifications": {
      "email": false,
      "push": true,
      "sms": false
    },
    "privacy": {
      "profileVisible": false,
      "showEmail": false
    }
  },
  "userId": "user123"
}
```

**Error Responses:**

400 Bad Request - Missing userId:
```json
{
  "error": "Bad Request",
  "message": "User ID is required"
}
```

400 Bad Request - Empty request body:
```json
{
  "error": "Bad Request",
  "message": "Preferences data is required"
}
```

400 Bad Request - Invalid data:
```json
{
  "error": "Bad Request",
  "message": "Invalid theme value. Must be one of: light, dark, auto"
}
```

500 Internal Server Error:
```json
{
  "error": "Internal Server Error",
  "message": "Failed to update user preferences"
}
```

**Example Usage:**
```bash
curl -X PUT "http://localhost:3000/api/preferences?userId=user123" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "notifications": {
      "email": false,
      "push": true
    }
  }'
```

## Data Model

### Preferences Object

| Field | Type | Valid Values | Description |
|-------|------|--------------|-------------|
| `theme` | string | `light`, `dark`, `auto` | UI theme preference |
| `language` | string | Any language code | Preferred language |
| `notifications.email` | boolean | `true`, `false` | Email notification preference |
| `notifications.push` | boolean | `true`, `false` | Push notification preference |
| `notifications.sms` | boolean | `true`, `false` | SMS notification preference |
| `privacy.profileVisible` | boolean | `true`, `false` | Profile visibility setting |
| `privacy.showEmail` | boolean | `true`, `false` | Email visibility setting |

## Features

✅ **GET endpoint** - Retrieve user preferences
✅ **PUT endpoint** - Update user preferences
✅ **Default preferences** - Returns sensible defaults for new users
✅ **Partial updates** - Update only specific preferences without affecting others
✅ **Deep merge** - Properly merges nested preference objects
✅ **Validation** - Validates preference values and structure
✅ **Error handling** - Comprehensive error handling with appropriate status codes
✅ **Well-documented** - Clear API documentation and code comments
✅ **Tested** - Complete test suite covering all scenarios

## Installation

1. Install dependencies:
```bash
npm install express
```

2. For testing:
```bash
npm install --save-dev jest supertest
```

## Usage in Express App

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

## Running Tests

```bash
npm test api/preferences.test.js
```

## Security Considerations

- In production, implement proper authentication middleware
- Use database instead of in-memory storage
- Add rate limiting to prevent abuse
- Validate and sanitize all user inputs
- Implement authorization checks to ensure users can only access their own preferences

## Future Enhancements

- Add authentication middleware
- Implement database persistence
- Add pagination for preference history
- Support for preference versioning
- Bulk preference updates
- Preference export/import functionality