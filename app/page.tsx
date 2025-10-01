// file: app/page.tsx

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const digioLogoSrc = "/digio-logo.png"; // Pastikan file logo ada di direktori `public`

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sisi Kiri: Latar Belakang Biru */}
      <div className="relative flex w-1/2 flex-col justify-between bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white">
        {/* Latar Belakang Gelombang (simulasi) */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500 opacity-30 blur-xl"></div>
          <div className="absolute -top-10 right-0 h-48 w-48 rounded-full bg-blue-400 opacity-20 blur-xl"></div>
          <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-blue-300 opacity-20 blur-xl"></div>
        </div>

        {/* Logo/Nama Perusahaan di Kiri Atas */}
        <div className="absolute left-12 top-12 text-lg font-bold text-white">
          DigiO Learning Center
        </div>

        {/* Konten Utama di Tengah */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
          <p className="mb-2 text-lg">Nice to see you again</p>
          <h1 className="mb-6 text-6xl font-extrabold tracking-tight">WELCOME BACK</h1>
          <div className="mb-8 h-1 w-24 bg-white opacity-50"></div>
          <p className="max-w-md text-lg leading-relaxed">
            lembaga pelatihan teknologi yang berfokus pada pengembangan keterampilan digital praktis sesuai kebutuhan
            industri modern. Dengan pendekatan berbasis proyek dan materi yang up-to-date, DigiO menghadirkan kursus
            yang relevan untuk menyiapkan peserta menjadi talenta digital unggul.
          </p>
        </div>
      </div>

      {/* Sisi Kanan: Area Tombol */}
      <div className="flex w-1/2 flex-col items-center justify-center bg-white p-12">
        <div className="w-full max-w-md text-center">
          {/* Logo DigiO */}
          <div className="mx-auto mb-8">
            <Image
              src={digioLogoSrc}
              alt="DigiO Learning Center Logo"
              width={180}
              height={180}
              className="mx-auto"
            />
          </div>
          {/* Tombol DAFTAR dan LOGIN */}
          <div className="flex flex-col space-y-4">
            <Link href="/register" legacyBehavior>
              <a className="w-full rounded-full bg-blue-600 px-6 py-3 text-lg font-bold text-white transition hover:bg-blue-700 shadow-lg">
                DAFTAR
              </a>
            </Link>
            <Link href="/login" legacyBehavior>
              <a className="w-full rounded-full border-2 border-blue-600 px-6 py-3 text-lg font-bold text-blue-600 transition hover:bg-blue-50">
                LOGIN
              </a>
            </Link>
          </div>

          {/* Tagline Paling Bawah */}
          <p className="mt-8 text-xl font-semibold text-gray-700">Daftar dan ikuti kelas yang kamu inginkan!</p>
        </div>
      </div>
    </div>
  );
}