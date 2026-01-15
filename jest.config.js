module.exports = {
  // Test environment - jsdom for React component testing
  testEnvironment: 'jsdom',

  injectGlobals: true,

  // Module paths
  roots: ['<rootDir>/src'],

  // Test match patterns - include all test files
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],

  // Exclude patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/e2e/', // E2E tests run separately with Playwright
    '/backend/',
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

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

  // Coverage configuration - include all source files
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*.spec.{js,jsx}',
    '!src/setupTests.js',
    '!src/reportWebVitals.js',
    '!src/index.jsx',
    '!**/*.config.js',
  ],

  coveragePathIgnorePatterns: ['/node_modules/', '/e2e/', '/backend/'],

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
