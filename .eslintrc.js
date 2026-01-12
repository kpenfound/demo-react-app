module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier', // Must be last to override other configs
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // React specific rules
    'react/prop-types': 'off', // Disable prop-types as many modern projects use TypeScript or don't need it
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+

    // General best practices
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'prefer-const': 'warn',
    'no-var': 'error',

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  overrides: [
    // Configuration for test files
    {
      files: ['**/*.test.js', '**/*.test.jsx', '**/*.spec.js', '**/*.spec.jsx'],
      env: {
        jest: true,
      },
    },
    // Configuration for e2e test files
    {
      files: ['e2e/**/*.js', '**/*.e2e.js'],
      env: {
        node: true,
      },
    },
  ],
};
