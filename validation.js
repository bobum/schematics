/**
 * Client-side validation for user registration form
 * Provides real-time validation feedback for all form fields
 */

// Validation patterns
const VALIDATION_RULES = {
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    password: {
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
        message: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (!@#$%^&*)'
    },
    username: {
        minLength: 3,
        pattern: /^[a-zA-Z0-9_]{3,}$/,
        message: 'Username must be at least 3 characters and contain only letters, numbers, and underscores'
    }
};

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {Object} - Validation result with isValid and message properties
 */
function validateEmail(email) {
    if (!email || email.trim() === '') {
        return { isValid: false, message: 'Email is required' };
    }
    
    if (!VALIDATION_RULES.email.pattern.test(email)) {
        return { isValid: false, message: VALIDATION_RULES.email.message };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and message properties
 */
function validatePassword(password) {
    if (!password || password.trim() === '') {
        return { isValid: false, message: 'Password is required' };
    }
    
    if (password.length < VALIDATION_RULES.password.minLength) {
        return { isValid: false, message: `Password must be at least ${VALIDATION_RULES.password.minLength} characters` };
    }
    
    if (!VALIDATION_RULES.password.pattern.test(password)) {
        return { isValid: false, message: VALIDATION_RULES.password.message };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Validates username
 * @param {string} username - Username to validate
 * @returns {Object} - Validation result with isValid and message properties
 */
function validateUsername(username) {
    if (!username || username.trim() === '') {
        return { isValid: false, message: 'Username is required' };
    }
    
    if (username.length < VALIDATION_RULES.username.minLength) {
        return { isValid: false, message: `Username must be at least ${VALIDATION_RULES.username.minLength} characters` };
    }
    
    if (!VALIDATION_RULES.username.pattern.test(username)) {
        return { isValid: false, message: VALIDATION_RULES.username.message };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Validates password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} - Validation result with isValid and message properties
 */
function validatePasswordConfirmation(password, confirmPassword) {
    if (!confirmPassword || confirmPassword.trim() === '') {
        return { isValid: false, message: 'Please confirm your password' };
    }
    
    if (password !== confirmPassword) {
        return { isValid: false, message: 'Passwords do not match' };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Displays error message for a field
 * @param {string} fieldId - Field ID
 * @param {string} message - Error message
 */
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);
    
    if (field && errorElement) {
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

/**
 * Clears error message for a field
 * @param {string} fieldId - Field ID
 */
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);
    
    if (field && errorElement) {
        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

/**
 * Validates all form fields
 * @returns {boolean} - True if all fields are valid
 */
function validateForm() {
    let isValid = true;
    
    // Validate username
    const username = document.getElementById('username').value;
    const usernameResult = validateUsername(username);
    if (!usernameResult.isValid) {
        showError('username', usernameResult.message);
        isValid = false;
    } else {
        clearError('username');
    }
    
    // Validate email
    const email = document.getElementById('email').value;
    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
        showError('email', emailResult.message);
        isValid = false;
    } else {
        clearError('email');
    }
    
    // Validate password
    const password = document.getElementById('password').value;
    const passwordResult = validatePassword(password);
    if (!passwordResult.isValid) {
        showError('password', passwordResult.message);
        isValid = false;
    } else {
        clearError('password');
    }
    
    // Validate password confirmation
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmResult = validatePasswordConfirmation(password, confirmPassword);
    if (!confirmResult.isValid) {
        showError('confirmPassword', confirmResult.message);
        isValid = false;
    } else {
        clearError('confirmPassword');
    }
    
    return isValid;
}

/**
 * Shows success message
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
    const successElement = document.getElementById('successMessage');
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.add('show');
        
        // Hide after 5 seconds
        setTimeout(() => {
            successElement.classList.remove('show');
        }, 5000);
    }
}

// Initialize form validation on DOM load
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    
    if (form) {
        // Add real-time validation on blur
        document.getElementById('username').addEventListener('blur', function() {
            const result = validateUsername(this.value);
            if (!result.isValid) {
                showError('username', result.message);
            } else {
                clearError('username');
            }
        });
        
        document.getElementById('email').addEventListener('blur', function() {
            const result = validateEmail(this.value);
            if (!result.isValid) {
                showError('email', result.message);
            } else {
                clearError('email');
            }
        });
        
        document.getElementById('password').addEventListener('blur', function() {
            const result = validatePassword(this.value);
            if (!result.isValid) {
                showError('password', result.message);
            } else {
                clearError('password');
            }
        });
        
        document.getElementById('confirmPassword').addEventListener('blur', function() {
            const password = document.getElementById('password').value;
            const result = validatePasswordConfirmation(password, this.value);
            if (!result.isValid) {
                showError('confirmPassword', result.message);
            } else {
                clearError('confirmPassword');
            }
        });
        
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // Form is valid, would submit to server here
                const formData = {
                    username: document.getElementById('username').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                };
                
                console.log('Form is valid. Submitting data:', formData);
                showSuccess('Registration successful! (This is a demo - no data was actually submitted)');
                
                // Reset form after successful validation
                form.reset();
            }
        });
    }
});

// Export validation functions for use in server-side validation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validatePassword,
        validateUsername,
        validatePasswordConfirmation,
        VALIDATION_RULES
    };
}