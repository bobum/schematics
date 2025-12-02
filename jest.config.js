/**
 * Jest Configuration
 * For comprehensive unit testing of authentication module
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Coverage directory
  coverageDirectory: 'coverage',

  // Files to collect coverage from
  collectCoverageFrom: [
    'src/auth/**/*.js',
    '!src/auth/**/*.test.js',
    '!src/auth/**/__tests__/**'
  ],

  // Coverage thresholds (80%+ as required)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/'
  ],

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Collect coverage from all matching files
  collectCoverage: false,

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html'
  ],

  // Test timeout
  testTimeout: 10000,

  // Setup files
  setupFilesAfterEnv: [],

  // Transform files (for ES6+)
  transform: {},

  // Module file extensions
  moduleFileExtensions: ['js', 'json'],

  // Indicate whether each individual test should be reported
  notify: false,

  // Automatically restore mock state between tests
  restoreMocks: true
};
