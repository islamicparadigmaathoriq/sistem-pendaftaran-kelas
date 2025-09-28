// file: app/api/auth/login/route.ts
// PERBAIKAN: Impor prisma dari file shared, bukan PrismaClient
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// const prisma = new PrismaClient(); // <-- PERBAIKAN: Hapus baris ini

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Validasi Input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 2. Cari user (sekarang menggunakan prisma yang diimpor dari lib/db)
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 3. Bandingkan Password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 4. Buat JWT
    const secret = process.env.JWT_SECRET || 'your_secret_key';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '1h' }
    );

    // 5. Berikan respons
    return NextResponse.json({ token, user: {id: user.id, name: user.name, email: user.email, role: user.role} }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
