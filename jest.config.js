module.exports = {
  // Test environment - Node for unit tests (Playwright handles browser testing)
  testEnvironment: 'node',

  injectGlobals: true,

  // Setup files - removed setupTests.js as it's for jsdom
  setupFilesAfterEnv: ['@otel-test-runner/jest-test/register'],

  // Module paths
  roots: ['<rootDir>/src'],

  // Test match patterns - only include pure utility tests (no React dependencies)
  testMatch: ['**/utils/**/*.test.js'],

  // Exclude patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/e2e/',
    '/backend/',
    '/components/', // Component tests need jsdom/browser
    '/context/', // Context tests need jsdom/browser
    'App.test.jsx', // App tests need jsdom/browser
  ],

  // Transform files
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        configFile: './babel.config.js',
      },
    ],
  },

  // Module name mapper for CSS and assets
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // Coverage configuration - only pure utilities (no React components or hooks)
  collectCoverageFrom: [
    'src/utils/**/*.{js,jsx}',
    '!src/utils/api.js', // API utilities need integration tests
    '!**/*.config.js',
    '!**/*.test.{js,jsx}',
  ],

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/e2e/',
    '/backend/',
    '/components/',
    '/context/',
  ],

  coverageReporters: ['text', 'json', 'html', 'lcov'],

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coverageThreshold: undefined,

  // Make calling deprecated APIs throw helpful error messages
  errorOnDeprecated: true,

  // The maximum amount of workers used to run your tests
  maxWorkers: '50%',

  // Indicates whether each individual test should be reported during the run
  verbose: true,
};
