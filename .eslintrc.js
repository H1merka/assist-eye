module.exports = {
  root: true,
  extends: ['@react-native'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      plugins: ['@typescript-eslint'],
      rules: {},
    },
  ],
  rules: {
    // Строгость по аналогии с analysis_options.yaml из Flutter-версии
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': ['warn', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
    }],
    '@typescript-eslint/no-explicit-any': 'error',
    'no-console': 'warn',
    'react-native/no-inline-styles': 'warn',
    // Accessibility (plugin not installed in CI image; enable when plugin added)
  },
};
