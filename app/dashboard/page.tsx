// file: app/dashboard/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import SuccessPopup from '@/components/SuccessPopup';

interface Class {
  id: string;
  name: string;
  quota: number;
  available: number;
  description?: string;
  trainingDate?: Date;
  isRegistered?: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export default function StudentDashboard() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ title: '', message: '' });

  const bgImageSrc = "/background.jpg";
  const smallLogoSrc = "/digio-small-logo.png";
  const webProgImageSrc = "/web-prog.png";

  const fetchUser = async () => {
    try {
      const userData: User = await apiGet('me');
      setUser(userData);
    } catch (err: any) {
      console.error('Error fetching user:', err);
      if (err.message.includes('Authentication failed')) {
        router.push('/login');
      }
    }
  };

  const fetchClasses = async () => {
    try {
      const data: Class[] = await apiGet('classes');
      const sortedClasses = data
        .filter(cls => cls.trainingDate)
        .sort((a, b) => new Date(a.trainingDate!).getTime() - new Date(b.trainingDate!).getTime());
      setClasses(sortedClasses);
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes('token')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchClasses();
  }, [router]);

  const handleRegister = (classId: string) => {
    setSelectedClassId(classId);
    setShowWarningPopup(true);
  };

  const confirmRegister = async () => {
    if (!selectedClassId) return;
    try {
      await apiPost('register/class', { classId: selectedClassId });
      setPopupMessage({
        title: 'Berhasil!',
        message: 'Anda berhasil mendaftar. Email konfirmasi telah dikirim.'
      });
      setShowSuccessPopup(true);
      fetchClasses();
    } catch (err: any) {
      setPopupMessage({
        title: 'Gagal Mendaftar!',
        message: err.message || 'Terjadi kesalahan saat mendaftar kelas.'
      });
      setShowErrorPopup(true);
    } finally {
      setShowWarningPopup(false);
      setSelectedClassId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image src={bgImageSrc} alt="Background" fill style={{ objectFit: 'cover' }} quality={100} className="opacity-50" />
        </div>
        <div className="relative z-10 p-4 text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image src={bgImageSrc} alt="Background" fill style={{ objectFit: 'cover' }} quality={100} className="opacity-50" />
        </div>
        <div className="relative z-10 p-4 text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  const upcomingClasses = classes;

  return (
    <div className="relative min-h-screen">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <Image src={bgImageSrc} alt="Background" fill style={{ objectFit: 'cover' }} quality={100} className="opacity-50" />
      </div>

      <div className="relative z-10 min-h-screen backdrop-blur-sm">
        {/* Top Navigation */}
        <nav className="flex items-center justify-between px-8 py-4">
          <div className="p-2">
            <Image src={smallLogoSrc} alt="DigiO Logo" width={120} height={120} />
          </div>
          <div className="flex items-center space-x-4 relative">
            <Link href="/dashboard" legacyBehavior>
              <a className="rounded-full bg-red-600 px-6 py-2 text-sm font-bold text-white transition hover:bg-red-700">
                Daftar Kelas Tersedia
              </a>
            </Link>

            {/* Tombol Avatar */}
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="h-10 w-10 flex items-center justify-center rounded-full border-2 border-gray-300 bg-gray-200 text-gray-700 font-bold focus:outline-none overflow-hidden"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "U"
              )}
            </button>

            {/* Dropdown Menu Profil */}
            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push('/profile');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profil Saya
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>


        {/* Main Content */}
        <main className="container mx-auto mt-0 flex items-start justify-center p-0">
          {/* Left Column */}
          <div className="w-full md:w-1/3 p-4 flex flex-col">
            <div className="flex-1 rounded-xl bg-white bg-opacity-80 p-8 shadow-xl backdrop-blur-md">
              <h2 className="mb-4 text-xl font-extrabold text-gray-800">Gabung Class di DigiO</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li>Belajar dari mentor berpengalaman melalui sesi kelas virtual interaktif.</li>
                <li>Bimbingan intensif dan konsultasi bersama mentor dari awal hingga akhir program.</li>
                <li>Asah skill dan uji pemahaman dengan mengerjakan latihan & misi di setiap sesi.</li>
              </ul>
              <div className="mt-6">
                <Image
                  src={webProgImageSrc}
                  alt="Web Programming"
                  width={300}
                  height={150}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>


            {/* Tombol geser di bawah */}
            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={scrollLeft} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition">
                <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
              </button>
              <button onClick={scrollRight} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition">
                <ChevronRightIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>


          {/* Right Column */}
          <div className="w-full md:w-2/3 p-4">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide"
            >
              {upcomingClasses.length > 0 ? (
                upcomingClasses.map((cls) => (
                  <div key={cls.id} className="min-w-[300px] snap-center overflow-hidden rounded-lg bg-white p-4 shadow-md flex flex-col">
                    <div className="p-4 flex-1">
                      <h3 className="mb-2 text-lg font-semibold">{cls.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{cls.description}</p>
                      <div className="mt-4 flex flex-col items-start justify-between space-y-2">
                        <span className="text-sm text-gray-500">Kuota: {cls.available}/{cls.quota}</span>
                        <span className="text-sm text-gray-500">
                          Tanggal Mulai: {cls.trainingDate ? new Date(cls.trainingDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <button
                        onClick={() => handleRegister(cls.id)}
                        disabled={cls.isRegistered || cls.available <= 0}
                        className={`w-full rounded-full px-4 py-2 text-sm font-semibold text-white transition ${
                          cls.isRegistered
                            ? 'bg-green-500 cursor-not-allowed'
                            : cls.available <= 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {cls.isRegistered ? 'Terdaftar' : cls.available <= 0 ? 'Penuh' : 'Daftar'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Belum ada kelas yang akan datang.</p>
              )}


              {/* POPUPs */}
              <SuccessPopup
                isVisible={showWarningPopup}
                title="Daftar Kelas?"
                message="Apakah Anda yakin ingin mendaftar ke kelas ini?"
                onClose={() => setShowWarningPopup(false)}
                onConfirm={confirmRegister}
                type="warning"
              />


              <SuccessPopup
                isVisible={showSuccessPopup}
                title={popupMessage.title}
                message={popupMessage.message}
                onClose={() => setShowSuccessPopup(false)}
                type="success"
              />


              <SuccessPopup
                isVisible={showErrorPopup}
                title={popupMessage.title}
                message={popupMessage.message}
                onClose={() => setShowErrorPopup(false)}
                type="error"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}