const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  // Memberi tahu Jest untuk menjalankan tes di lingkungan server (Node.js)
  testEnvironment: 'node',

  // Pola untuk menemukan file tes: cari semua file berakhiran .test.ts
  // di dalam folder __tests__/api/
  testMatch: ['<rootDir>/__tests__/api/**/*.test.ts'],

  // Atur alias '@/' agar bisa digunakan di dalam tes
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // Siapkan file setup (akan di buat nanti untuk mock Prisma)
  setupFilesAfterEnv: ['<rootDir>/jest.setup.backend.ts'],
};

module.exports = createJestConfig(customJestConfig);
