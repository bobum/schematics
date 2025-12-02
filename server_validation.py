"""Server-side validation for user registration form

This module provides comprehensive validation functions for user registration,
including email format validation, password strength requirements, and
required field checks.

Usage:
    from server_validation import RegistrationValidator
    
    validator = RegistrationValidator()
    is_valid, errors = validator.validate_registration({
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john.doe@example.com',
        'password': 'SecurePass123!',
        'confirm_password': 'SecurePass123!'
    })
"""

import re
from typing import Dict, Tuple, List


class RegistrationValidator:
    """Validates user registration form data"""
    
    # Email validation regex - RFC 5322 simplified
    EMAIL_REGEX = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
    
    # Password requirements:
    # - At least 8 characters
    # - At least one uppercase letter
    # - At least one lowercase letter
    # - At least one digit
    # - At least one special character
    PASSWORD_REGEX = re.compile(
        r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$'
    )
    
    def __init__(self):
        """Initialize the validator"""
        self.errors = {}
    
    def validate_required(self, field_name: str, value: str) -> bool:
        """Validate that a field is not empty
        
        Args:
            field_name: Name of the field being validated
            value: Value to validate
            
        Returns:
            bool: True if field is not empty, False otherwise
        """
        if not value or not value.strip():
            self.errors[field_name] = f"{field_name.replace('_', ' ').title()} is required"
            return False
        return True
    
    def validate_email(self, email: str) -> bool:
        """Validate email format
        
        Args:
            email: Email address to validate
            
        Returns:
            bool: True if email format is valid, False otherwise
        """
        if not self.validate_required('email', email):
            return False
        
        if not self.EMAIL_REGEX.match(email):
            self.errors['email'] = 'Please enter a valid email address'
            return False
        
        if len(email) > 254:  # RFC 5321
            self.errors['email'] = 'Email address is too long'
            return False
        
        return True
    
    def validate_password(self, password: str) -> bool:
        """Validate password strength
        
        Password must meet the following requirements:
        - At least 8 characters long
        - Contains at least one uppercase letter
        - Contains at least one lowercase letter
        - Contains at least one digit
        - Contains at least one special character (@$!%*?&#)
        
        Args:
            password: Password to validate
            
        Returns:
            bool: True if password meets all requirements, False otherwise
        """
        if not self.validate_required('password', password):
            return False
        
        if len(password) < 8:
            self.errors['password'] = 'Password must be at least 8 characters long'
            return False
        
        if len(password) > 128:
            self.errors['password'] = 'Password is too long (max 128 characters)'
            return False
        
        if not self.PASSWORD_REGEX.match(password):
            self.errors['password'] = (
                'Password must contain at least one uppercase letter, '
                'one lowercase letter, one digit, and one special character (@$!%*?&#)'
            )
            return False
        
        return True
    
    def validate_password_match(self, password: str, confirm_password: str) -> bool:
        """Validate that password and confirmation match
        
        Args:
            password: Original password
            confirm_password: Confirmation password
            
        Returns:
            bool: True if passwords match, False otherwise
        """
        if not self.validate_required('confirm_password', confirm_password):
            return False
        
        if password != confirm_password:
            self.errors['confirm_password'] = 'Passwords do not match'
            return False
        
        return True
    
    def validate_name(self, field_name: str, value: str) -> bool:
        """Validate name fields (first name, last name)
        
        Args:
            field_name: Name of the field (e.g., 'first_name', 'last_name')
            value: Name value to validate
            
        Returns:
            bool: True if name is valid, False otherwise
        """
        if not self.validate_required(field_name, value):
            return False
        
        if len(value.strip()) < 2:
            self.errors[field_name] = (
                f"{field_name.replace('_', ' ').title()} must be at least 2 characters"
            )
            return False
        
        if len(value) > 50:
            self.errors[field_name] = (
                f"{field_name.replace('_', ' ').title()} is too long (max 50 characters)"
            )
            return False
        
        # Allow only letters, spaces, hyphens, and apostrophes
        if not re.match(r"^[a-zA-Z '-]+$", value):
            self.errors[field_name] = (
                f"{field_name.replace('_', ' ').title()} can only contain letters, "
                "spaces, hyphens, and apostrophes"
            )
            return False
        
        return True
    
    def validate_registration(self, data: Dict[str, str]) -> Tuple[bool, Dict[str, str]]:
        """Validate all registration form fields
        
        Args:
            data: Dictionary containing registration form data with keys:
                  'first_name', 'last_name', 'email', 'password', 'confirm_password'
        
        Returns:
            Tuple containing:
            - bool: True if all validations pass, False otherwise
            - Dict[str, str]: Dictionary of field names to error messages
        """
        self.errors = {}  # Reset errors
        
        # Extract data with defaults
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        email = data.get('email', '')
        password = data.get('password', '')
        confirm_password = data.get('confirm_password', '')
        
        # Validate all fields
        first_name_valid = self.validate_name('first_name', first_name)
        last_name_valid = self.validate_name('last_name', last_name)
        email_valid = self.validate_email(email)
        password_valid = self.validate_password(password)
        password_match_valid = self.validate_password_match(password, confirm_password)
        
        # All validations must pass
        is_valid = (
            first_name_valid and 
            last_name_valid and 
            email_valid and 
            password_valid and 
            password_match_valid
        )
        
        return is_valid, self.errors
    
    def sanitize_input(self, value: str) -> str:
        """Sanitize input by removing potentially dangerous characters
        
        Args:
            value: Input string to sanitize
            
        Returns:
            str: Sanitized string
        """
        if not value:
            return ''
        
        # Remove control characters and normalize whitespace
        sanitized = re.sub(r'[\x00-\x1F\x7F]', '', value)
        sanitized = ' '.join(sanitized.split())
        
        return sanitized.strip()


def validate_registration_data(data: Dict[str, str]) -> Tuple[bool, Dict[str, str]]:
    """Convenience function to validate registration data
    
    Args:
        data: Dictionary containing registration form data
        
    Returns:
        Tuple containing validation result and any errors
    """
    validator = RegistrationValidator()
    return validator.validate_registration(data)
