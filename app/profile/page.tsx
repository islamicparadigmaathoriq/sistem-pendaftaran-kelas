// file: app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link'; // Ditambahkan jika diperlukan untuk tombol navigasi

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  createdAt?: string; // tanggal registrasi
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const bgImageSrc = "/background.jpg"; // Tambahkan ini

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiGet('me'); // API profil student
        setUser(data);
      } catch (err: any) {
        console.error(err);
        router.push('/login');
      }
    };

    fetchProfile();
  }, [router]);

  if (!user) {
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image src={bgImageSrc} alt="Background" fill style={{ objectFit: 'cover' }} quality={100} className="opacity-50" />
        </div>
        <div className="relative z-10 p-4 text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
    {/* Background Image Overlay */}
    <div className="absolute inset-0 z-0">
      <Image src={bgImageSrc} alt="Background" fill style={{ objectFit: 'cover' }} quality={100} className="opacity-50" />
    </div>

    {/* Main Content Container with Translucent Background */}
    <div className="relative z-10 min-h-screen backdrop-blur-sm flex items-center justify-center px-4">
      {/* 🔑 PASTIKAN ADA KELAS bg-white di sini */}
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8"> 
        <div className="flex flex-col items-center">
            {user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt="Profile"
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <div className="h-24 w-24 flex items-center justify-center rounded-full bg-blue-500 text-white text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            {user.createdAt && (
              <p className="mt-2 text-sm text-gray-500">
                Bergabung sejak: {new Date(user.createdAt).toLocaleDateString('id-ID')}
              </p>
            )}
          </div>

          {/* Info detail */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>ID User</span>
              <span className="font-medium">{user.id}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
          </div>

          {/* Tombol kembali */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="rounded-full bg-blue-600 px-6 py-2 text-white font-semibold shadow hover:bg-blue-700 transition"
            >
              ← Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}