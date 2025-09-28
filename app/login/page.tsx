// file: app/login/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const bgImageSrc = "/background.jpg";
  const smallLogoSrc = "/digio-small-logo.png";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Pastikan data yang dikirim tidak kosong
    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await apiPost('auth/login', { email, password });
      
      // Simpan token dan info user di local storage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      if (response.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImageSrc}
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          className="opacity-50"
        />
      </div>

      {/* Small DigiO Logo at top-left corner with a circular frame */}
      <div className="absolute left-6 top-6 z-10 rounded-full bg-white p-2 shadow-lg">
        <Image
          src={smallLogoSrc}
          alt="Digio Logo"
          width={40}
          height={40}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="mb-6 text-2xl font-bold">Login</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && <p className="mb-4 text-center text-red-500">{error}</p>}
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
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 text-right text-sm">
            <Link href="/forgot-password" className="text-blue-700 hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 py-3 font-bold text-white transition hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-700 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}