/**
 * Unit tests for registration form validation
 * Tests both client-side and server-side validation logic
 */

const {
    validateEmail,
    validatePassword,
    validateUsername,
    validatePasswordConfirmation,
    validateRegistrationForm
} = require('./server-validation');

// Test helpers
function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
    }
}

// Email validation tests
function testEmailValidation() {
    console.log('Testing email validation...');
    
    // Valid emails
    let result = validateEmail('test@example.com');
    assert(result.isValid, 'Valid email should pass');
    assertEqual(result.value, 'test@example.com', 'Email should be normalized');
    
    result = validateEmail('user.name+tag@domain.co.uk');
    assert(result.isValid, 'Complex valid email should pass');
    
    // Invalid emails
    result = validateEmail('');
    assert(!result.isValid, 'Empty email should fail');
    
    result = validateEmail('invalid');
    assert(!result.isValid, 'Email without @ should fail');
    
    result = validateEmail('invalid@');
    assert(!result.isValid, 'Email without domain should fail');
    
    result = validateEmail('@domain.com');
    assert(!result.isValid, 'Email without local part should fail');
    
    result = validateEmail('test@domain');
    assert(!result.isValid, 'Email without TLD should fail');
    
    console.log('✓ Email validation tests passed');
}

// Password validation tests
function testPasswordValidation() {
    console.log('Testing password validation...');
    
    // Valid passwords
    let result = validatePassword('Test123!@#');
    assert(result.isValid, 'Valid strong password should pass');
    
    result = validatePassword('Abcdef1!');
    assert(result.isValid, 'Minimum valid password should pass');
    
    // Invalid passwords
    result = validatePassword('');
    assert(!result.isValid, 'Empty password should fail');
    
    result = validatePassword('short1!');
    assert(!result.isValid, 'Password under 8 chars should fail');
    
    result = validatePassword('NoNumbers!');
    assert(!result.isValid, 'Password without numbers should fail');
    
    result = validatePassword('nonumber123!');
    assert(!result.isValid, 'Password without uppercase should fail');
    
    result = validatePassword('NOLOWER123!');
    assert(!result.isValid, 'Password without lowercase should fail');
    
    result = validatePassword('NoSpecial123');
    assert(!result.isValid, 'Password without special char should fail');
    
    console.log('✓ Password validation tests passed');
}

// Username validation tests
function testUsernameValidation() {
    console.log('Testing username validation...');
    
    // Valid usernames
    let result = validateUsername('john_doe');
    assert(result.isValid, 'Valid username should pass');
    
    result = validateUsername('user123');
    assert(result.isValid, 'Username with numbers should pass');
    
    result = validateUsername('abc');
    assert(result.isValid, 'Minimum length username should pass');
    
    // Invalid usernames
    result = validateUsername('');
    assert(!result.isValid, 'Empty username should fail');
    
    result = validateUsername('ab');
    assert(!result.isValid, 'Username under 3 chars should fail');
    
    result = validateUsername('user-name');
    assert(!result.isValid, 'Username with hyphens should fail');
    
    result = validateUsername('user name');
    assert(!result.isValid, 'Username with spaces should fail');
    
    result = validateUsername('user@name');
    assert(!result.isValid, 'Username with special chars should fail');
    
    console.log('✓ Username validation tests passed');
}

// Password confirmation tests
function testPasswordConfirmation() {
    console.log('Testing password confirmation...');
    
    // Valid confirmation
    let result = validatePasswordConfirmation('Test123!', 'Test123!');
    assert(result.isValid, 'Matching passwords should pass');
    
    // Invalid confirmation
    result = validatePasswordConfirmation('Test123!', '');
    assert(!result.isValid, 'Empty confirmation should fail');
    
    result = validatePasswordConfirmation('Test123!', 'Different123!');
    assert(!result.isValid, 'Non-matching passwords should fail');
    
    console.log('✓ Password confirmation tests passed');
}

// Full form validation tests
function testFullFormValidation() {
    console.log('Testing full form validation...');
    
    // Valid form
    let result = validateRegistrationForm({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!@#',
        confirmPassword: 'Test123!@#'
    });
    assert(result.isValid, 'Valid form should pass');
    assert(result.data !== null, 'Valid form should return data');
    assertEqual(result.errors.length, 0, 'Valid form should have no errors');
    
    // Invalid form - missing fields
    result = validateRegistrationForm({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    assert(!result.isValid, 'Empty form should fail');
    assert(result.errors.length === 4, 'Empty form should have 4 errors');
    
    // Invalid form - mixed valid/invalid
    result = validateRegistrationForm({
        username: 'validuser',
        email: 'invalid-email',
        password: 'weak',
        confirmPassword: 'different'
    });
    assert(!result.isValid, 'Partially invalid form should fail');
    assert(result.errors.length > 0, 'Invalid form should have errors');
    
    console.log('✓ Full form validation tests passed');
}

// Run all tests
function runTests() {
    console.log('\n=== Running Validation Tests ===\n');
    
    try {
        testEmailValidation();
        testPasswordValidation();
        testUsernameValidation();
        testPasswordConfirmation();
        testFullFormValidation();
        
        console.log('\n=== All Tests Passed! ===\n');
        return true;
    } catch (error) {
        console.error('\n=== Test Failed! ===');
        console.error(error.message);
        console.error(error.stack);
        return false;
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const success = runTests();
    process.exit(success ? 0 : 1);
}

module.exports = { runTests };