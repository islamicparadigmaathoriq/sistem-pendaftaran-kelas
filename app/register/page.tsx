// file: app/register/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import SuccessPopup from '@/components/SuccessPopup'; // Impor komponen popup

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State baru untuk popup
  const [popupMessage, setPopupMessage] = useState({ title: '', message: '' });

  const router = useRouter();

  const bgImageSrc = "/background.jpg";
  const smallLogoSrc = "/digio-small-logo.png";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiPost('auth/register', { name, email, password });
      
      // Tampilkan popup sukses
      setPopupMessage({
        title: 'Registrasi Berhasil!',
        message: 'Akun Anda telah berhasil dibuat. Silakan login untuk melanjutkan.'
      });
      setShowSuccessPopup(true);

      // Tidak langsung redirect. Redirect akan dilakukan setelah user klik "Okay" di popup
    } catch (err: any) {
      // Untuk error yang sudah ada (misal: email sudah terdaftar)
      setError(err.message || 'Terjadi kesalahan saat registrasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    router.push('/login'); // Redirect ke halaman login setelah popup ditutup
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
          alt="DigiO Logo"
          width={40}
          height={40}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="mb-6 text-2xl font-bold">Register</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="mb-4 text-center text-red-500">{error}</p>}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 sr-only">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 py-3 font-bold text-white transition hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>

      {/* Render the custom Success Popup */}
      <SuccessPopup
        isVisible={showSuccessPopup}
        title={popupMessage.title}
        message={popupMessage.message}
        onClose={handleClosePopup}
      />
    </div>
  );
}