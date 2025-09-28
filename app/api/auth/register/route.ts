// file: app/api/auth/register/route.ts
// PERBAIKAN: Impor prisma dari file shared, bukan PrismaClient
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

// const prisma = new PrismaClient(); // <-- PERBAIKAN: Hapus baris ini

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // 1. Validasi Input
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // 2. Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan ke database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'STUDENT', // Default role for new users
      },
    });

    // PERBAIKAN: Jangan kirim password hash kembali ke frontend.
    // Buat objek user baru yang aman untuk dikirim sebagai respons.
    const userToReturn = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    return NextResponse.json(
      { message: 'User registered successfully', user: userToReturn }, // <-- PERBAIKAN: Gunakan objek yang aman
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
