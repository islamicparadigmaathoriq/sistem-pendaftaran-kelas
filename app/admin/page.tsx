// file: app/admin/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost, apiDelete, apiFetch } from '@/lib/api';
import Image from 'next/image';
import SuccessPopup from '@/components/SuccessPopup';
import AnalyticsChart from '@/components/admin/AnalyticsChart';

interface Class {
  id: string;
  name: string;
  quota: number;
  available: number;
  description?: string;
  trainingDate?: Date;
}

interface Participant {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('classes');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ title: '', message: '' });
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState({ title: '', message: '' });
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  
  const router = useRouter();

  const bgImageSrc = "/background.jpg";

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data: Class[] = await apiGet('admin/classes');
      setClasses(data);
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes('Access denied')) {
        alert('Access Denied. You are not an admin.');
        router.push('/');
      } else if (err.message.includes('token')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async (classId: string) => {
    setParticipantsLoading(true);
    try {
      const data: Participant[] = await apiGet(`admin/registrations/${classId}`);
      setParticipants(data);
      setIsParticipantsModalOpen(true);
    } catch (err: any) {
      setErrorPopupMessage({
        title: 'Gagal Memuat Peserta!',
        message: err.message || 'Terjadi kesalahan saat memuat daftar peserta.'
      });
      setShowErrorPopup(true);
    } finally {
      setParticipantsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [router]);

  const handleEdit = (cls: Class) => {
    setCurrentClass(cls);
    setIsClassModalOpen(true);
  };

  const handleDelete = (classId: string) => {
    setDeleteTargetId(classId);
    setShowWarningPopup(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await apiDelete(`admin/classes/${deleteTargetId}`);
      setPopupMessage({
        title: 'Kelas Dihapus!',
        message: 'Kelas berhasil dihapus.'
      });
      setShowSuccessPopup(true);
      fetchClasses();
    } catch (err: any) {
      setErrorPopupMessage({
        title: 'Gagal Menghapus!',
        message: err.message || 'Terjadi kesalahan saat menghapus kelas.'
      });
      setShowErrorPopup(true);
    } finally {
      setShowWarningPopup(false);
      setDeleteTargetId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClass) {
      setErrorPopupMessage({
        title: 'Data Tidak Lengkap!',
        message: 'Mohon isi semua data kelas.'
      });
      setShowErrorPopup(true);
      return;
    }

    try {
      const trainingDateString = currentClass.trainingDate
        ? new Date(currentClass.trainingDate).toISOString().split('T')[0]
        : null;

      const payload = {
        name: currentClass.name,
        quota: currentClass.quota,
        description: currentClass.description,
        trainingDate: trainingDateString,
      };

      if (currentClass.id) {
        await apiFetch(`admin/classes/${currentClass.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setPopupMessage({
          title: 'Kelas Diperbarui!',
          message: 'Data kelas berhasil diperbarui.'
        });
      } else {
        await apiPost('admin/classes', payload);
        setPopupMessage({
          title: 'Kelas Ditambahkan!',
          message: 'Kelas baru berhasil ditambahkan.'
        });
      }
      setShowSuccessPopup(true);
      setIsClassModalOpen(false);
      fetchClasses();
    } catch (err: any) {
      console.error('Save failed:', err);
      let errorMessage = 'Terjadi kesalahan saat menyimpan kelas.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorPopupMessage({
        title: 'Gagal Menyimpan!',
        message: errorMessage
      });
      setShowErrorPopup(true);
    }
  };

  const handleOpenClassModal = () => {
    setCurrentClass({ id: '', name: '', quota: 0, available: 0 });
    setIsClassModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false);
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

  return (
    <div className="relative min-h-screen">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <Image src={bgImageSrc} alt="Background" fill style={{ objectFit: 'cover' }} quality={100} className="opacity-50" />
      </div>

      {/* Main Content Container with Translucent Background */}
      <div className="relative z-10 min-h-screen backdrop-blur-sm">
        {/* Top Navigation */}
        <nav className="flex items-center justify-between bg-white bg-opacity-80 px-8 py-4 shadow-md backdrop-blur-lg">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView('classes')}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                currentView === 'classes' ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'
              }`}
            >
              Pengelolaan Kelas
            </button>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Log Out
            </button>
          </div>
        </nav>

        {/* Dynamic Content Area with Grid Layout */}
        <main className="container mx-auto p-8 grid grid-cols-3 gap-6">
          {/* Kolom kiri: Daftar Kelas */}
          <div className="col-span-2 rounded-lg bg-white bg-opacity-80 p-6 shadow-xl backdrop-blur-md">
            {currentView === 'classes' ? (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Daftar Kelas</h2>
                  <button
                    onClick={handleOpenClassModal}
                    className="rounded-md bg-green-500 px-4 py-2 font-semibold text-white transition hover:bg-green-600"
                  >
                    Tambah Kelas Baru
                  </button>
                </div>
                <div className="overflow-x-auto rounded-md shadow-md">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold">Nama Kelas</th>
                        <th className="py-3 px-4 text-left font-semibold">Kuota</th>
                        <th className="py-3 px-4 text-left font-semibold">Tersedia</th>
                        <th className="py-3 px-4 text-left font-semibold">Tanggal Mulai Pelatihan</th>
                        <th className="py-3 px-4 text-left font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classes.map((cls) => (
                        <tr key={cls.id} className="border-b transition hover:bg-gray-50">
                          <td className="py-3 px-4">{cls.name}</td>
                          <td className="py-3 px-4">{cls.quota}</td>
                          <td className="py-3 px-4">{cls.available}</td>
                          <td className="py-3 px-4">{cls.trainingDate ? new Date(cls.trainingDate).toLocaleDateString() : 'N/A'}</td>
                          <td className="flex space-x-2 py-3 px-4">
                            <button
                              onClick={() => handleEdit(cls)}
                              className="rounded-md bg-yellow-500 px-3 py-1 text-sm text-white transition hover:bg-yellow-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(cls.id)}
                              className="rounded-md bg-red-500 px-3 py-1 text-sm text-white transition hover:bg-red-600"
                            >
                              Hapus
                            </button>
                            <button
                              onClick={() => fetchParticipants(cls.id)}
                              className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white transition hover:bg-blue-600"
                            >
                              Lihat Peserta
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-6">Daftar Semua Peserta</h2>
                <p>Fitur ini masih dalam pengembangan. Silakan klik 'Lihat Peserta' pada kelas tertentu.</p>
              </div>
            )}
          </div>

          {/* Kolom kanan: Dashboard Analitik */}
          <div className="col-span-1 rounded-lg bg-white p-6 shadow-xl backdrop-blur-md">
            <h2 className="text-2xl font-bold mb-6">Dashboard Analitik</h2>
            <AnalyticsChart />
          </div>
        </main>

        {/* Modal untuk Tambah/Edit Kelas */}
        {isClassModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-2xl font-bold">
                {currentClass?.id ? 'Edit Kelas' : 'Tambah Kelas Baru'}
              </h2>
              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label htmlFor="className" className="mb-1 block text-sm font-bold text-gray-700">Nama Kelas</label>
                  <input
                    id="className"
                    type="text"
                    className="w-full rounded-md border p-2"
                    value={currentClass?.name || ''}
                    onChange={(e) => setCurrentClass({ ...currentClass!, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="classQuota" className="mb-1 block text-sm font-bold text-gray-700">Kuota</label>
                  <input
                    id="classQuota"
                    type="number"
                    className="w-full rounded-md border p-2"
                    value={currentClass?.quota || 0}
                    onChange={(e) => setCurrentClass({ ...currentClass!, quota: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="classDesc" className="mb-1 block text-sm font-bold text-gray-700">Deskripsi</label>
                  <textarea
                    id="classDesc"
                    className="w-full rounded-md border p-2"
                    rows={4}
                    value={currentClass?.description || ''}
                    onChange={(e) => setCurrentClass({ ...currentClass!, description: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="trainingDate" className="mb-1 block text-sm font-bold text-gray-700">Tanggal Mulai Pelatihan</label>
                  <input
                    id="trainingDate"
                    type="date"
                    className="w-full rounded-md border p-2"
                    value={currentClass?.trainingDate ? new Date(currentClass.trainingDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setCurrentClass({ ...currentClass!, trainingDate: e.target.value ? new Date(e.target.value) : undefined })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsClassModalOpen(false)}
                    className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal untuk Daftar Peserta */}
        {isParticipantsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-2xl font-bold">Daftar Peserta</h2>
              {participantsLoading ? (
                <p>Memuat daftar peserta...</p>
              ) : participants.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto">
                  {participants.map((p) => (
                    <li key={p.user.id} className="mb-2 border-b pb-2">
                      <p className="font-semibold">{p.user.name}</p>
                      <p className="text-sm text-gray-600">{p.user.email}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Belum ada peserta yang mendaftar.</p>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsParticipantsModalOpen(false)}
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-400"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SUCCESS POPUP */}
      <SuccessPopup
        isVisible={showSuccessPopup}
        title={popupMessage.title}
        message={popupMessage.message}
        onClose={handleCloseSuccessPopup}
      />
      {/* ERROR POPUP */}
      <SuccessPopup
        isVisible={showErrorPopup}
        title={errorPopupMessage.title}
        message={errorPopupMessage.message}
        onClose={handleCloseErrorPopup}
        type="error"
      />
      {/* WARNING POPUP (konfirmasi hapus) */}
      <SuccessPopup
        isVisible={showWarningPopup}
        title="Hapus Kelas?"
        message="Apakah Anda yakin ingin menghapus kelas ini? Semua peserta juga akan dihapus."
        onClose={() => setShowWarningPopup(false)}
        onConfirm={confirmDelete}
        type="warning"
      />
    </div>
  );
}
