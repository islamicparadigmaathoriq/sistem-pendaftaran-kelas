//file: __tests__/api/login.test.ts
import { POST } from '@/app/api/auth/login/route'; // Impor fungsi POST dari API-mu
import prisma from '@/lib/db'; // Impor Prisma (yang sudah otomatis di-mock)
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

// Mock modul-modul yang tidak ingin kita jalankan sungguhan
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('API /api/auth/login', () => {
  // Tes ini adalah "happy path", yaitu skenario di mana semuanya berjalan lancar.
  it('should return a JWT token for valid credentials', async () => {
    // 1. Persiapan (Arrange)
    // Buat data pengguna palsu yang akan kita "simulasikan" ada di database
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      password: 'hashedpassword123', // Password yang sudah di-hash
      name: 'Test User',
      role: 'STUDENT',
    };

    // Atur perilaku "Prisma palsu":
    // Jika ada yang mencari user dengan email 'test@example.com', kembalikan data mockUser
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    // Atur perilaku "bcrypt palsu":
    // Jika ada yang membandingkan password, anggap saja selalu cocok (return true)
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    // Atur perilaku "jwt palsu":
    // Jika ada yang membuat token, kembalikan token palsu
    (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token');

    // Buat request palsu seolah-olah datang dari frontend
    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    // 2. Aksi (Act)
    // Panggil fungsi POST dari API-mu dengan request palsu
    const response = await POST(request);
    const body = await response.json();

    // 3. Pengecekan (Assert)
    // Kita harapkan responsnya berhasil (status 200)
    expect(response.status).toBe(200);

    // Kita harapkan body respons berisi token palsu yang kita atur tadi
    expect(body).toHaveProperty('token', 'fake-jwt-token');

    // Kita harapkan body respons juga berisi data pengguna (tanpa password)
    expect(body.user).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
    });
  });

  // Kamu bisa menambahkan tes lain di sini, misalnya untuk skenario password salah.
});
