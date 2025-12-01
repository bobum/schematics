# User Preferences REST API

A comprehensive REST API for managing user preferences including theme, language, notifications, and privacy settings.

## Features

- **Complete CRUD Operations**: Create, Read, Update, Patch, and Delete user preferences
- **Authentication**: JWT-based authentication for secure access
- **Validation**: Comprehensive input validation using express-validator
- **Database**: MySQL database with optimized schema
- **Testing**: Full test coverage with Jest and Supertest
- **Security**: Helmet.js for HTTP headers, CORS configuration
- **Documentation**: Well-documented code with JSDoc comments

## API Endpoints

### Get User Preferences
```
GET /api/preferences/:userId
```
Retrieves preferences for a specific user.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "theme": "dark",
    "language": "en",
    "notifications": {
      "email": true,
      "push": false,
      "sms": false
    },
    "privacy": {
      "profileVisibility": "private",
      "showEmail": false,
      "showPhone": false
    }
  }
}
```

### Create User Preferences
```
POST /api/preferences
```
Creates new preferences for a user.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "userId": "user-123",
  "theme": "dark",
  "language": "en",
  "notifications": {
    "email": true,
    "push": false,
    "sms": false
  },
  "privacy": {
    "profileVisibility": "private",
    "showEmail": false,
    "showPhone": false
  }
}
```

### Update User Preferences (Full)
```
PUT /api/preferences/:userId
```
Completely updates all preference fields.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:** Same as POST

### Patch User Preferences (Partial)
```
PATCH /api/preferences/:userId
```
Partially updates specific preference fields.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "theme": "light"
}
```

### Delete User Preferences
```
DELETE /api/preferences/:userId
```
Deletes all preferences for a user.

**Headers:**
- `Authorization: Bearer <token>`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd user-preferences-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
npm run db:setup
```

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development, production, test)
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `JWT_SECRET`: Secret key for JWT tokens
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## Database Schema

The API uses a MySQL database with the following schema:

```sql
CREATE TABLE user_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  theme ENUM('light', 'dark', 'auto') DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'en',
  notifications JSON,
  privacy JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Security

- **Authentication**: All endpoints require JWT authentication
- **Authorization**: Users can only access their own preferences
- **Input Validation**: All inputs are validated and sanitized
- **Security Headers**: Helmet.js adds security headers
- **CORS**: Configurable CORS policy

## Project Structure

```
.
├── api/
│   ├── app.js                          # Main application entry
│   ├── config/
│   │   └── database.js                 # Database configuration
│   ├── controllers/
│   │   └── userPreferencesController.js # Business logic
│   ├── middleware/
│   │   ├── authenticate.js             # Authentication middleware
│   │   └── validation.js               # Validation middleware
│   ├── models/
│   │   └── UserPreferences.js          # Data model
│   ├── routes/
│   │   └── userPreferences.js          # API routes
│   ├── database/
│   │   └── schema.sql                  # Database schema
│   └── tests/
│       └── userPreferences.test.js     # API tests
├── .env.example                        # Environment variables template
├── package.json                        # Dependencies and scripts
└── README.md                           # This file
```

## API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ]
}
```

## Error Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (accessing other user's data)
- `404`: Not Found
- `409`: Conflict (resource already exists)
- `500`: Internal Server Error

## Development

### Adding New Features

1. Create a new branch from main
2. Implement the feature
3. Add tests
4. Update documentation
5. Submit for review

### Code Style

- Use ESLint for code linting
- Follow consistent naming conventions
- Add JSDoc comments for functions
- Write meaningful commit messages

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue in the repository.
