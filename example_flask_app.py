"""Example Flask application with user registration validation

This demonstrates how to integrate the validation module into a Flask application.

Install dependencies:
    pip install flask

Run the application:
    python example_flask_app.py

Test the API:
    curl -X POST http://localhost:5000/api/register \
         -H "Content-Type: application/json" \
         -d '{"first_name":"John","last_name":"Doe","email":"john@example.com","password":"SecurePass123!","confirm_password":"SecurePass123!"}'
"""

from flask import Flask, request, jsonify, render_template_string
from server_validation import validate_registration_data, RegistrationValidator
import os

app = Flask(__name__)

# In production, use environment variable
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')


@app.route('/')
def index():
    """Serve the registration form"""
    try:
        with open('registration.html', 'r') as f:
            return f.read()
    except FileNotFoundError:
        return render_template_string('''
            <h1>Registration Form</h1>
            <p>Please ensure registration.html is in the same directory.</p>
            <p>Or use the API endpoint: POST /api/register</p>
        ''')


@app.route('/api/register', methods=['POST'])
def register():
    """Handle user registration with validation
    
    Expected JSON payload:
    {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "password": "SecurePass123!",
        "confirm_password": "SecurePass123!"
    }
    
    Returns:
        JSON response with success status and errors (if any)
    """
    # Get JSON data from request
    data = request.get_json()
    
    if not data:
        return jsonify({
            'success': False,
            'message': 'No data provided',
            'errors': {'general': 'Request must include JSON data'}
        }), 400
    
    # Sanitize inputs
    validator = RegistrationValidator()
    sanitized_data = {
        'first_name': validator.sanitize_input(data.get('first_name', '')),
        'last_name': validator.sanitize_input(data.get('last_name', '')),
        'email': validator.sanitize_input(data.get('email', '')),
        'password': data.get('password', ''),  # Don't sanitize password
        'confirm_password': data.get('confirm_password', '')  # Don't sanitize password
    }
    
    # Validate registration data
    is_valid, errors = validate_registration_data(sanitized_data)
    
    if not is_valid:
        return jsonify({
            'success': False,
            'message': 'Validation failed',
            'errors': errors
        }), 400
    
    # In a real application, you would:
    # 1. Hash the password (use bcrypt or argon2)
    # 2. Check if email already exists
    # 3. Create user in database
    # 4. Send confirmation email
    # 5. Create session or return JWT token
    
    # For this example, just return success
    return jsonify({
        'success': True,
        'message': 'Registration successful',
        'data': {
            'first_name': sanitized_data['first_name'],
            'last_name': sanitized_data['last_name'],
            'email': sanitized_data['email']
            # Never return password in response
        }
    }), 201


@app.route('/api/validate', methods=['POST'])
def validate_field():
    """Validate individual field (for AJAX validation)
    
    Expected JSON payload:
    {
        "field": "email",
        "value": "john@example.com"
    }
    
    Returns:
        JSON response with validation result
    """
    data = request.get_json()
    
    if not data or 'field' not in data or 'value' not in data:
        return jsonify({
            'valid': False,
            'error': 'Missing field or value'
        }), 400
    
    field = data['field']
    value = data['value']
    
    validator = RegistrationValidator()
    
    # Route to appropriate validation method
    if field == 'email':
        is_valid = validator.validate_email(value)
    elif field == 'password':
        is_valid = validator.validate_password(value)
    elif field in ['first_name', 'last_name']:
        is_valid = validator.validate_name(field, value)
    else:
        return jsonify({
            'valid': False,
            'error': 'Unknown field'
        }), 400
    
    if is_valid:
        return jsonify({'valid': True})
    else:
        return jsonify({
            'valid': False,
            'error': validator.errors.get(field, 'Validation failed')
        })


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'message': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'message': 'Internal server error'
    }), 500


if __name__ == '__main__':
    # Run in debug mode for development
    # In production, use a proper WSGI server like gunicorn
    app.run(debug=True, host='0.0.0.0', port=5000)
