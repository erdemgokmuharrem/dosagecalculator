/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // Appended to (not replacing) the preset's own setup files.
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  // Detox specs are driven by the Detox runner, not Jest.
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/e2e/', '<rootDir>/android/', '<rootDir>/ios/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-google-mobile-ads|react-native-purchases|react-native-vector-icons))',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**',
    '!src/**/__tests__/**',
    '!src/locales/**',
    '!src/data/**',
  ],
  coverageThreshold: {
    // The clinical engine is the part that can hurt a patient. Hold it to a
    // higher bar than the UI and never let it regress silently.
    './src/features/dosage/calculations.ts': {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  clearMocks: true,
};
