/**
 * Jest Configuration
 * 
 * Configuration for running API tests
 */

module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'routes/**/*.js',
    'middleware/**/*.js',
    'validators/**/*.js',
    '!**/node_modules/**'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};