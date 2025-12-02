"""Unit tests for server-side registration validation

Run tests with: python -m pytest test_server_validation.py
or: python -m unittest test_server_validation.py
"""

import unittest
from server_validation import RegistrationValidator, validate_registration_data


class TestRegistrationValidator(unittest.TestCase):
    """Test cases for RegistrationValidator class"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.validator = RegistrationValidator()
    
    def test_validate_required_with_empty_string(self):
        """Test that empty strings fail required validation"""
        result = self.validator.validate_required('test_field', '')
        self.assertFalse(result)
        self.assertIn('test_field', self.validator.errors)
    
    def test_validate_required_with_whitespace(self):
        """Test that whitespace-only strings fail required validation"""
        result = self.validator.validate_required('test_field', '   ')
        self.assertFalse(result)
        self.assertIn('test_field', self.validator.errors)
    
    def test_validate_required_with_valid_value(self):
        """Test that non-empty strings pass required validation"""
        result = self.validator.validate_required('test_field', 'value')
        self.assertTrue(result)
        self.assertNotIn('test_field', self.validator.errors)
    
    def test_validate_email_with_valid_email(self):
        """Test validation of valid email addresses"""
        valid_emails = [
            'user@example.com',
            'john.doe@example.co.uk',
            'test+tag@domain.org',
            'user123@test-domain.com'
        ]
        for email in valid_emails:
            self.validator.errors = {}
            result = self.validator.validate_email(email)
            self.assertTrue(result, f"Failed to validate: {email}")
    
    def test_validate_email_with_invalid_email(self):
        """Test validation rejects invalid email addresses"""
        invalid_emails = [
            'invalid',
            '@example.com',
            'user@',
            'user @example.com',
            'user@example',
            ''
        ]
        for email in invalid_emails:
            self.validator.errors = {}
            result = self.validator.validate_email(email)
            self.assertFalse(result, f"Incorrectly validated: {email}")
    
    def test_validate_email_too_long(self):
        """Test that email addresses over 254 characters are rejected"""
        long_email = 'a' * 250 + '@example.com'
        result = self.validator.validate_email(long_email)
        self.assertFalse(result)
    
    def test_validate_password_with_valid_password(self):
        """Test validation of passwords meeting all requirements"""
        valid_passwords = [
            'SecurePass123!',
            'MyP@ssw0rd',
            'Test1234!@#$',
            'Abcdef1@'
        ]
        for password in valid_passwords:
            self.validator.errors = {}
            result = self.validator.validate_password(password)
            self.assertTrue(result, f"Failed to validate: {password}")
    
    def test_validate_password_too_short(self):
        """Test that passwords under 8 characters are rejected"""
        result = self.validator.validate_password('Pass1!')
        self.assertFalse(result)
        self.assertIn('password', self.validator.errors)
    
    def test_validate_password_no_uppercase(self):
        """Test that passwords without uppercase letters are rejected"""
        result = self.validator.validate_password('password123!')
        self.assertFalse(result)
        self.assertIn('password', self.validator.errors)
    
    def test_validate_password_no_lowercase(self):
        """Test that passwords without lowercase letters are rejected"""
        result = self.validator.validate_password('PASSWORD123!')
        self.assertFalse(result)
        self.assertIn('password', self.validator.errors)
    
    def test_validate_password_no_digit(self):
        """Test that passwords without digits are rejected"""
        result = self.validator.validate_password('Password!')
        self.assertFalse(result)
        self.assertIn('password', self.validator.errors)
    
    def test_validate_password_no_special_char(self):
        """Test that passwords without special characters are rejected"""
        result = self.validator.validate_password('Password123')
        self.assertFalse(result)
        self.assertIn('password', self.validator.errors)
    
    def test_validate_password_too_long(self):
        """Test that passwords over 128 characters are rejected"""
        long_password = 'A1!' + 'a' * 130
        result = self.validator.validate_password(long_password)
        self.assertFalse(result)
    
    def test_validate_password_match_with_matching_passwords(self):
        """Test that matching passwords pass validation"""
        password = 'SecurePass123!'
        result = self.validator.validate_password_match(password, password)
        self.assertTrue(result)
    
    def test_validate_password_match_with_different_passwords(self):
        """Test that non-matching passwords fail validation"""
        result = self.validator.validate_password_match('Password1!', 'Password2!')
        self.assertFalse(result)
        self.assertIn('confirm_password', self.validator.errors)
    
    def test_validate_name_with_valid_name(self):
        """Test validation of valid name fields"""
        valid_names = [
            'John',
            'Mary-Jane',
            "O'Connor",
            'Jean Paul'
        ]
        for name in valid_names:
            self.validator.errors = {}
            result = self.validator.validate_name('first_name', name)
            self.assertTrue(result, f"Failed to validate: {name}")
    
    def test_validate_name_too_short(self):
        """Test that single character names are rejected"""
        result = self.validator.validate_name('first_name', 'A')
        self.assertFalse(result)
    
    def test_validate_name_too_long(self):
        """Test that names over 50 characters are rejected"""
        long_name = 'A' * 51
        result = self.validator.validate_name('first_name', long_name)
        self.assertFalse(result)
    
    def test_validate_name_with_invalid_characters(self):
        """Test that names with numbers or special chars are rejected"""
        invalid_names = ['John123', 'Mary@Smith', 'Test#Name']
        for name in invalid_names:
            self.validator.errors = {}
            result = self.validator.validate_name('first_name', name)
            self.assertFalse(result, f"Incorrectly validated: {name}")
    
    def test_validate_registration_with_valid_data(self):
        """Test full registration validation with valid data"""
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'password': 'SecurePass123!',
            'confirm_password': 'SecurePass123!'
        }
        is_valid, errors = self.validator.validate_registration(data)
        self.assertTrue(is_valid)
        self.assertEqual(len(errors), 0)
    
    def test_validate_registration_with_all_empty_fields(self):
        """Test full registration validation with empty data"""
        data = {
            'first_name': '',
            'last_name': '',
            'email': '',
            'password': '',
            'confirm_password': ''
        }
        is_valid, errors = self.validator.validate_registration(data)
        self.assertFalse(is_valid)
        self.assertEqual(len(errors), 5)  # All 5 fields should have errors
    
    def test_validate_registration_with_invalid_email(self):
        """Test registration validation catches invalid email"""
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'invalid-email',
            'password': 'SecurePass123!',
            'confirm_password': 'SecurePass123!'
        }
        is_valid, errors = self.validator.validate_registration(data)
        self.assertFalse(is_valid)
        self.assertIn('email', errors)
    
    def test_validate_registration_with_weak_password(self):
        """Test registration validation catches weak password"""
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'password': 'weak',
            'confirm_password': 'weak'
        }
        is_valid, errors = self.validator.validate_registration(data)
        self.assertFalse(is_valid)
        self.assertIn('password', errors)
    
    def test_validate_registration_with_password_mismatch(self):
        """Test registration validation catches password mismatch"""
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'password': 'SecurePass123!',
            'confirm_password': 'DifferentPass123!'
        }
        is_valid, errors = self.validator.validate_registration(data)
        self.assertFalse(is_valid)
        self.assertIn('confirm_password', errors)
    
    def test_sanitize_input(self):
        """Test input sanitization removes control characters"""
        dirty_input = 'Hello\x00World\x1F  Test  '
        clean_output = self.validator.sanitize_input(dirty_input)
        self.assertEqual(clean_output, 'HelloWorld Test')
    
    def test_convenience_function(self):
        """Test the convenience validation function"""
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'password': 'SecurePass123!',
            'confirm_password': 'SecurePass123!'
        }
        is_valid, errors = validate_registration_data(data)
        self.assertTrue(is_valid)
        self.assertEqual(len(errors), 0)


if __name__ == '__main__':
    unittest.main()
