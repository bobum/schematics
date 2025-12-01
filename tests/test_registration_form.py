"""Unit tests for user registration form validation

This module contains comprehensive tests for all validation rules
implemented in the RegistrationForm class.
"""

import unittest
import sys
import os

# Add parent directory to path to import the forms module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from forms.registration_form import RegistrationForm, ValidationError


class TestRegistrationFormValidation(unittest.TestCase):
    """Test cases for registration form validation"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.form = RegistrationForm()
    
    def test_valid_username(self):
        """Test that valid usernames pass validation"""
        valid_usernames = ['john_doe', 'user123', 'test_user_2023', 'abc']
        for username in valid_usernames:
            self.form.errors = []
            self.assertTrue(
                self.form.validate_username(username),
                f"Username '{username}' should be valid"
            )
    
    def test_invalid_username_too_short(self):
        """Test that usernames shorter than 3 characters fail"""
        self.assertFalse(self.form.validate_username('ab'))
        self.assertIn('3-20 characters', ' '.join(self.form.errors))
    
    def test_invalid_username_too_long(self):
        """Test that usernames longer than 20 characters fail"""
        self.assertFalse(self.form.validate_username('a' * 21))
        self.assertIn('3-20 characters', ' '.join(self.form.errors))
    
    def test_invalid_username_special_chars(self):
        """Test that usernames with special characters fail"""
        invalid_usernames = ['user@name', 'user-name', 'user name', 'user!123']
        for username in invalid_usernames:
            self.form.errors = []
            self.assertFalse(
                self.form.validate_username(username),
                f"Username '{username}' should be invalid"
            )
    
    def test_empty_username(self):
        """Test that empty username fails"""
        self.assertFalse(self.form.validate_username(''))
        self.assertIn('required', ' '.join(self.form.errors).lower())
    
    def test_valid_email(self):
        """Test that valid email addresses pass validation"""
        valid_emails = [
            'user@example.com',
            'john.doe@company.co.uk',
            'test_email+tag@domain.org',
            'user123@test-domain.com'
        ]
        for email in valid_emails:
            self.form.errors = []
            self.assertTrue(
                self.form.validate_email(email),
                f"Email '{email}' should be valid"
            )
    
    def test_invalid_email_format(self):
        """Test that invalid email formats fail"""
        invalid_emails = [
            'notanemail',
            '@example.com',
            'user@',
            'user@domain',
            'user @domain.com',
            'user..name@domain.com'
        ]
        for email in invalid_emails:
            self.form.errors = []
            self.assertFalse(
                self.form.validate_email(email),
                f"Email '{email}' should be invalid"
            )
    
    def test_empty_email(self):
        """Test that empty email fails"""
        self.assertFalse(self.form.validate_email(''))
        self.assertIn('required', ' '.join(self.form.errors).lower())
    
    def test_valid_password(self):
        """Test that valid passwords pass validation"""
        valid_passwords = [
            'Password123!',
            'Secure@Pass1',
            'MyP@ssw0rd',
            'C0mpl3x!Pass'
        ]
        for password in valid_passwords:
            self.form.errors = []
            self.assertTrue(
                self.form.validate_password(password),
                f"Password should be valid"
            )
    
    def test_password_too_short(self):
        """Test that passwords shorter than 8 characters fail"""
        self.assertFalse(self.form.validate_password('Pass1!'))
        self.assertIn('8 characters', ' '.join(self.form.errors))
    
    def test_password_no_uppercase(self):
        """Test that passwords without uppercase fail"""
        self.assertFalse(self.form.validate_password('password123!'))
        self.assertIn('uppercase', ' '.join(self.form.errors))
    
    def test_password_no_lowercase(self):
        """Test that passwords without lowercase fail"""
        self.assertFalse(self.form.validate_password('PASSWORD123!'))
        self.assertIn('lowercase', ' '.join(self.form.errors))
    
    def test_password_no_digit(self):
        """Test that passwords without digits fail"""
        self.assertFalse(self.form.validate_password('Password!'))
        self.assertIn('number', ' '.join(self.form.errors))
    
    def test_password_no_special_char(self):
        """Test that passwords without special characters fail"""
        self.assertFalse(self.form.validate_password('Password123'))
        self.assertIn('special character', ' '.join(self.form.errors))
    
    def test_empty_password(self):
        """Test that empty password fails"""
        self.assertFalse(self.form.validate_password(''))
        self.assertIn('required', ' '.join(self.form.errors).lower())
    
    def test_password_confirmation_match(self):
        """Test that matching passwords pass confirmation"""
        password = 'Password123!'
        self.assertTrue(self.form.validate_password_confirmation(password, password))
    
    def test_password_confirmation_mismatch(self):
        """Test that non-matching passwords fail confirmation"""
        self.assertFalse(
            self.form.validate_password_confirmation('Password123!', 'DifferentPass1!')
        )
        self.assertIn('do not match', ' '.join(self.form.errors))
    
    def test_empty_password_confirmation(self):
        """Test that empty confirmation fails"""
        self.assertFalse(self.form.validate_password_confirmation('Password123!', ''))
        self.assertIn('required', ' '.join(self.form.errors).lower())
    
    def test_valid_age(self):
        """Test that valid ages pass validation"""
        valid_ages = [13, 18, 25, 50, 100]
        for age in valid_ages:
            self.form.errors = []
            self.assertTrue(
                self.form.validate_age(age),
                f"Age {age} should be valid"
            )
    
    def test_age_too_young(self):
        """Test that ages below minimum fail"""
        self.assertFalse(self.form.validate_age(12))
        self.assertIn('13 years old', ' '.join(self.form.errors))
    
    def test_age_too_old(self):
        """Test that unrealistic ages fail"""
        self.assertFalse(self.form.validate_age(151))
        self.assertIn('valid age', ' '.join(self.form.errors))
    
    def test_age_optional(self):
        """Test that None age is accepted (optional field)"""
        self.assertTrue(self.form.validate_age(None))
    
    def test_invalid_age_format(self):
        """Test that non-numeric ages fail"""
        self.assertFalse(self.form.validate_age('not a number'))
        self.assertIn('valid number', ' '.join(self.form.errors))
    
    def test_valid_phone(self):
        """Test that valid phone numbers pass validation"""
        valid_phones = [
            '1234567890',
            '+1 234 567 8900',
            '(123) 456-7890',
            '+44-20-1234-5678'
        ]
        for phone in valid_phones:
            self.form.errors = []
            self.assertTrue(
                self.form.validate_phone(phone),
                f"Phone '{phone}' should be valid"
            )
    
    def test_invalid_phone(self):
        """Test that invalid phone numbers fail"""
        invalid_phones = ['123', 'abcdefghij', '12-34-56']
        for phone in invalid_phones:
            self.form.errors = []
            self.assertFalse(
                self.form.validate_phone(phone),
                f"Phone '{phone}' should be invalid"
            )
    
    def test_phone_optional(self):
        """Test that empty phone is accepted (optional field)"""
        self.assertTrue(self.form.validate_phone(None))
        self.assertTrue(self.form.validate_phone(''))
    
    def test_complete_valid_form(self):
        """Test that a complete valid form passes all validations"""
        form_data = {
            'username': 'john_doe',
            'email': 'john@example.com',
            'password': 'SecurePass123!',
            'confirm_password': 'SecurePass123!',
            'age': 25,
            'phone': '+1 234 567 8900'
        }
        self.assertTrue(self.form.validate(form_data))
        self.assertEqual(len(self.form.get_errors()), 0)
    
    def test_complete_invalid_form(self):
        """Test that an invalid form fails validation"""
        form_data = {
            'username': 'ab',  # Too short
            'email': 'invalid-email',  # Invalid format
            'password': 'weak',  # Too weak
            'confirm_password': 'different',  # Doesn't match
            'age': 10,  # Too young
            'phone': '123'  # Too short
        }
        self.assertFalse(self.form.validate(form_data))
        self.assertGreater(len(self.form.get_errors()), 0)
    
    def test_minimal_valid_form(self):
        """Test that a form with only required fields passes"""
        form_data = {
            'username': 'john_doe',
            'email': 'john@example.com',
            'password': 'SecurePass123!',
            'confirm_password': 'SecurePass123!'
        }
        self.assertTrue(self.form.validate(form_data))
        self.assertEqual(len(self.form.get_errors()), 0)


if __name__ == '__main__':
    unittest.main()
