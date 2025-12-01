"""User Registration Form with Input Validation

This module provides a user registration form with comprehensive input validation
for all registration fields including username, email, password, and optional fields.
"""

import re
from typing import Dict, List, Optional


class ValidationError(Exception):
    """Custom exception for validation errors"""
    pass


class RegistrationForm:
    """User registration form with input validation
    
    Validates:
    - Username: 3-20 characters, alphanumeric and underscore only
    - Email: Valid email format
    - Password: Minimum 8 characters, must contain uppercase, lowercase, number, and special character
    - Confirm Password: Must match password
    - Age: Optional, must be 13 or older if provided
    - Phone: Optional, valid phone number format if provided
    """
    
    # Validation patterns
    USERNAME_PATTERN = re.compile(r'^[a-zA-Z0-9_]{3,20}$')
    EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    PASSWORD_MIN_LENGTH = 8
    PHONE_PATTERN = re.compile(r'^[\d\s\-\+\(\)]{10,}$')
    MIN_AGE = 13
    
    def __init__(self):
        self.errors: List[str] = []
        self.data: Dict[str, any] = {}
    
    def validate_username(self, username: str) -> bool:
        """Validate username format
        
        Args:
            username: Username string to validate
            
        Returns:
            bool: True if valid, False otherwise
        """
        if not username:
            self.errors.append("Username is required")
            return False
        
        if not self.USERNAME_PATTERN.match(username):
            self.errors.append(
                "Username must be 3-20 characters long and contain only "
                "letters, numbers, and underscores"
            )
            return False
        
        return True
    
    def validate_email(self, email: str) -> bool:
        """Validate email format
        
        Args:
            email: Email address to validate
            
        Returns:
            bool: True if valid, False otherwise
        """
        if not email:
            self.errors.append("Email is required")
            return False
        
        if not self.EMAIL_PATTERN.match(email):
            self.errors.append("Invalid email format")
            return False
        
        return True
    
    def validate_password(self, password: str) -> bool:
        """Validate password strength
        
        Args:
            password: Password string to validate
            
        Returns:
            bool: True if valid, False otherwise
        """
        if not password:
            self.errors.append("Password is required")
            return False
        
        if len(password) < self.PASSWORD_MIN_LENGTH:
            self.errors.append(
                f"Password must be at least {self.PASSWORD_MIN_LENGTH} characters long"
            )
            return False
        
        # Check for uppercase letter
        if not re.search(r'[A-Z]', password):
            self.errors.append("Password must contain at least one uppercase letter")
            return False
        
        # Check for lowercase letter
        if not re.search(r'[a-z]', password):
            self.errors.append("Password must contain at least one lowercase letter")
            return False
        
        # Check for digit
        if not re.search(r'\d', password):
            self.errors.append("Password must contain at least one number")
            return False
        
        # Check for special character
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            self.errors.append("Password must contain at least one special character")
            return False
        
        return True
    
    def validate_password_confirmation(self, password: str, confirm_password: str) -> bool:
        """Validate password confirmation matches
        
        Args:
            password: Original password
            confirm_password: Confirmation password
            
        Returns:
            bool: True if valid, False otherwise
        """
        if not confirm_password:
            self.errors.append("Password confirmation is required")
            return False
        
        if password != confirm_password:
            self.errors.append("Passwords do not match")
            return False
        
        return True
    
    def validate_age(self, age: Optional[int]) -> bool:
        """Validate age if provided
        
        Args:
            age: User's age (optional)
            
        Returns:
            bool: True if valid, False otherwise
        """
        if age is None:
            return True  # Age is optional
        
        try:
            age_int = int(age)
            if age_int < self.MIN_AGE:
                self.errors.append(f"You must be at least {self.MIN_AGE} years old to register")
                return False
            if age_int > 150:
                self.errors.append("Please enter a valid age")
                return False
        except (ValueError, TypeError):
            self.errors.append("Age must be a valid number")
            return False
        
        return True
    
    def validate_phone(self, phone: Optional[str]) -> bool:
        """Validate phone number if provided
        
        Args:
            phone: Phone number (optional)
            
        Returns:
            bool: True if valid, False otherwise
        """
        if not phone:
            return True  # Phone is optional
        
        if not self.PHONE_PATTERN.match(phone):
            self.errors.append("Invalid phone number format")
            return False
        
        return True
    
    def validate(self, form_data: Dict[str, any]) -> bool:
        """Validate all registration form fields
        
        Args:
            form_data: Dictionary containing form field values
                Required keys: username, email, password, confirm_password
                Optional keys: age, phone
        
        Returns:
            bool: True if all validations pass, False otherwise
        """
        self.errors = []  # Reset errors
        self.data = form_data
        
        # Validate required fields
        username_valid = self.validate_username(form_data.get('username', ''))
        email_valid = self.validate_email(form_data.get('email', ''))
        password_valid = self.validate_password(form_data.get('password', ''))
        confirm_valid = self.validate_password_confirmation(
            form_data.get('password', ''),
            form_data.get('confirm_password', '')
        )
        
        # Validate optional fields
        age_valid = self.validate_age(form_data.get('age'))
        phone_valid = self.validate_phone(form_data.get('phone'))
        
        return all([
            username_valid,
            email_valid,
            password_valid,
            confirm_valid,
            age_valid,
            phone_valid
        ])
    
    def get_errors(self) -> List[str]:
        """Get list of validation errors
        
        Returns:
            List of error messages
        """
        return self.errors
    
    def get_data(self) -> Dict[str, any]:
        """Get validated form data
        
        Returns:
            Dictionary of form data
        """
        return self.data
