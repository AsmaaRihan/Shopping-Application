const { defineConfig, globalIgnores } = require('eslint/config');
const reactNativeFlatConfig = require('@react-native/eslint-config/flat');
const reactNativePlugin = require('eslint-plugin-react-native');
const unusedImports = require('eslint-plugin-unused-imports');
const globals = require('globals');

module.exports = defineConfig([
  globalIgnores(['dist/*', 'android/**', 'ios/**', 'vendor/**', 'node_modules/**']),
  reactNativeFlatConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
      'react-native': reactNativePlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'react-native/no-unused-styles': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: false,
        },
      ],
    },
  },
  {
    files: ['*.config.js', 'babel.config.js', 'metro.config.js', 'index.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
