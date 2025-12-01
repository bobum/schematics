/**
 * User Registration Form Validation
 * Feature: test_001 - Add input validation to user registration form
 * 
 * This module provides comprehensive client-side validation for the user registration form.
 * It includes real-time validation, password strength checking, and user feedback.
 */

(function() {
  'use strict';

  // Validation rules and messages
  const validationRules = {
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
      messages: {
        required: 'Username is required',
        minLength: 'Username must be at least 3 characters',
        maxLength: 'Username must be no more than 20 characters',
        pattern: 'Username can only contain letters, numbers, and underscores'
      }
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      messages: {
        required: 'Email is required',
        pattern: 'Please enter a valid email address'
      }
    },
    password: {
      required: true,
      minLength: 8,
      custom: (value) => {
        const hasUppercase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
        if (!hasUppercase) return 'Password must contain at least one uppercase letter';
        if (!hasLowercase) return 'Password must contain at least one lowercase letter';
        if (!hasNumber) return 'Password must contain at least one number';
        if (!hasSpecial) return 'Password must contain at least one special character';
        
        return null;
      },
      messages: {
        required: 'Password is required',
        minLength: 'Password must be at least 8 characters'
      }
    },
    confirmPassword: {
      required: true,
      matchField: 'password',
      messages: {
        required: 'Please confirm your password',
        match: 'Passwords do not match'
      }
    },
    fullName: {
      maxLength: 50,
      pattern: /^[a-zA-Z\s]*$/,
      messages: {
        maxLength: 'Full name must be no more than 50 characters',
        pattern: 'Full name can only contain letters and spaces'
      }
    },
    phone: {
      pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      messages: {
        pattern: 'Please enter a valid phone number'
      }
    },
    terms: {
      required: true,
      messages: {
        required: 'You must agree to the terms and conditions'
      }
    }
  };

  // DOM elements
  const form = document.getElementById('registrationForm');
  const submitBtn = document.getElementById('submitBtn');
  const successMessage = document.getElementById('successMessage');
  
  // Track validation state
  const fieldStates = {};

  /**
   * Validate a single field based on its rules
   * @param {string} fieldName - Name of the field to validate
   * @param {*} value - Value to validate
   * @returns {string|null} - Error message or null if valid
   */
  function validateField(fieldName, value) {
    const rules = validationRules[fieldName];
    if (!rules) return null;

    // Required validation
    if (rules.required && (!value || value.trim() === '')) {
      return rules.messages.required;
    }

    // Skip other validations if field is empty and not required
    if (!rules.required && (!value || value.trim() === '')) {
      return null;
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      return rules.messages.minLength;
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.messages.maxLength;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.messages.pattern;
    }

    // Match field validation (for confirm password)
    if (rules.matchField) {
      const matchFieldValue = document.getElementById(rules.matchField).value;
      if (value !== matchFieldValue) {
        return rules.messages.match;
      }
    }

    // Custom validation function
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) return customError;
    }

    return null;
  }

  /**
   * Show error message for a field
   * @param {string} fieldId - ID of the field
   * @param {string} message - Error message to display
   */
  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);
    
    if (field && errorElement) {
      field.classList.add('error');
      field.classList.remove('success');
      errorElement.textContent = message;
      errorElement.classList.add('show');
      fieldStates[fieldId] = false;
    }
  }

  /**
   * Clear error message for a field
   * @param {string} fieldId - ID of the field
   */
  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);
    
    if (field && errorElement) {
      field.classList.remove('error');
      field.classList.add('success');
      errorElement.textContent = '';
      errorElement.classList.remove('show');
      fieldStates[fieldId] = true;
    }
  }

  /**
   * Calculate password strength
   * @param {string} password - Password to evaluate
   * @returns {object} - Strength score and label
   */
  function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 15;
    
    let label = '';
    let color = '';
    
    if (strength <= 30) {
      label = 'Weak';
      color = '#e74c3c';
    } else if (strength <= 60) {
      label = 'Fair';
      color = '#f39c12';
    } else if (strength <= 80) {
      label = 'Good';
      color = '#3498db';
    } else {
      label = 'Strong';
      color = '#27ae60';
    }
    
    return { strength, label, color };
  }

  /**
   * Update password strength indicator
   * @param {string} password - Current password value
   */
  function updatePasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    if (!password) {
      strengthBar.style.setProperty('--strength-width', '0%');
      strengthText.textContent = '';
      return;
    }
    
    const { strength, label, color } = calculatePasswordStrength(password);
    
    strengthBar.style.setProperty('--strength-width', `${strength}%`);
    strengthBar.style.setProperty('--strength-color', color);
    strengthText.textContent = label;
    strengthText.style.color = color;
  }

  /**
   * Handle real-time field validation
   * @param {Event} event - Input event
   */
  function handleFieldValidation(event) {
    const field = event.target;
    const fieldName = field.name;
    const fieldValue = field.type === 'checkbox' ? field.checked : field.value;
    
    // Special handling for password strength
    if (fieldName === 'password') {
      updatePasswordStrength(fieldValue);
    }
    
    // Validate confirm password when password changes
    if (fieldName === 'password') {
      const confirmPassword = document.getElementById('confirmPassword');
      if (confirmPassword.value) {
        const confirmError = validateField('confirmPassword', confirmPassword.value);
        if (confirmError) {
          showError('confirmPassword', confirmError);
        } else {
          clearError('confirmPassword');
        }
      }
    }
    
    const error = validateField(fieldName, fieldValue);
    
    if (error) {
      showError(field.id, error);
    } else {
      clearError(field.id);
    }
    
    updateSubmitButton();
  }

  /**
   * Validate entire form
   * @returns {boolean} - True if form is valid
   */
  function validateForm() {
    let isValid = true;
    
    // Validate all fields with rules
    Object.keys(validationRules).forEach(fieldName => {
      const field = document.getElementById(fieldName);
      if (field) {
        const value = field.type === 'checkbox' ? field.checked : field.value;
        const error = validateField(fieldName, value);
        
        if (error) {
          showError(fieldName, error);
          isValid = false;
        } else {
          clearError(fieldName);
        }
      }
    });
    
    return isValid;
  }

  /**
   * Update submit button state based on form validity
   */
  function updateSubmitButton() {
    const allValid = Object.keys(fieldStates).every(key => fieldStates[key]);
    const requiredFields = ['username', 'email', 'password', 'confirmPassword', 'terms'];
    const allRequiredFilled = requiredFields.every(field => {
      const element = document.getElementById(field);
      if (element.type === 'checkbox') {
        return element.checked;
      }
      return element.value.trim() !== '';
    });
    
    if (allRequiredFilled && allValid) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }

  /**
   * Handle form submission
   * @param {Event} event - Submit event
   */
  function handleSubmit(event) {
    event.preventDefault();
    
    if (validateForm()) {
      // Get form data
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      // In a real application, this would send data to a server
      console.log('Registration data:', data);
      
      // Show success message
      successMessage.style.display = 'block';
      form.style.display = 'none';
      
      // Reset form after a delay (for demo purposes)
      setTimeout(() => {
        form.reset();
        form.style.display = 'flex';
        successMessage.style.display = 'none';
        Object.keys(fieldStates).forEach(key => {
          const field = document.getElementById(key);
          if (field) {
            field.classList.remove('success', 'error');
          }
        });
        updatePasswordStrength('');
        submitBtn.disabled = true;
      }, 3000);
    }
  }

  /**
   * Handle form reset
   */
  function handleReset() {
    // Clear all validation states
    Object.keys(fieldStates).forEach(key => {
      const field = document.getElementById(key);
      const errorElement = document.getElementById(`${key}Error`);
      if (field) {
        field.classList.remove('success', 'error');
      }
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
      }
    });
    
    updatePasswordStrength('');
    submitBtn.disabled = true;
  }

  /**
   * Initialize the form validation
   */
  function init() {
    // Add event listeners to all form fields
    const fields = form.querySelectorAll('input');
    fields.forEach(field => {
      // Validate on blur (when user leaves field)
      field.addEventListener('blur', handleFieldValidation);
      
      // Real-time validation on input
      field.addEventListener('input', handleFieldValidation);
      
      // Initialize field states
      fieldStates[field.id] = false;
    });
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    // Form reset
    form.addEventListener('reset', handleReset);
    
    // Initial button state
    submitBtn.disabled = true;
    
    console.log('Registration form validation initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();