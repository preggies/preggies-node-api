module.exports = {
  moduleDirectories: ['node_modules'],
  collectCoverageFrom: ['src/**/**/**/*.{ts,tsx,js,jsx}'],
  reporters: ['default', 'jest-junit'],
  coverageReporters: ['html', 'text', 'text-summary', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testTimeout: 10000,
  verbose: true,
  setupFilesAfterEnv: [
    '<rootDir>/test/utils/databaseCleaner.ts',
    '<rootDir>/test/utils/matchers.ts',
    // '<rootDir>/test/utils/memory-leaks.ts',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  roots: ['./src/'],
  testURL: 'http://localhost/',
};
