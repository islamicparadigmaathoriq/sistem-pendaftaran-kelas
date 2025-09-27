// file: app/api/register/class/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { authMiddleware, DecodedToken } from '../../middleware/auth';

const prisma = new PrismaClient();

const registerForClass = async (req: Request) => {
  try {
    const { classId } = await req.json();
    const user = (req as any).user as DecodedToken;

    if (!classId) {
      return NextResponse.json({ message: 'Class ID is required' }, { status: 400 });
    }

    // Gunakan transaksi Prisma untuk memastikan operasi atomik
    const result = await prisma.$transaction(async (tx) => {
      // 1. Cek kuota yang tersedia dan pastikan user belum terdaftar
      const targetClass = await tx.class.findUnique({
        where: { id: classId },
      });

      if (!targetClass) {
        throw new Error('Class not found');
      }

      if (targetClass.available <= 0) {
        throw new Error('No more available slots for this class');
      }

      const existingRegistration = await tx.registration.findUnique({
        where: {
          userId_classId: {
            userId: user.id,
            classId,
          },
        },
      });

      if (existingRegistration) {
        throw new Error('You are already registered for this class');
      }

      // 2. Buat entri pendaftaran baru
      const newRegistration = await tx.registration.create({
        data: {
          userId: user.id,
          classId,
        },
      });

      // 3. Kurangi kuota yang tersedia (kuota real-time)
      const updatedClass = await tx.class.update({
        where: { id: classId },
        data: {
          available: {
            decrement: 1,
          },
        },
      });

      return { newRegistration, updatedClass };
    });

    return NextResponse.json(
      { message: 'Registered successfully', registration: result.newRegistration },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message === 'Class not found' || error.message === 'No more available slots for this class' || error.message === 'You are already registered for this class') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    console.error('Registration failed:', error);
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
  }
};

// Gunakan authMiddleware untuk memastikan hanya user yang login yang bisa mendaftar
export const POST = authMiddleware(registerForClass);
