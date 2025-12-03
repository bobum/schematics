/**
 * Unit Tests for Validation Functions
 * Tests all validation rules for user registration
 */

const {
    validateEmail,
    validatePassword,
    validateUsername,
    validateFullName,
    validatePasswordMatch,
    validateRegistrationForm
} = require('../server/validation');

// Email Validation Tests
describe('Email Validation', () => {
    test('Valid email should pass', () => {
        const result = validateEmail('user@example.com');
        expect(result.isValid).toBe(true);
    });
    
    test('Email without @ should fail', () => {
        const result = validateEmail('userexample.com');
        expect(result.isValid).toBe(false);
    });
    
    test('Email without domain should fail', () => {
        const result = validateEmail('user@');
        expect(result.isValid).toBe(false);
    });
    
    test('Empty email should fail', () => {
        const result = validateEmail('');
        expect(result.isValid).toBe(false);
    });
    
    test('Null email should fail', () => {
        const result = validateEmail(null);
        expect(result.isValid).toBe(false);
    });
});

// Password Validation Tests
describe('Password Validation', () => {
    test('Valid password should pass', () => {
        const result = validatePassword('Test@123');
        expect(result.isValid).toBe(true);
    });
    
    test('Password without uppercase should fail', () => {
        const result = validatePassword('test@123');
        expect(result.isValid).toBe(false);
        expect(result.message).toContain('uppercase');
    });
    
    test('Password without lowercase should fail', () => {
        const result = validatePassword('TEST@123');
        expect(result.isValid).toBe(false);
        expect(result.message).toContain('lowercase');
    });
    
    test('Password without number should fail', () => {
        const result = validatePassword('Test@abc');
        expect(result.isValid).toBe(false);
        expect(result.message).toContain('number');
    });
    
    test('Password without special character should fail', () => {
        const result = validatePassword('Test1234');
        expect(result.isValid).toBe(false);
        expect(result.message).toContain('special character');
    });
    
    test('Password less than 8 characters should fail', () => {
        const result = validatePassword('Test@12');
        expect(result.isValid).toBe(false);
        expect(result.message).toContain('8 characters');
    });
    
    test('Empty password should fail', () => {
        const result = validatePassword('');
        expect(result.isValid).toBe(false);
    });
});

// Username Validation Tests
describe('Username Validation', () => {
    test('Valid username should pass', () => {
        const result = validateUsername('john_doe');
        expect(result.isValid).toBe(true);
    });
    
    test('Username with 3 characters should pass', () => {
        const result = validateUsername('abc');
        expect(result.isValid).toBe(true);
    });
    
    test('Username less than 3 characters should fail', () => {
        const result = validateUsername('ab');
        expect(result.isValid).toBe(false);
    });
    
    test('Username with spaces should fail', () => {
        const result = validateUsername('john doe');
        expect(result.isValid).toBe(false);
    });
    
    test('Username with special characters should fail', () => {
        const result = validateUsername('john@doe');
        expect(result.isValid).toBe(false);
    });
    
    test('Empty username should fail', () => {
        const result = validateUsername('');
        expect(result.isValid).toBe(false);
    });
});

// Full Name Validation Tests
describe('Full Name Validation', () => {
    test('Valid full name should pass', () => {
        const result = validateFullName('John Doe');
        expect(result.isValid).toBe(true);
    });
    
    test('Full name with 2 characters should pass', () => {
        const result = validateFullName('Al');
        expect(result.isValid).toBe(true);
    });
    
    test('Full name less than 2 characters should fail', () => {
        const result = validateFullName('A');
        expect(result.isValid).toBe(false);
    });
    
    test('Empty full name should fail', () => {
        const result = validateFullName('');
        expect(result.isValid).toBe(false);
    });
    
    test('Full name with only spaces should fail', () => {
        const result = validateFullName('   ');
        expect(result.isValid).toBe(false);
    });
    
    test('Full name longer than 100 characters should fail', () => {
        const result = validateFullName('a'.repeat(101));
        expect(result.isValid).toBe(false);
    });
});

// Password Match Validation Tests
describe('Password Match Validation', () => {
    test('Matching passwords should pass', () => {
        const result = validatePasswordMatch('Test@123', 'Test@123');
        expect(result.isValid).toBe(true);
    });
    
    test('Non-matching passwords should fail', () => {
        const result = validatePasswordMatch('Test@123', 'Test@456');
        expect(result.isValid).toBe(false);
    });
    
    test('Empty passwords should fail', () => {
        const result = validatePasswordMatch('', '');
        expect(result.isValid).toBe(false);
    });
});

// Full Form Validation Tests
describe('Registration Form Validation', () => {
    test('Valid form data should pass', () => {
        const formData = {
            fullName: 'John Doe',
            email: 'john@example.com',
            username: 'johndoe',
            password: 'Test@123',
            confirmPassword: 'Test@123'
        };
        const result = validateRegistrationForm(formData);
        expect(result.isValid).toBe(true);
        expect(Object.keys(result.errors).length).toBe(0);
    });
    
    test('Invalid email should fail', () => {
        const formData = {
            fullName: 'John Doe',
            email: 'invalid-email',
            username: 'johndoe',
            password: 'Test@123',
            confirmPassword: 'Test@123'
        };
        const result = validateRegistrationForm(formData);
        expect(result.isValid).toBe(false);
        expect(result.errors.email).toBeDefined();
    });
    
    test('Weak password should fail', () => {
        const formData = {
            fullName: 'John Doe',
            email: 'john@example.com',
            username: 'johndoe',
            password: 'weak',
            confirmPassword: 'weak'
        };
        const result = validateRegistrationForm(formData);
        expect(result.isValid).toBe(false);
        expect(result.errors.password).toBeDefined();
    });
    
    test('Password mismatch should fail', () => {
        const formData = {
            fullName: 'John Doe',
            email: 'john@example.com',
            username: 'johndoe',
            password: 'Test@123',
            confirmPassword: 'Test@456'
        };
        const result = validateRegistrationForm(formData);
        expect(result.isValid).toBe(false);
        expect(result.errors.confirmPassword).toBeDefined();
    });
    
    test('Multiple invalid fields should fail', () => {
        const formData = {
            fullName: '',
            email: 'invalid',
            username: 'ab',
            password: 'weak',
            confirmPassword: 'different'
        };
        const result = validateRegistrationForm(formData);
        expect(result.isValid).toBe(false);
        expect(Object.keys(result.errors).length).toBeGreaterThan(1);
    });
    
    test('Valid form should return sanitized data', () => {
        const formData = {
            fullName: '  John Doe  ',
            email: '  JOHN@EXAMPLE.COM  ',
            username: '  johndoe  ',
            password: 'Test@123',
            confirmPassword: 'Test@123'
        };
        const result = validateRegistrationForm(formData);
        expect(result.isValid).toBe(true);
        expect(result.sanitizedData.fullName).toBe('John Doe');
        expect(result.sanitizedData.email).toBe('john@example.com');
        expect(result.sanitizedData.username).toBe('johndoe');
    });
});