# User Registration Form with Validation

A complete user registration system with comprehensive client-side and server-side validation.

## Features

### Client-Side Validation
- Real-time field validation
- Email format validation using regex
- Password strength requirements
- Required field validation
- Visual error feedback
- Success message display

### Server-Side Validation
- RESTful API endpoint
- Comprehensive validation functions
- Input sanitization
- Error handling
- JSON response format

## Validation Rules

### Email
- Required field
- Must be valid email format (includes @ and domain)
- Example: `user@example.com`

### Password
- Required field
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*)
- Example: `Test@123`

### Username
- Required field
- Minimum 3 characters
- Alphanumeric and underscore only
- Example: `john_doe`

### Full Name
- Required field
- Minimum 2 characters
- Maximum 100 characters
- Example: `John Doe`

### Confirm Password
- Required field
- Must match password field exactly

## File Structure

```
.
├── registration.html           # Client-side registration form
├── validation.js              # Client-side validation logic
├── server/
│   ├── validation.js          # Server-side validation functions
│   ├── registrationController.js  # Registration endpoint handler
│   ├── server.js              # Express server setup
│   └── package.json           # Server dependencies
├── tests/
│   └── validation.test.js     # Unit tests for validation
└── README.md                  # This file
```

## Installation

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. Server will run on `http://localhost:3000`

## Usage

### Client-Side

1. Open `registration.html` in a web browser
2. Fill out the registration form
3. Real-time validation will provide immediate feedback
4. Submit the form to see success message

### API Endpoint

**POST** `/api/register`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "Test@123",
  "confirmPassword": "Test@123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "username": "johndoe"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "password": "Password must contain at least 8 characters, at least one uppercase letter"
  }
}
```

## Testing

### Run Unit Tests

1. Navigate to the project root:
   ```bash
   cd ..
   ```

2. Install test dependencies:
   ```bash
   npm install --save-dev jest
   ```

3. Run tests:
   ```bash
   npm test
   ```

### Test Coverage

The test suite includes comprehensive tests for:
- Email validation (valid/invalid formats)
- Password strength requirements
- Username validation rules
- Full name validation
- Password matching
- Complete form validation
- Data sanitization

## Validation Functions

### Server-Side Functions

- `validateEmail(email)` - Validates email format
- `validatePassword(password)` - Checks password strength
- `validateUsername(username)` - Validates username rules
- `validateFullName(fullName)` - Validates full name
- `validatePasswordMatch(password, confirmPassword)` - Checks password match
- `validateRegistrationForm(formData)` - Validates entire form

### Client-Side Functions

- `validateEmail(email)` - Email format validation
- `validatePassword(password)` - Password strength validation
- `isNotEmpty(value)` - Required field validation
- `validateUsername(username)` - Username validation
- `validateForm()` - Complete form validation

## Security Considerations

1. **Client-side validation** provides user experience but is not a security measure
2. **Server-side validation** is mandatory and validates all inputs
3. Passwords should be hashed before storage (not implemented in this demo)
4. HTTPS should be used in production
5. Rate limiting should be implemented to prevent abuse
6. CSRF protection should be added
7. Input sanitization removes dangerous characters

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

### Server
- `express` ^4.18.2 - Web framework
- `body-parser` ^1.20.2 - Request body parsing

### Development
- `nodemon` ^3.0.1 - Auto-restart during development
- `jest` ^29.5.0 - Testing framework

## Future Enhancements

- [ ] Add password hashing (bcrypt)
- [ ] Implement database storage
- [ ] Add email verification
- [ ] Implement rate limiting
- [ ] Add CAPTCHA for bot protection
- [ ] Implement OAuth social login
- [ ] Add password strength meter UI
- [ ] Implement "show password" toggle
- [ ] Add username availability check
- [ ] Implement session management

## License

MIT

## Author

Software Developer

## Acceptance Criteria

✅ **Email format validation** - Implemented with regex pattern matching

✅ **Password strength requirements** - Enforced 8+ characters, uppercase, lowercase, number, and special character

✅ **All fields required** - Validated on both client and server side

✅ **Client-side validation** - Real-time feedback with visual indicators

✅ **Server-side validation** - Comprehensive validation with sanitization

✅ **Well-documented code** - Extensive comments and documentation

✅ **Test coverage** - Comprehensive unit tests for all validation functions