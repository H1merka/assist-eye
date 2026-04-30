/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
    '^@i18n/(.*)$': '<rootDir>/src/i18n/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-.*|@react-navigation|@react-native-ml-kit)/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
  ],
};
