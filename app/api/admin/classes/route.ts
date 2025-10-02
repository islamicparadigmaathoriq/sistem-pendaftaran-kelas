// file: app/api/admin/classes/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { authMiddleware } from '../../middleware/auth';

const prisma = new PrismaClient();

// API untuk membuat kelas baru (CREATE)
const createClass = async (req: Request) => {
  try {
    // Ambil 'trainingDate' dari request, bukan 'imageUrl'
    const { name, quota, description, trainingDate } = await req.json();

    if (!name || !quota || typeof quota !== 'number' || quota <= 0) {
      return NextResponse.json(
        { message: 'Invalid data for new class' },
        { status: 400 }
      );
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        quota,
        available: quota, // Kuota yang tersedia sama dengan kuota total saat dibuat
        description,
        // Simpan data tanggal. Ubah string tanggal menjadi objek Date.
        trainingDate: trainingDate ? new Date(trainingDate) : null,
      },
    });

    return NextResponse.json(
      { message: 'Class created successfully', class: newClass },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
};

// API untuk mendapatkan daftar kelas (READ)
const getClasses = async (req: Request) => {
  try {
    const classes = await prisma.class.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
};

// Export the API routes with the authentication middleware
export const POST = authMiddleware(createClass, ['ADMIN', 'STAFF']);
export const GET = authMiddleware(getClasses, ['ADMIN', 'STAFF']);