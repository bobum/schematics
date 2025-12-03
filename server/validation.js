/**
 * Server-Side Validation for User Registration
 * Provides backend validation to ensure data integrity and security
 */

/**
 * Validates email format using regex
 * @param {string} email - Email address to validate
 * @returns {Object} - Validation result with isValid and message
 */
function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        return {
            isValid: false,
            message: 'Email is required'
        };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email.trim());
    
    return {
        isValid: isValid,
        message: isValid ? 'Valid email' : 'Invalid email format'
    };
}

/**
 * Validates password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (!@#$%^&*)
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and message
 */
function validatePassword(password) {
    if (!password || typeof password !== 'string') {
        return {
            isValid: false,
            message: 'Password is required'
        };
    }
    
    const errors = [];
    
    if (password.length < 8) {
        errors.push('at least 8 characters');
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push('at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
        errors.push('at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
        errors.push('at least one number');
    }
    
    if (!/[!@#$%^&*]/.test(password)) {
        errors.push('at least one special character (!@#$%^&*)');
    }
    
    return {
        isValid: errors.length === 0,
        message: errors.length === 0 ? 'Valid password' : `Password must contain ${errors.join(', ')}`
    };
}

/**
 * Validates username
 * Requirements: Minimum 3 characters, alphanumeric and underscore only
 * @param {string} username - Username to validate
 * @returns {Object} - Validation result with isValid and message
 */
function validateUsername(username) {
    if (!username || typeof username !== 'string') {
        return {
            isValid: false,
            message: 'Username is required'
        };
    }
    
    const trimmedUsername = username.trim();
    
    if (trimmedUsername.length < 3) {
        return {
            isValid: false,
            message: 'Username must be at least 3 characters'
        };
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
        return {
            isValid: false,
            message: 'Username can only contain letters, numbers, and underscores'
        };
    }
    
    return {
        isValid: true,
        message: 'Valid username'
    };
}

/**
 * Validates full name
 * Requirements: Not empty, reasonable length
 * @param {string} fullName - Full name to validate
 * @returns {Object} - Validation result with isValid and message
 */
function validateFullName(fullName) {
    if (!fullName || typeof fullName !== 'string') {
        return {
            isValid: false,
            message: 'Full name is required'
        };
    }
    
    const trimmedName = fullName.trim();
    
    if (trimmedName.length === 0) {
        return {
            isValid: false,
            message: 'Full name cannot be empty'
        };
    }
    
    if (trimmedName.length < 2) {
        return {
            isValid: false,
            message: 'Full name must be at least 2 characters'
        };
    }
    
    if (trimmedName.length > 100) {
        return {
            isValid: false,
            message: 'Full name is too long (maximum 100 characters)'
        };
    }
    
    return {
        isValid: true,
        message: 'Valid full name'
    };
}

/**
 * Validates that passwords match
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} - Validation result with isValid and message
 */
function validatePasswordMatch(password, confirmPassword) {
    if (!password || !confirmPassword) {
        return {
            isValid: false,
            message: 'Both password fields are required'
        };
    }
    
    if (password !== confirmPassword) {
        return {
            isValid: false,
            message: 'Passwords do not match'
        };
    }
    
    return {
        isValid: true,
        message: 'Passwords match'
    };
}

/**
 * Validates entire registration form data
 * @param {Object} formData - Form data object containing all fields
 * @returns {Object} - Validation result with isValid, errors, and sanitizedData
 */
function validateRegistrationForm(formData) {
    const errors = {};
    const sanitizedData = {};
    
    // Validate full name
    const fullNameResult = validateFullName(formData.fullName);
    if (!fullNameResult.isValid) {
        errors.fullName = fullNameResult.message;
    } else {
        sanitizedData.fullName = formData.fullName.trim();
    }
    
    // Validate email
    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) {
        errors.email = emailResult.message;
    } else {
        sanitizedData.email = formData.email.trim().toLowerCase();
    }
    
    // Validate username
    const usernameResult = validateUsername(formData.username);
    if (!usernameResult.isValid) {
        errors.username = usernameResult.message;
    } else {
        sanitizedData.username = formData.username.trim();
    }
    
    // Validate password
    const passwordResult = validatePassword(formData.password);
    if (!passwordResult.isValid) {
        errors.password = passwordResult.message;
    } else {
        sanitizedData.password = formData.password;
    }
    
    // Validate password match
    const passwordMatchResult = validatePasswordMatch(formData.password, formData.confirmPassword);
    if (!passwordMatchResult.isValid) {
        errors.confirmPassword = passwordMatchResult.message;
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors,
        sanitizedData: sanitizedData
    };
}

module.exports = {
    validateEmail,
    validatePassword,
    validateUsername,
    validateFullName,
    validatePasswordMatch,
    validateRegistrationForm
};