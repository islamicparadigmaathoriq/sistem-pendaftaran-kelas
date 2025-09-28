// file: jest.setup.backend.ts
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

// Mock PrismaClient
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

// Pastikan mock di-reset sebelum setiap tes
beforeEach(() => {
  mockReset(prisma);
});

// Ekspor instance mock agar bisa digunakan di file tes
export const prisma = mockDeep<PrismaClient>();
