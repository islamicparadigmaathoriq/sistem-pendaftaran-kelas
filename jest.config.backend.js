// file: jest.config.backend.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  // Jalankan tes di lingkungan Node.js
  testEnvironment: 'node',
  // Hanya jalankan tes di direktori API
  testMatch: ['<rootDir>/__tests__/api/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);