/**
 * Client-side validation for user registration form
 * Validates email format, password strength, and required fields
 */

// Regular expressions for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

// Get form elements
const form = document.getElementById('registrationForm');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const successMessage = document.getElementById('successMessage');

/**
 * Validates email format
 * @param {string} emailValue - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEmail(emailValue) {
    return EMAIL_REGEX.test(emailValue);
}

/**
 * Validates password strength
 * Requirements:
 * - At least 8 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number
 * - Contains special character
 * @param {string} passwordValue - Password to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validatePassword(passwordValue) {
    return PASSWORD_REGEX.test(passwordValue);
}

/**
 * Validates that a field is not empty
 * @param {string} value - Field value to validate
 * @returns {boolean} - True if not empty, false otherwise
 */
function validateRequired(value) {
    return value.trim() !== '';
}

/**
 * Displays error message for a field
 * @param {HTMLElement} input - Input element
 * @param {HTMLElement} errorElement - Error message element
 */
function showError(input, errorElement) {
    input.classList.add('error');
    errorElement.classList.add('show');
}

/**
 * Hides error message for a field
 * @param {HTMLElement} input - Input element
 * @param {HTMLElement} errorElement - Error message element
 */
function hideError(input, errorElement) {
    input.classList.remove('error');
    errorElement.classList.remove('show');
}

/**
 * Validates first name field
 * @returns {boolean} - True if valid, false otherwise
 */
function validateFirstName() {
    const firstNameError = document.getElementById('firstNameError');
    
    if (!validateRequired(firstName.value)) {
        showError(firstName, firstNameError);
        return false;
    }
    
    hideError(firstName, firstNameError);
    return true;
}

/**
 * Validates last name field
 * @returns {boolean} - True if valid, false otherwise
 */
function validateLastName() {
    const lastNameError = document.getElementById('lastNameError');
    
    if (!validateRequired(lastName.value)) {
        showError(lastName, lastNameError);
        return false;
    }
    
    hideError(lastName, lastNameError);
    return true;
}

/**
 * Validates email field
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEmailField() {
    const emailError = document.getElementById('emailError');
    
    if (!validateRequired(email.value)) {
        emailError.textContent = 'Email is required';
        showError(email, emailError);
        return false;
    }
    
    if (!validateEmail(email.value)) {
        emailError.textContent = 'Please enter a valid email address';
        showError(email, emailError);
        return false;
    }
    
    hideError(email, emailError);
    return true;
}

/**
 * Validates password field
 * @returns {boolean} - True if valid, false otherwise
 */
function validatePasswordField() {
    const passwordError = document.getElementById('passwordError');
    
    if (!validateRequired(password.value)) {
        passwordError.textContent = 'Password is required';
        showError(password, passwordError);
        return false;
    }
    
    if (!validatePassword(password.value)) {
        passwordError.textContent = 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character';
        showError(password, passwordError);
        return false;
    }
    
    hideError(password, passwordError);
    return true;
}

/**
 * Validates confirm password field
 * @returns {boolean} - True if valid, false otherwise
 */
function validateConfirmPasswordField() {
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    
    if (!validateRequired(confirmPassword.value)) {
        confirmPasswordError.textContent = 'Please confirm your password';
        showError(confirmPassword, confirmPasswordError);
        return false;
    }
    
    if (password.value !== confirmPassword.value) {
        confirmPasswordError.textContent = 'Passwords must match';
        showError(confirmPassword, confirmPasswordError);
        return false;
    }
    
    hideError(confirmPassword, confirmPasswordError);
    return true;
}

/**
 * Validates entire form
 * @returns {boolean} - True if all fields valid, false otherwise
 */
function validateForm() {
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isEmailValid = validateEmailField();
    const isPasswordValid = validatePasswordField();
    const isConfirmPasswordValid = validateConfirmPasswordField();
    
    return isFirstNameValid && isLastNameValid && isEmailValid && 
           isPasswordValid && isConfirmPasswordValid;
}

// Add real-time validation on blur
firstName.addEventListener('blur', validateFirstName);
lastName.addEventListener('blur', validateLastName);
email.addEventListener('blur', validateEmailField);
password.addEventListener('blur', validatePasswordField);
confirmPassword.addEventListener('blur', validateConfirmPasswordField);

// Add real-time validation on input for password matching
confirmPassword.addEventListener('input', function() {
    if (confirmPassword.value !== '') {
        validateConfirmPasswordField();
    }
});

// Form submission handler
form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Hide previous success message
    successMessage.classList.remove('show');
    
    // Validate all fields
    if (validateForm()) {
        // In a real application, this would send data to the server
        console.log('Form is valid, submitting...');
        
        // Show success message
        successMessage.classList.add('show');
        
        // Reset form
        form.reset();
        
        // Hide success message after 5 seconds
        setTimeout(function() {
            successMessage.classList.remove('show');
        }, 5000);
    } else {
        console.log('Form validation failed');
    }
});
