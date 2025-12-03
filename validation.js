/**
 * Client-Side Validation for User Registration Form
 * Provides comprehensive validation for all form fields
 */

// Get form and input elements
const form = document.getElementById('registrationForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

// Get error message elements
const fullNameError = document.getElementById('fullNameError');
const emailError = document.getElementById('emailError');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');

const successMessage = document.getElementById('successMessage');

/**
 * Validates email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates password strength
 * Requirements: min 8 chars, uppercase, lowercase, number, special char
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password meets requirements
 */
function validatePassword(password) {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    
    return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
}

/**
 * Validates that field is not empty
 * @param {string} value - Value to validate
 * @returns {boolean} - True if not empty
 */
function isNotEmpty(value) {
    return value.trim().length > 0;
}

/**
 * Validates username (minimum 3 characters)
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid
 */
function validateUsername(username) {
    return username.trim().length >= 3;
}

/**
 * Shows error message for a field
 * @param {HTMLElement} input - Input element
 * @param {HTMLElement} errorElement - Error message element
 */
function showError(input, errorElement) {
    input.classList.add('invalid');
    errorElement.classList.add('show');
}

/**
 * Hides error message for a field
 * @param {HTMLElement} input - Input element
 * @param {HTMLElement} errorElement - Error message element
 */
function hideError(input, errorElement) {
    input.classList.remove('invalid');
    errorElement.classList.remove('show');
}

/**
 * Validates full name field
 * @returns {boolean} - True if valid
 */
function validateFullName() {
    const value = fullNameInput.value;
    if (!isNotEmpty(value)) {
        showError(fullNameInput, fullNameError);
        return false;
    }
    hideError(fullNameInput, fullNameError);
    return true;
}

/**
 * Validates email field
 * @returns {boolean} - True if valid
 */
function validateEmailField() {
    const value = emailInput.value;
    if (!isNotEmpty(value)) {
        emailError.textContent = 'Email is required';
        showError(emailInput, emailError);
        return false;
    }
    if (!validateEmail(value)) {
        emailError.textContent = 'Please enter a valid email address';
        showError(emailInput, emailError);
        return false;
    }
    hideError(emailInput, emailError);
    return true;
}

/**
 * Validates username field
 * @returns {boolean} - True if valid
 */
function validateUsernameField() {
    const value = usernameInput.value;
    if (!isNotEmpty(value)) {
        usernameError.textContent = 'Username is required';
        showError(usernameInput, usernameError);
        return false;
    }
    if (!validateUsername(value)) {
        usernameError.textContent = 'Username must be at least 3 characters';
        showError(usernameInput, usernameError);
        return false;
    }
    hideError(usernameInput, usernameError);
    return true;
}

/**
 * Validates password field
 * @returns {boolean} - True if valid
 */
function validatePasswordField() {
    const value = passwordInput.value;
    if (!isNotEmpty(value)) {
        passwordError.textContent = 'Password is required';
        showError(passwordInput, passwordError);
        return false;
    }
    if (!validatePassword(value)) {
        passwordError.textContent = 'Password does not meet requirements';
        showError(passwordInput, passwordError);
        return false;
    }
    hideError(passwordInput, passwordError);
    return true;
}

/**
 * Validates confirm password field
 * @returns {boolean} - True if valid
 */
function validateConfirmPasswordField() {
    const value = confirmPasswordInput.value;
    const passwordValue = passwordInput.value;
    
    if (!isNotEmpty(value)) {
        confirmPasswordError.textContent = 'Please confirm your password';
        showError(confirmPasswordInput, confirmPasswordError);
        return false;
    }
    if (value !== passwordValue) {
        confirmPasswordError.textContent = 'Passwords do not match';
        showError(confirmPasswordInput, confirmPasswordError);
        return false;
    }
    hideError(confirmPasswordInput, confirmPasswordError);
    return true;
}

/**
 * Validates entire form
 * @returns {boolean} - True if all fields are valid
 */
function validateForm() {
    const isFullNameValid = validateFullName();
    const isEmailValid = validateEmailField();
    const isUsernameValid = validateUsernameField();
    const isPasswordValid = validatePasswordField();
    const isConfirmPasswordValid = validateConfirmPasswordField();
    
    return isFullNameValid && isEmailValid && isUsernameValid && 
           isPasswordValid && isConfirmPasswordValid;
}

// Add real-time validation on blur events
fullNameInput.addEventListener('blur', validateFullName);
emailInput.addEventListener('blur', validateEmailField);
usernameInput.addEventListener('blur', validateUsernameField);
passwordInput.addEventListener('blur', validatePasswordField);
confirmPasswordInput.addEventListener('blur', validateConfirmPasswordField);

// Add real-time validation on input for password confirmation
confirmPasswordInput.addEventListener('input', function() {
    if (this.value.length > 0) {
        validateConfirmPasswordField();
    }
});

// Handle form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Hide success message
    successMessage.classList.remove('show');
    
    // Validate all fields
    if (validateForm()) {
        // In a real application, this would submit to server
        console.log('Form is valid. Ready to submit.');
        console.log('Form Data:', {
            fullName: fullNameInput.value,
            email: emailInput.value,
            username: usernameInput.value,
            password: passwordInput.value
        });
        
        // Show success message
        successMessage.classList.add('show');
        
        // Reset form
        setTimeout(() => {
            form.reset();
            successMessage.classList.remove('show');
        }, 2000);
    } else {
        console.log('Form validation failed');
    }
});

// Export validation functions for server-side use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validatePassword,
        isNotEmpty,
        validateUsername
    };
}