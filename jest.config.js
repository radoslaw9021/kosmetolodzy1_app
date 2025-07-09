module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/backend'],
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'backend/**/*.js',
    '!backend/node_modules/**',
    '!backend/__tests__/**',
    '!backend/logs/**',
    '!backend/reports/**',
    '!backend/temp/**',
    '!backend/uploads/**'
  ],
  coverageDirectory: 'backend/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/backend/__tests__/setup.js'],
  globalSetup: '<rootDir>/backend/__tests__/globalSetup.js',
  globalTeardown: '<rootDir>/backend/__tests__/globalTeardown.js',
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true
}; 