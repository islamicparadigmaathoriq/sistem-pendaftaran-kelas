// file: app/reset-password/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiPost } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const bgImageSrc = "/background.jpg";

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setMessage('Tautan reset password tidak valid.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    if (newPassword !== confirmPassword) {
      setMessage('Password baru tidak cocok.');
      setLoading(false);
      return;
    }

    if (!token) {
      setMessage('Tautan reset password tidak valid.');
      setLoading(false);
      return;
    }

    try {
      await apiPost('auth/reset-password', {
        token,
        newPassword
      });
      setMessage('Password berhasil diubah! Anda akan dialihkan ke halaman login.');
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setMessage(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <Image src={bgImageSrc} alt="Background" fill style={{ objectFit: 'cover' }} quality={100} className="opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-8 shadow-md backdrop-blur-sm">
        <div className="text-center">
          <h1 className="mb-6 text-2xl font-bold">Reset Password</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {message && (
            <p className={`mb-4 text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}
          
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 sr-only">Password Baru</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Password Baru"
              className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 sr-only">Konfirmasi Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Konfirmasi Password"
              className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 py-3 font-bold text-white transition hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Mengubah Password...' : 'Ubah Password'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Kembali ke{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}