/**
 * test_001: User Registration Form Validation
 * Comprehensive input validation for user registration form
 * 
 * Features:
 * - Real-time validation on input/blur events
 * - Detailed error messages for each field
 * - Password strength validation
 * - Email format validation
 * - Phone number format validation
 * - Age range validation
 * - Terms and conditions checkbox validation
 * - Form submission handling
 */

(function() {
  'use strict';

  // Validation rules and regex patterns
  const ValidationRules = {
    username: {
      pattern: /^[a-zA-Z0-9_-]{3,20}$/,
      errorMessage: 'Username must be 3-20 characters and contain only letters, numbers, underscore, or hyphen'
    },
    email: {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      errorMessage: 'Please enter a valid email address'
    },
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecial: true,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      errorMessage: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
    },
    fullName: {
      pattern: /^[a-zA-Z\s]{2,50}$/,
      errorMessage: 'Full name must be 2-50 characters and contain only letters and spaces'
    },
    phone: {
      pattern: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/,
      errorMessage: 'Please enter a valid phone number'
    },
    age: {
      min: 13,
      max: 120,
      errorMessage: 'Age must be between 13 and 120'
    }
  };

  // DOM elements
  let elements = {};

  /**
   * Initialize the registration form
   */
  function init() {
    // Cache DOM elements
    elements = {
      showRegistrationBtn: document.getElementById('showRegistrationBtn'),
      registrationModal: document.getElementById('registrationModal'),
      closeRegistrationBtn: document.getElementById('closeRegistration'),
      cancelBtn: document.getElementById('cancelBtn'),
      registrationForm: document.getElementById('registrationForm'),
      username: document.getElementById('username'),
      email: document.getElementById('email'),
      password: document.getElementById('password'),
      confirmPassword: document.getElementById('confirmPassword'),
      fullName: document.getElementById('fullName'),
      phone: document.getElementById('phone'),
      age: document.getElementById('age'),
      terms: document.getElementById('terms'),
      successMessage: document.getElementById('formSuccessMessage')
    };

    // Attach event listeners
    attachEventListeners();
  }

  /**
   * Attach all event listeners
   */
  function attachEventListeners() {
    // Modal show/hide
    elements.showRegistrationBtn.addEventListener('click', showModal);
    elements.closeRegistrationBtn.addEventListener('click', hideModal);
    elements.cancelBtn.addEventListener('click', hideModal);
    elements.registrationModal.addEventListener('click', function(e) {
      if (e.target === elements.registrationModal) {
        hideModal();
      }
    });

    // Form submission
    elements.registrationForm.addEventListener('submit', handleSubmit);

    // Real-time validation on blur
    elements.username.addEventListener('blur', () => validateUsername());
    elements.email.addEventListener('blur', () => validateEmail());
    elements.password.addEventListener('blur', () => validatePassword());
    elements.confirmPassword.addEventListener('blur', () => validateConfirmPassword());
    elements.fullName.addEventListener('blur', () => validateFullName());
    elements.phone.addEventListener('blur', () => validatePhone());
    elements.age.addEventListener('blur', () => validateAge());
    elements.terms.addEventListener('change', () => validateTerms());

    // Real-time validation on input for better UX
    elements.username.addEventListener('input', () => clearError('username'));
    elements.email.addEventListener('input', () => clearError('email'));
    elements.password.addEventListener('input', () => {
      clearError('password');
      // Re-validate confirm password if it has a value
      if (elements.confirmPassword.value) {
        validateConfirmPassword();
      }
    });
    elements.confirmPassword.addEventListener('input', () => clearError('confirmPassword'));
    elements.fullName.addEventListener('input', () => clearError('fullName'));
    elements.phone.addEventListener('input', () => clearError('phone'));
    elements.age.addEventListener('input', () => clearError('age'));
  }

  /**
   * Show registration modal
   */
  function showModal() {
    elements.registrationModal.style.display = 'flex';
    elements.username.focus();
  }

  /**
   * Hide registration modal
   */
  function hideModal() {
    elements.registrationModal.style.display = 'none';
    resetForm();
  }

  /**
   * Reset form to initial state
   */
  function resetForm() {
    elements.registrationForm.reset();
    elements.successMessage.style.display = 'none';
    
    // Clear all error messages and styles
    const inputs = elements.registrationForm.querySelectorAll('input');
    inputs.forEach(input => {
      input.classList.remove('error', 'valid');
    });
    
    const errorMessages = elements.registrationForm.querySelectorAll('.error-message');
    errorMessages.forEach(msg => {
      msg.textContent = '';
    });
  }

  /**
   * Validate username
   */
  function validateUsername() {
    const value = elements.username.value.trim();
    
    if (!value) {
      showError('username', 'Username is required');
      return false;
    }
    
    if (!ValidationRules.username.pattern.test(value)) {
      showError('username', ValidationRules.username.errorMessage);
      return false;
    }
    
    showValid('username');
    return true;
  }

  /**
   * Validate email
   */
  function validateEmail() {
    const value = elements.email.value.trim();
    
    if (!value) {
      showError('email', 'Email is required');
      return false;
    }
    
    if (!ValidationRules.email.pattern.test(value)) {
      showError('email', ValidationRules.email.errorMessage);
      return false;
    }
    
    showValid('email');
    return true;
  }

  /**
   * Validate password
   */
  function validatePassword() {
    const value = elements.password.value;
    
    if (!value) {
      showError('password', 'Password is required');
      return false;
    }
    
    if (value.length < ValidationRules.password.minLength) {
      showError('password', `Password must be at least ${ValidationRules.password.minLength} characters`);
      return false;
    }
    
    if (!ValidationRules.password.pattern.test(value)) {
      showError('password', ValidationRules.password.errorMessage);
      return false;
    }
    
    showValid('password');
    return true;
  }

  /**
   * Validate confirm password
   */
  function validateConfirmPassword() {
    const password = elements.password.value;
    const confirmPassword = elements.confirmPassword.value;
    
    if (!confirmPassword) {
      showError('confirmPassword', 'Please confirm your password');
      return false;
    }
    
    if (password !== confirmPassword) {
      showError('confirmPassword', 'Passwords do not match');
      return false;
    }
    
    showValid('confirmPassword');
    return true;
  }

  /**
   * Validate full name
   */
  function validateFullName() {
    const value = elements.fullName.value.trim();
    
    if (!value) {
      showError('fullName', 'Full name is required');
      return false;
    }
    
    if (!ValidationRules.fullName.pattern.test(value)) {
      showError('fullName', ValidationRules.fullName.errorMessage);
      return false;
    }
    
    showValid('fullName');
    return true;
  }

  /**
   * Validate phone (optional field)
   */
  function validatePhone() {
    const value = elements.phone.value.trim();
    
    // Phone is optional, so empty is valid
    if (!value) {
      clearError('phone');
      return true;
    }
    
    if (!ValidationRules.phone.pattern.test(value)) {
      showError('phone', ValidationRules.phone.errorMessage);
      return false;
    }
    
    showValid('phone');
    return true;
  }

  /**
   * Validate age (optional field)
   */
  function validateAge() {
    const value = elements.age.value;
    
    // Age is optional, so empty is valid
    if (!value) {
      clearError('age');
      return true;
    }
    
    const age = parseInt(value, 10);
    
    if (isNaN(age) || age < ValidationRules.age.min || age > ValidationRules.age.max) {
      showError('age', ValidationRules.age.errorMessage);
      return false;
    }
    
    showValid('age');
    return true;
  }

  /**
   * Validate terms checkbox
   */
  function validateTerms() {
    if (!elements.terms.checked) {
      showError('terms', 'You must agree to the terms and conditions');
      return false;
    }
    
    clearError('terms');
    return true;
  }

  /**
   * Show error message for a field
   */
  function showError(fieldName, message) {
    const input = elements[fieldName];
    const errorElement = document.getElementById(`${fieldName}Error`);
    
    input.classList.add('error');
    input.classList.remove('valid');
    errorElement.textContent = message;
  }

  /**
   * Show valid state for a field
   */
  function showValid(fieldName) {
    const input = elements[fieldName];
    const errorElement = document.getElementById(`${fieldName}Error`);
    
    input.classList.remove('error');
    input.classList.add('valid');
    errorElement.textContent = '';
  }

  /**
   * Clear error for a field
   */
  function clearError(fieldName) {
    const input = elements[fieldName];
    const errorElement = document.getElementById(`${fieldName}Error`);
    
    input.classList.remove('error', 'valid');
    errorElement.textContent = '';
  }

  /**
   * Validate entire form
   */
  function validateForm() {
    const validations = [
      validateUsername(),
      validateEmail(),
      validatePassword(),
      validateConfirmPassword(),
      validateFullName(),
      validatePhone(),
      validateAge(),
      validateTerms()
    ];
    
    return validations.every(isValid => isValid);
  }

  /**
   * Handle form submission
   */
  function handleSubmit(event) {
    event.preventDefault();
    
    // Validate all fields
    const isValid = validateForm();
    
    if (!isValid) {
      // Focus on first error field
      const firstError = elements.registrationForm.querySelector('.error');
      if (firstError) {
        firstError.focus();
      }
      return;
    }
    
    // All validation passed
    const formData = {
      username: elements.username.value.trim(),
      email: elements.email.value.trim(),
      password: elements.password.value,
      fullName: elements.fullName.value.trim(),
      phone: elements.phone.value.trim(),
      age: elements.age.value ? parseInt(elements.age.value, 10) : null,
      termsAccepted: elements.terms.checked,
      registrationDate: new Date().toISOString()
    };
    
    // Log the form data (in production, this would be sent to a server)
    console.log('Registration Form Submitted:', formData);
    
    // Show success message
    elements.successMessage.style.display = 'block';
    
    // Reset form after 2 seconds
    setTimeout(() => {
      hideModal();
    }, 2000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();