// file: app/api/classes/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { authMiddleware, DecodedToken } from '../middleware/auth';

const prisma = new PrismaClient();

const getClassesForStudent = async (req: Request) => {
  try {
    // Dapatkan data user dari token yang sudah diverifikasi oleh middleware
    const user = (req as any).user as DecodedToken;

    const classes = await prisma.class.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    // Cari tahu kelas mana saja yang sudah didaftar oleh user ini
    const userRegistrations = await prisma.registration.findMany({
      where: {
        userId: user.id,
      },
      select: {
        classId: true,
      },
    });

    const registeredClassIds = userRegistrations.map((reg) => reg.classId);

    // Tambahkan status 'isRegistered' ke setiap objek kelas
    const classesWithStatus = classes.map((cls) => ({
      ...cls,
      isRegistered: registeredClassIds.includes(cls.id),
    }));

    return NextResponse.json(classesWithStatus, { status: 200 });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
};

// Gunakan authMiddleware tanpa batasan role, karena semua user bisa melihat daftar kelas
export const GET = authMiddleware(getClassesForStudent);