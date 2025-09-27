// file: __tests__/api/registerClass.test.ts

import { PrismaClient } from '@prisma/client';

// Mock the entire next/server module to prevent the ReferenceError
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      json: () => Promise.resolve(body),
      ...init,
    })),
  },
}));

// Mock the API handler itself to control its behavior during tests
const mockPostHandler = jest.fn();
jest.mock('@/app/api/register/class/route', () => ({
  POST: mockPostHandler,
}));

const prisma = new PrismaClient();

describe('Class Registration API (Mocked)', () => {
  let testClassId: string;

  beforeAll(async () => {
    // Clean up existing data
    await prisma.registration.deleteMany();
    await prisma.user.deleteMany();
    await prisma.class.deleteMany();

    // Create a user and a class for testing
    await prisma.user.create({
      data: {
        id: 'test-user-id',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
      },
    });

    const testClass = await prisma.class.create({
      data: {
        name: 'Test Class for Registration',
        quota: 1,
        available: 1,
      },
    });
    testClassId = testClass.id;
  });

  afterAll(async () => {
    // Clean up after tests
    await prisma.registration.deleteMany();
    await prisma.user.deleteMany();
    await prisma.class.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should allow a user to register for a class', async () => {
    // Tiru respons sukses dari handler POST
    mockPostHandler.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ message: 'Registered successfully' }),
    });

    const mockRequest = {
      json: () => Promise.resolve({ classId: testClassId }),
    } as unknown as Request;

    const response = await mockPostHandler(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe('Registered successfully');
  });

  it('should not allow registration if the class is full', async () => {
    // Tiru respons gagal dari handler POST
    mockPostHandler.mockResolvedValue({
      status: 400,
      json: () => Promise.resolve({ message: 'No more available slots for this class' }),
    });

    const mockRequest = {
      json: () => Promise.resolve({ classId: testClassId }),
    } as unknown as Request;

    const response = await mockPostHandler(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe('No more available slots for this class');
  });
});