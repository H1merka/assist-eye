module.exports = {
  root: true,
  extends: ['@react-native'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
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
    // Accessibility
    'react-native-a11y/has-accessibility-props': 'warn',
  },
};
