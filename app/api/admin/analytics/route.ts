// app/api/admin/analytics/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authMiddleware } from '../../middleware/auth';

// Fungsi ini akan mengambil data pendaftaran, mengelompokkannya per hari, dan menghitung jumlahnya.
const getRegistrationAnalytics = async (req: Request) => {
  try {
    // Ambil semua data pendaftaran dari database
    const registrations = await prisma.registration.findMany({
      select: {
        createdAt: true, // Kita hanya perlu tanggal pendaftarannya
      },
      orderBy: {
        createdAt: 'asc', // Urutkan dari yang terlama
      },
    });

    // Proses data di JavaScript untuk mengelompokkannya per hari
    const registrationsPerDay = registrations.reduce((acc: { [key: string]: number }, reg) => {
      // Ubah tanggal lengkap menjadi format YYYY-MM-DD
      const date = reg.createdAt.toISOString().split('T')[0];
      
      // Jika tanggal ini belum ada di accumulator, inisialisasi dengan 1
      // Jika sudah ada, tambahkan 1
      acc[date] = (acc[date] || 0) + 1;
      
      return acc;
    }, {});

    // Ubah data dari format objek menjadi format array yang ramah untuk Chart.js
    const labels = Object.keys(registrationsPerDay);
    const data = Object.values(registrationsPerDay);

    return NextResponse.json({ labels, data }, { status: 200 });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { message: 'Something went wrong while fetching analytics data' },
      { status: 500 }
    );
  }
};

// Pastikan hanya ADMIN dan STAFF yang bisa mengakses endpoint ini
export const GET = authMiddleware(getRegistrationAnalytics, ['ADMIN', 'STAFF']);