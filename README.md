# User Registration Form with Input Validation

Comprehensive user registration form implementation with both client-side and server-side validation.

## Features

### ✅ Client-Side Validation
- Real-time field validation on blur and input events
- Email format validation using RFC-compliant regex
- Strong password requirements enforcement
- Password confirmation matching
- Visual feedback for validation errors
- All fields marked as required

### ✅ Server-Side Validation
- Comprehensive Python validation module
- Email format validation with length checks
- Password strength validation
- Name field validation with character restrictions
- Input sanitization for security
- Detailed error messages

## Password Requirements

Passwords must meet ALL of the following criteria:
- Minimum 8 characters long
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one digit (0-9)
- At least one special character (@$!%*?&#)
- Maximum 128 characters

## Email Validation

- Must be a valid email format (user@domain.com)
- Maximum 254 characters (RFC 5321)
- No spaces allowed

## Name Fields Validation

- Minimum 2 characters
- Maximum 50 characters
- Only letters, spaces, hyphens, and apostrophes allowed
- No numbers or special characters (except hyphen and apostrophe)

## Files

### Client-Side Files

#### `registration.html`
- Responsive HTML5 registration form
- Clean, professional UI with validation styling
- Real-time error message display
- Success message on valid submission
- Accessible form design

#### `validation.js`
- Comprehensive client-side validation
- Email regex validation
- Password strength checking
- Real-time field validation
- Form submission handling
- Well-documented functions

### Server-Side Files

#### `server_validation.py`
- `RegistrationValidator` class for all validation logic
- Individual validation methods for each field type
- `validate_registration()` method for full form validation
- Input sanitization functionality
- Convenience function for quick validation

#### `test_server_validation.py`
- Comprehensive unit tests for all validation functions
- Tests for valid and invalid inputs
- Edge case testing
- 30+ test cases covering all scenarios

## Usage

### Client-Side

1. Open `registration.html` in a web browser
2. Fill out the form fields
3. See real-time validation feedback as you type
4. Submit the form when all fields are valid

### Server-Side

```python
from server_validation import RegistrationValidator

# Create validator instance
validator = RegistrationValidator()

# Validate registration data
data = {
    'first_name': 'John',
    'last_name': 'Doe',
    'email': 'john.doe@example.com',
    'password': 'SecurePass123!',
    'confirm_password': 'SecurePass123!'
}

is_valid, errors = validator.validate_registration(data)

if is_valid:
    print("Registration data is valid!")
    # Process registration...
else:
    print("Validation errors:", errors)
    # Return errors to user...
```

### Using the Convenience Function

```python
from server_validation import validate_registration_data

data = {...}  # Registration form data
is_valid, errors = validate_registration_data(data)
```

### Input Sanitization

```python
from server_validation import RegistrationValidator

validator = RegistrationValidator()
clean_input = validator.sanitize_input(user_input)
```

## Running Tests

### Run all tests:
```bash
python -m unittest test_server_validation.py
```

### Run with pytest (if installed):
```bash
python -m pytest test_server_validation.py -v
```

### Run specific test:
```bash
python -m unittest test_server_validation.TestRegistrationValidator.test_validate_email_with_valid_email
```

## Integration Examples

### Flask Integration

```python
from flask import Flask, request, jsonify
from server_validation import validate_registration_data

app = Flask(__name__)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    is_valid, errors = validate_registration_data(data)
    
    if not is_valid:
        return jsonify({'success': False, 'errors': errors}), 400
    
    # Process registration...
    return jsonify({'success': True, 'message': 'Registration successful'})
```

### Django Integration

```python
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from server_validation import validate_registration_data

@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        is_valid, errors = validate_registration_data(data)
        
        if not is_valid:
            return JsonResponse({'success': False, 'errors': errors}, status=400)
        
        # Process registration...
        return JsonResponse({'success': True, 'message': 'Registration successful'})
```

## Security Considerations

1. **Client-side validation is not enough**: Always validate on the server-side as well
2. **Input sanitization**: Use the provided sanitization function for all user inputs
3. **Password handling**: Never store passwords in plain text; use proper hashing (bcrypt, argon2)
4. **HTTPS required**: Always use HTTPS in production to protect data in transit
5. **Rate limiting**: Implement rate limiting on registration endpoints
6. **CSRF protection**: Use CSRF tokens for form submissions

## Acceptance Criteria ✓

- ✅ Email format validation (client and server)
- ✅ Password strength requirements (8+ chars, uppercase, lowercase, digit, special char)
- ✅ All fields required (first name, last name, email, password, confirm password)
- ✅ Client-side validation with real-time feedback
- ✅ Server-side validation with comprehensive checks
- ✅ Well-documented code
- ✅ Unit tests with 30+ test cases
- ✅ Ready for production integration

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Modern mobile browsers

## Dependencies

### Client-Side
- No external dependencies (vanilla JavaScript)
- Modern browser with ES6 support

### Server-Side
- Python 3.6+
- No external dependencies for validation module
- `unittest` (included in Python standard library) for tests

## Future Enhancements

- [ ] Add password strength meter visualization
- [ ] Implement email domain validation
- [ ] Add support for internationalized email addresses
- [ ] Add CAPTCHA integration
- [ ] Implement progressive password requirements
- [ ] Add support for OAuth/social login

## License

This code is provided as-is for educational and commercial use.

## Author

Developed as part of the test_001 feature implementation.
