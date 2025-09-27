// file: app/api/auth/forgot-password/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Jika user tidak ditemukan, kembalikan pesan sukses agar tidak
    // memberikan informasi bahwa email tidak terdaftar
    if (!user) {
      return NextResponse.json({ message: 'If user exists, a password reset link has been sent to their email.' }, { status: 200 });
    }

    // Buat token reset password yang unik dengan masa berlaku singkat (contoh: 1 jam)
    const secret = process.env.JWT_SECRET || 'your_secret_key';
    const resetToken = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });

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

    // KIRIM EMAIL
    // Di sini Anda akan mengimplementasikan fungsi pengiriman email
    // menggunakan layanan seperti Nodemailer, SendGrid, dll.
    // Contoh URL reset password:
    const resetUrl = `${req.headers.get('origin')}/reset-password?token=${resetToken}`;

    // Contoh pseudo-code untuk mengirim email:
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Password Reset',
    //   text: `Click on this link to reset your password: ${resetUrl}`,
    //   html: `<p>Click on this link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
    // });
    
    // Untuk tujuan demo, kita tidak akan mengirim email
    console.log(`Password reset URL: ${resetUrl}`);

    return NextResponse.json({ message: 'If user exists, a password reset link has been sent to their email.' }, { status: 200 });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}