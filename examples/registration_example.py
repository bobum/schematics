"""Example usage of the User Registration Form validation

This example demonstrates how to use the RegistrationForm class
to validate user registration inputs in a real application.
"""

import sys
import os

# Add parent directory to path to import the forms module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from forms.registration_form import RegistrationForm


def example_valid_registration():
    """Example of a valid registration"""
    print("=" * 60)
    print("Example 1: Valid Registration")
    print("=" * 60)
    
    form = RegistrationForm()
    
    # Sample valid data
    form_data = {
        'username': 'john_doe_2024',
        'email': 'john.doe@example.com',
        'password': 'SecurePassword123!',
        'confirm_password': 'SecurePassword123!',
        'age': 28,
        'phone': '+1 (555) 123-4567'
    }
    
    print("\nInput data:")
    for key, value in form_data.items():
        if 'password' in key.lower():
            print(f"  {key}: {'*' * len(str(value))}")
        else:
            print(f"  {key}: {value}")
    
    # Validate the form
    is_valid = form.validate(form_data)
    
    print(f"\nValidation Result: {'✓ PASSED' if is_valid else '✗ FAILED'}")
    
    if is_valid:
        print("\nThe registration data is valid and can be processed.")
    else:
        print("\nValidation Errors:")
        for error in form.get_errors():
            print(f"  - {error}")
    
    print()


def example_invalid_registration():
    """Example of an invalid registration with multiple errors"""
    print("=" * 60)
    print("Example 2: Invalid Registration (Multiple Errors)")
    print("=" * 60)
    
    form = RegistrationForm()
    
    # Sample invalid data
    form_data = {
        'username': 'ab',  # Too short
        'email': 'invalid.email',  # Missing @ and domain
        'password': 'weak',  # Too short and missing requirements
        'confirm_password': 'different',  # Doesn't match password
        'age': 10,  # Below minimum age
        'phone': '123'  # Too short
    }
    
    print("\nInput data:")
    for key, value in form_data.items():
        if 'password' in key.lower():
            print(f"  {key}: {'*' * len(str(value))}")
        else:
            print(f"  {key}: {value}")
    
    # Validate the form
    is_valid = form.validate(form_data)
    
    print(f"\nValidation Result: {'✓ PASSED' if is_valid else '✗ FAILED'}")
    
    if is_valid:
        print("\nThe registration data is valid and can be processed.")
    else:
        print("\nValidation Errors:")
        for error in form.get_errors():
            print(f"  - {error}")
    
    print()


def example_minimal_registration():
    """Example of minimal registration (only required fields)"""
    print("=" * 60)
    print("Example 3: Minimal Registration (Required Fields Only)")
    print("=" * 60)
    
    form = RegistrationForm()
    
    # Sample data with only required fields
    form_data = {
        'username': 'minimalist_user',
        'email': 'user@minimal.com',
        'password': 'ValidPass123!',
        'confirm_password': 'ValidPass123!'
    }
    
    print("\nInput data:")
    for key, value in form_data.items():
        if 'password' in key.lower():
            print(f"  {key}: {'*' * len(str(value))}")
        else:
            print(f"  {key}: {value}")
    
    # Validate the form
    is_valid = form.validate(form_data)
    
    print(f"\nValidation Result: {'✓ PASSED' if is_valid else '✗ FAILED'}")
    
    if is_valid:
        print("\nThe registration data is valid and can be processed.")
        print("Note: Age and phone are optional fields.")
    else:
        print("\nValidation Errors:")
        for error in form.get_errors():
            print(f"  - {error}")
    
    print()


def example_field_by_field_validation():
    """Example of validating fields individually"""
    print("=" * 60)
    print("Example 4: Field-by-Field Validation")
    print("=" * 60)
    
    form = RegistrationForm()
    
    print("\nValidating individual fields:\n")
    
    # Username validation
    username = 'valid_user123'
    is_valid = form.validate_username(username)
    print(f"Username '{username}': {'✓ Valid' if is_valid else '✗ Invalid'}")
    if not is_valid:
        print(f"  Errors: {', '.join(form.get_errors())}")
    
    # Email validation
    form.errors = []  # Reset errors
    email = 'user@example.com'
    is_valid = form.validate_email(email)
    print(f"Email '{email}': {'✓ Valid' if is_valid else '✗ Invalid'}")
    if not is_valid:
        print(f"  Errors: {', '.join(form.get_errors())}")
    
    # Password validation
    form.errors = []  # Reset errors
    password = 'StrongP@ss123'
    is_valid = form.validate_password(password)
    print(f"Password: {'✓ Valid' if is_valid else '✗ Invalid'}")
    if not is_valid:
        print(f"  Errors: {', '.join(form.get_errors())}")
    
    # Age validation
    form.errors = []  # Reset errors
    age = 25
    is_valid = form.validate_age(age)
    print(f"Age '{age}': {'✓ Valid' if is_valid else '✗ Invalid'}")
    if not is_valid:
        print(f"  Errors: {', '.join(form.get_errors())}")
    
    print()


def interactive_registration():
    """Interactive example allowing user to test their own inputs"""
    print("=" * 60)
    print("Example 5: Interactive Registration Form")
    print("=" * 60)
    print("\nEnter your registration details (or press Enter to skip optional fields):\n")
    
    form = RegistrationForm()
    form_data = {}
    
    # Collect user inputs
    form_data['username'] = input("Username (3-20 chars, alphanumeric and underscore): ")
    form_data['email'] = input("Email: ")
    form_data['password'] = input("Password (8+ chars, mixed case, number, special char): ")
    form_data['confirm_password'] = input("Confirm Password: ")
    
    age_input = input("Age (optional, 13+): ")
    form_data['age'] = int(age_input) if age_input else None
    
    phone_input = input("Phone (optional): ")
    form_data['phone'] = phone_input if phone_input else None
    
    # Validate the form
    print("\n" + "=" * 60)
    is_valid = form.validate(form_data)
    
    print(f"\nValidation Result: {'✓ PASSED' if is_valid else '✗ FAILED'}")
    
    if is_valid:
        print("\n✓ Registration successful! Your account would be created.")
    else:
        print("\n✗ Registration failed. Please fix the following errors:")
        for i, error in enumerate(form.get_errors(), 1):
            print(f"  {i}. {error}")
    
    print()


if __name__ == '__main__':
    # Run all examples
    example_valid_registration()
    example_invalid_registration()
    example_minimal_registration()
    example_field_by_field_validation()
    
    # Optionally run interactive example
    response = input("Would you like to try the interactive registration form? (y/n): ")
    if response.lower() == 'y':
        print()
        interactive_registration()
    
    print("\nAll examples completed!")
