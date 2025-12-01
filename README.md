# User Registration Form with Input Validation

A comprehensive, production-ready user registration form validation system implemented in Python. This module provides robust validation for all common registration fields with clear error messages and extensive test coverage.

## Features

### Validation Rules

#### Required Fields

1. **Username**
   - Length: 3-20 characters
   - Allowed characters: letters (a-z, A-Z), numbers (0-9), underscores (_)
   - Cannot contain spaces or special characters

2. **Email**
   - Must be a valid email format
   - Supports common email patterns (dots, plus signs, hyphens in local part)
   - Validates domain format

3. **Password**
   - Minimum length: 8 characters
   - Must contain at least:
     - One uppercase letter (A-Z)
     - One lowercase letter (a-z)
     - One digit (0-9)
     - One special character (!@#$%^&*(),.?":{}|<>)

4. **Confirm Password**
   - Must match the password field exactly

#### Optional Fields

5. **Age**
   - Minimum age: 13 years
   - Maximum age: 150 years (validation for realistic values)
   - Can be omitted

6. **Phone Number**
   - Minimum length: 10 characters (allows for international formats)
   - Supports various formats: +1 234 567 8900, (123) 456-7890, etc.
   - Can be omitted

## Project Structure

```
.
├── forms/
│   └── registration_form.py      # Main validation module
├── tests/
│   └── test_registration_form.py # Comprehensive unit tests
├── examples/
│   └── registration_example.py   # Usage examples and demonstrations
└── README.md                      # This file
```

## Installation

No external dependencies required! This module uses only Python standard library.

```bash
# Clone or download the repository
git clone <repository-url>
cd registration-validation
```

## Usage

### Basic Usage

```python
from forms.registration_form import RegistrationForm

# Create a form instance
form = RegistrationForm()

# Prepare form data
form_data = {
    'username': 'john_doe',
    'email': 'john@example.com',
    'password': 'SecurePass123!',
    'confirm_password': 'SecurePass123!',
    'age': 25,  # Optional
    'phone': '+1 234 567 8900'  # Optional
}

# Validate all fields
if form.validate(form_data):
    print("Registration successful!")
    # Process the registration...
else:
    print("Validation failed:")
    for error in form.get_errors():
        print(f"  - {error}")
```

### Field-by-Field Validation

```python
from forms.registration_form import RegistrationForm

form = RegistrationForm()

# Validate individual fields
if form.validate_username('john_doe'):
    print("Username is valid")

if form.validate_email('john@example.com'):
    print("Email is valid")

if form.validate_password('SecurePass123!'):
    print("Password is valid")
```

### Minimal Registration (Required Fields Only)

```python
from forms.registration_form import RegistrationForm

form = RegistrationForm()

# Only required fields
form_data = {
    'username': 'minimalist',
    'email': 'user@example.com',
    'password': 'ValidPass123!',
    'confirm_password': 'ValidPass123!'
}

if form.validate(form_data):
    print("Registration successful with minimal data!")
```

## Running Examples

The `examples/` directory contains comprehensive examples demonstrating various use cases:

```bash
python examples/registration_example.py
```

This will run:
1. Valid registration example
2. Invalid registration with multiple errors
3. Minimal registration (required fields only)
4. Field-by-field validation
5. Interactive registration form (optional)

## Running Tests

The module includes comprehensive unit tests covering all validation rules:

```bash
python -m unittest tests/test_registration_form.py
```

Or run tests with verbose output:

```bash
python -m unittest tests/test_registration_form.py -v
```

### Test Coverage

The test suite includes:
- ✓ Valid and invalid username formats
- ✓ Valid and invalid email formats
- ✓ Password strength validation
- ✓ Password confirmation matching
- ✓ Age validation (minimum, maximum, optional)
- ✓ Phone number validation (various formats, optional)
- ✓ Complete form validation
- ✓ Edge cases and error messages

## API Reference

### RegistrationForm Class

#### Methods

**`validate(form_data: Dict[str, any]) -> bool`**

Validates all registration form fields.

- **Parameters:**
  - `form_data`: Dictionary containing form field values
    - Required keys: `username`, `email`, `password`, `confirm_password`
    - Optional keys: `age`, `phone`
- **Returns:** `True` if all validations pass, `False` otherwise
- **Side Effects:** Populates internal error list accessible via `get_errors()`

**`validate_username(username: str) -> bool`**

Validates username format.

**`validate_email(email: str) -> bool`**

Validates email format.

**`validate_password(password: str) -> bool`**

Validates password strength.

**`validate_password_confirmation(password: str, confirm_password: str) -> bool`**

Validates password confirmation matches.

**`validate_age(age: Optional[int]) -> bool`**

Validates age if provided.

**`validate_phone(phone: Optional[str]) -> bool`**

Validates phone number if provided.

**`get_errors() -> List[str]`**

Returns list of validation error messages.

**`get_data() -> Dict[str, any]`**

Returns the form data that was validated.

## Error Messages

The validation system provides clear, user-friendly error messages:

- "Username is required"
- "Username must be 3-20 characters long and contain only letters, numbers, and underscores"
- "Email is required"
- "Invalid email format"
- "Password is required"
- "Password must be at least 8 characters long"
- "Password must contain at least one uppercase letter"
- "Password must contain at least one lowercase letter"
- "Password must contain at least one number"
- "Password must contain at least one special character"
- "Password confirmation is required"
- "Passwords do not match"
- "You must be at least 13 years old to register"
- "Please enter a valid age"
- "Age must be a valid number"
- "Invalid phone number format"

## Integration Examples

### Flask Web Application

```python
from flask import Flask, request, jsonify
from forms.registration_form import RegistrationForm

app = Flask(__name__)

@app.route('/register', methods=['POST'])
def register():
    form = RegistrationForm()
    
    if form.validate(request.json):
        # Process registration
        return jsonify({
            'success': True,
            'message': 'Registration successful'
        }), 200
    else:
        return jsonify({
            'success': False,
            'errors': form.get_errors()
        }), 400
```

### Django Web Application

```python
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from forms.registration_form import RegistrationForm
import json

@require_http_methods(["POST"])
def register(request):
    form = RegistrationForm()
    data = json.loads(request.body)
    
    if form.validate(data):
        # Process registration
        return JsonResponse({
            'success': True,
            'message': 'Registration successful'
        })
    else:
        return JsonResponse({
            'success': False,
            'errors': form.get_errors()
        }, status=400)
```

## Best Practices

1. **Always validate on the server side**: Client-side validation can be bypassed
2. **Use HTTPS**: Always transmit passwords over secure connections
3. **Hash passwords**: Never store plain text passwords (use bcrypt, argon2, etc.)
4. **Rate limiting**: Implement rate limiting on registration endpoints
5. **Email verification**: Send verification emails before activating accounts
6. **CAPTCHA**: Consider adding CAPTCHA to prevent automated registrations

## Security Considerations

- This module validates input format but does NOT handle:
  - Password hashing (use bcrypt, argon2id, or similar)
  - SQL injection prevention (use parameterized queries)
  - XSS prevention (sanitize output in your views)
  - CSRF protection (implement in your web framework)
  - Rate limiting (implement in your application)

## Contributing

Contributions are welcome! Please ensure:

1. All tests pass
2. New features include tests
3. Code follows PEP 8 style guidelines
4. Documentation is updated

## License

MIT License - feel free to use in your projects!

## Support

For issues, questions, or contributions, please open an issue on the repository.

## Changelog

### Version 1.0.0 (Initial Release)
- Complete validation for username, email, password
- Password strength requirements
- Optional age and phone validation
- Comprehensive test suite
- Example usage demonstrations
- Full documentation
