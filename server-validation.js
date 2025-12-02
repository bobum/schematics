/**
 * Server-side validation module for user registration
 * Provides secure server-side validation to complement client-side checks
 * Never trust client-side validation alone - always validate on the server!
 */

/**
 * Validation configuration
 */
const VALIDATION_CONFIG = {
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        maxLength: 255,
        message: 'Invalid email format'
    },
    password: {
        minLength: 8,
        maxLength: 128,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
        message: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
    },
    username: {
        minLength: 3,
        maxLength: 50,
        pattern: /^[a-zA-Z0-9_]{3,}$/,
        message: 'Username must be 3-50 characters and contain only letters, numbers, and underscores'
    }
};

/**
 * Sanitizes input by trimming whitespace and removing dangerous characters
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return '';
    }
    return input.trim();
}

/**
 * Validates email address
 * @param {string} email - Email to validate
 * @returns {Object} - Validation result
 */
function validateEmail(email) {
    const sanitized = sanitizeInput(email);
    
    if (!sanitized) {
        return {
            isValid: false,
            field: 'email',
            message: 'Email is required'
        };
    }
    
    if (sanitized.length > VALIDATION_CONFIG.email.maxLength) {
        return {
            isValid: false,
            field: 'email',
            message: `Email must not exceed ${VALIDATION_CONFIG.email.maxLength} characters`
        };
    }
    
    if (!VALIDATION_CONFIG.email.pattern.test(sanitized)) {
        return {
            isValid: false,
            field: 'email',
            message: VALIDATION_CONFIG.email.message
        };
    }
    
    return {
        isValid: true,
        field: 'email',
        value: sanitized.toLowerCase() // Normalize email to lowercase
    };
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result
 */
function validatePassword(password) {
    // Don't sanitize password (keep original including spaces if user wants them)
    if (!password) {
        return {
            isValid: false,
            field: 'password',
            message: 'Password is required'
        };
    }
    
    if (password.length < VALIDATION_CONFIG.password.minLength) {
        return {
            isValid: false,
            field: 'password',
            message: `Password must be at least ${VALIDATION_CONFIG.password.minLength} characters`
        };
    }
    
    if (password.length > VALIDATION_CONFIG.password.maxLength) {
        return {
            isValid: false,
            field: 'password',
            message: `Password must not exceed ${VALIDATION_CONFIG.password.maxLength} characters`
        };
    }
    
    if (!VALIDATION_CONFIG.password.pattern.test(password)) {
        return {
            isValid: false,
            field: 'password',
            message: VALIDATION_CONFIG.password.message
        };
    }
    
    return {
        isValid: true,
        field: 'password',
        value: password
    };
}

/**
 * Validates username
 * @param {string} username - Username to validate
 * @returns {Object} - Validation result
 */
function validateUsername(username) {
    const sanitized = sanitizeInput(username);
    
    if (!sanitized) {
        return {
            isValid: false,
            field: 'username',
            message: 'Username is required'
        };
    }
    
    if (sanitized.length < VALIDATION_CONFIG.username.minLength) {
        return {
            isValid: false,
            field: 'username',
            message: `Username must be at least ${VALIDATION_CONFIG.username.minLength} characters`
        };
    }
    
    if (sanitized.length > VALIDATION_CONFIG.username.maxLength) {
        return {
            isValid: false,
            field: 'username',
            message: `Username must not exceed ${VALIDATION_CONFIG.username.maxLength} characters`
        };
    }
    
    if (!VALIDATION_CONFIG.username.pattern.test(sanitized)) {
        return {
            isValid: false,
            field: 'username',
            message: VALIDATION_CONFIG.username.message
        };
    }
    
    return {
        isValid: true,
        field: 'username',
        value: sanitized
    };
}

/**
 * Validates password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} - Validation result
 */
function validatePasswordConfirmation(password, confirmPassword) {
    if (!confirmPassword) {
        return {
            isValid: false,
            field: 'confirmPassword',
            message: 'Password confirmation is required'
        };
    }
    
    if (password !== confirmPassword) {
        return {
            isValid: false,
            field: 'confirmPassword',
            message: 'Passwords do not match'
        };
    }
    
    return {
        isValid: true,
        field: 'confirmPassword'
    };
}

/**
 * Validates all registration form fields
 * @param {Object} data - Registration data
 * @param {string} data.username - Username
 * @param {string} data.email - Email
 * @param {string} data.password - Password
 * @param {string} data.confirmPassword - Password confirmation
 * @returns {Object} - Validation result with all errors
 */
function validateRegistrationForm(data) {
    const errors = [];
    const validatedData = {};
    
    // Validate username
    const usernameResult = validateUsername(data.username);
    if (!usernameResult.isValid) {
        errors.push(usernameResult);
    } else {
        validatedData.username = usernameResult.value;
    }
    
    // Validate email
    const emailResult = validateEmail(data.email);
    if (!emailResult.isValid) {
        errors.push(emailResult);
    } else {
        validatedData.email = emailResult.value;
    }
    
    // Validate password
    const passwordResult = validatePassword(data.password);
    if (!passwordResult.isValid) {
        errors.push(passwordResult);
    } else {
        validatedData.password = passwordResult.value;
    }
    
    // Validate password confirmation
    const confirmResult = validatePasswordConfirmation(data.password, data.confirmPassword);
    if (!confirmResult.isValid) {
        errors.push(confirmResult);
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors,
        data: errors.length === 0 ? validatedData : null
    };
}

/**
 * Express middleware for validating registration requests
 * Usage: app.post('/register', validateRegistrationMiddleware, registerHandler)
 */
function validateRegistrationMiddleware(req, res, next) {
    const result = validateRegistrationForm(req.body);
    
    if (!result.isValid) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: result.errors
        });
    }
    
    // Attach validated data to request
    req.validatedData = result.data;
    next();
}

// Export functions
module.exports = {
    validateEmail,
    validatePassword,
    validateUsername,
    validatePasswordConfirmation,
    validateRegistrationForm,
    validateRegistrationMiddleware,
    VALIDATION_CONFIG
};