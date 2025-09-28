// file: app/api/auth/forgot-password/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
// PERUBAHAN: Mengimpor fungsi pengiriman email yang sudah kita buat
import { sendPasswordResetEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Jika user tidak ditemukan, tetap kembalikan pesan sukses untuk keamanan
    // Ini mencegah orang lain menebak-nebak email mana yang terdaftar.
    if (!user) {
      return NextResponse.json(
        {
          message:
            'If a user with that email exists, a password reset link has been sent.',
        },
        { status: 200 }
      );
    }

    // Buat token reset password yang unik
    const secret = process.env.JWT_SECRET || 'your_secret_key';
    const resetToken = jwt.sign({ userId: user.id }, secret, {
      expiresIn: '1h',
    });

    // Simpan token dan waktu kadaluarsa di database
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1); // Token berlaku 1 jam

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: expiryDate,
      },
    });

    // --- PERUBAHAN DIMULAI DI SINI ---

    // Buat URL reset password lengkap
    const resetUrl = `${req.headers.get(
      'origin'
    )}/reset-password?token=${resetToken}`;

    // Panggil fungsi pengiriman email yang sebenarnya, bukan lagi console.log
    await sendPasswordResetEmail(user.email, resetUrl);

    // --- PERUBAHAN SELESAI ---

    return NextResponse.json(
      {
        message:
          'If a user with that email exists, a password reset link has been sent.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    // Jika pengiriman email gagal, error akan ditangkap di sini
    // dan mengembalikan pesan error umum.
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
