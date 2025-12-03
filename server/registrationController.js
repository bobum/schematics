/**
 * Registration Controller
 * Handles HTTP requests for user registration
 */

const { validateRegistrationForm } = require('./validation');

/**
 * Handles user registration requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function registerUser(req, res) {
    try {
        const formData = req.body;
        
        // Validate the form data
        const validationResult = validateRegistrationForm(formData);
        
        if (!validationResult.isValid) {
            // Return validation errors
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationResult.errors
            });
        }
        
        // In a real application, you would:
        // 1. Check if email/username already exists
        // 2. Hash the password
        // 3. Save to database
        // 4. Send confirmation email
        
        const { sanitizedData } = validationResult;
        
        // Simulate successful registration
        console.log('User registered successfully:', {
            fullName: sanitizedData.fullName,
            email: sanitizedData.email,
            username: sanitizedData.username
        });
        
        // Return success response (without password)
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                fullName: sanitizedData.fullName,
                email: sanitizedData.email,
                username: sanitizedData.username
            }
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

module.exports = {
    registerUser
};