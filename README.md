# User Registration Form with Validation

A complete implementation of client-side and server-side validation for user registration forms.

## Features

### Client-Side Validation
- Real-time validation feedback as users fill out the form
- Visual error indicators for invalid fields
- Immediate user feedback on blur events
- Password strength requirements displayed inline

### Server-Side Validation
- Secure validation that cannot be bypassed
- Input sanitization to prevent injection attacks
- Comprehensive error reporting
- Express.js middleware support

### Validation Rules

#### Email
- **Required**: Yes
- **Format**: Valid email address (user@domain.com)
- **Max Length**: 255 characters
- **Pattern**: Must contain @ symbol and valid domain

#### Password
- **Required**: Yes
- **Minimum Length**: 8 characters
- **Maximum Length**: 128 characters
- **Requirements**:
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one number (0-9)
  - At least one special character (!@#$%^&*)

#### Username
- **Required**: Yes
- **Minimum Length**: 3 characters
- **Maximum Length**: 50 characters
- **Allowed Characters**: Letters, numbers, and underscores only
- **Pattern**: `^[a-zA-Z0-9_]{3,}$`

#### Password Confirmation
- **Required**: Yes
- **Must Match**: Original password field

## Files

### `registration.html`
The main HTML registration form with:
- Semantic HTML5 structure
- Responsive CSS styling
- Real-time error display
- Success message feedback
- Accessibility features

### `validation.js`
Client-side validation JavaScript module:
- Validation functions for each field
- Real-time blur event handlers
- Form submission handling
- Error display management
- Can be used in both browser and Node.js environments

### `server-validation.js`
Server-side validation Node.js module:
- Secure validation functions
- Input sanitization
- Express.js middleware
- Comprehensive error reporting
- Protection against common attacks

### `validation.test.js`
Comprehensive unit tests:
- Email validation tests
- Password strength tests
- Username validation tests
- Password confirmation tests
- Full form validation tests

## Usage

### Client-Side

1. Include the HTML file in your project:
```html
<!-- registration.html contains the complete form -->
```

2. The validation.js file is automatically loaded:
```html
<script src="validation.js"></script>
```

3. Open the HTML file in a browser to see the form in action.

### Server-Side (Node.js/Express)

1. Install the module:
```javascript
const validation = require('./server-validation');
```

2. Use as Express middleware:
```javascript
const express = require('express');
const { validateRegistrationMiddleware } = require('./server-validation');

const app = express();
app.use(express.json());

app.post('/register', validateRegistrationMiddleware, (req, res) => {
    // req.validatedData contains sanitized and validated data
    const { username, email, password } = req.validatedData;
    
    // Process registration...
    res.json({ success: true, message: 'Registration successful' });
});
```

3. Or validate manually:
```javascript
const { validateRegistrationForm } = require('./server-validation');

const result = validateRegistrationForm({
    username: 'testuser',
    email: 'test@example.com',
    password: 'Test123!',
    confirmPassword: 'Test123!'
});

if (result.isValid) {
    console.log('Valid data:', result.data);
} else {
    console.log('Errors:', result.errors);
}
```

## Running Tests

```bash
node validation.test.js
```

Expected output:
```
=== Running Validation Tests ===

Testing email validation...
✓ Email validation tests passed
Testing password validation...
✓ Password validation tests passed
Testing username validation...
✓ Username validation tests passed
Testing password confirmation...
✓ Password confirmation tests passed
Testing full form validation...
✓ Full form validation tests passed

=== All Tests Passed! ===
```

## Security Considerations

1. **Never Trust Client-Side Validation Alone**: Always validate on the server
2. **Input Sanitization**: All inputs are sanitized to prevent injection attacks
3. **Password Storage**: Remember to hash passwords before storing (use bcrypt or similar)
4. **Rate Limiting**: Implement rate limiting on registration endpoints
5. **HTTPS**: Always use HTTPS in production to protect credentials in transit
6. **CSRF Protection**: Implement CSRF tokens for form submissions

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- None for client-side implementation
- Node.js 12+ for server-side validation
- Express.js (optional, for middleware usage)

## License

MIT License - Feel free to use in your projects

## Contributing

Contributions are welcome! Please ensure all tests pass before submitting pull requests.

## Acceptance Criteria - COMPLETED ✓

- ✓ **Email format validation**: Implemented with comprehensive regex pattern
- ✓ **Password strength requirements**: 8+ chars, uppercase, lowercase, number, special char
- ✓ **All fields required**: Username, email, password, and confirmation all validated
- ✓ **Client-side validation**: Real-time feedback with visual indicators
- ✓ **Server-side validation**: Secure Node.js module with Express middleware
- ✓ **Well-documented**: Complete README with usage examples
- ✓ **Tested**: Comprehensive unit tests included

## Author

Software Developer Agent - Feature test_001