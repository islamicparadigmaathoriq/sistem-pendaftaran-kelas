// file: app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const bgImageSrc = "/background.jpg";
  const smallLogoSrc = "/digio-small-logo.png";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      // Panggil API backend untuk lupa password
      await apiPost('auth/forgot-password', { email });
      setMessage('Tautan reset password telah dikirim ke email Anda.');
      setIsSuccess(true);
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
          <h1 className="mb-6 text-2xl font-bold">Lupa Password?</h1>
          <p className="mb-4 text-sm text-gray-600">
            Masukkan email Anda dan kami akan mengirimkan tautan untuk mereset password.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {message && (
            <p className={`mb-4 text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 py-3 font-bold text-white transition hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
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