// file: app/api/admin/registrations/[classId]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { authMiddleware, DecodedToken } from '../../../middleware/auth';

const prisma = new PrismaClient();

const getRegistrationsByClass = async (req: Request, { params }: { params: { classId: string } }) => {
  try {
    const { classId } = params;

    const registrations = await prisma.registration.findMany({
      where: {
        classId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(registrations, { status: 200 });
  } catch (error) {
    console.error('Error fetching class registrations:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
};

// Hanya admin yang bisa melihat daftar peserta
export const GET = authMiddleware(getRegistrationsByClass, ['ADMIN']);