// file: components/SuccessPopup.tsx

import React from 'react';
import {
  CheckCircleIcon,
  XMarkIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface AppPopupProps {
  title: string;
  message: string;
  onClose: () => void;
  isVisible: boolean;
  type?: 'success' | 'error' | 'warning';
  onConfirm?: () => void; // hanya dipakai untuk warning
}

export default function AppPopup({
  title,
  message,
  onClose,
  isVisible,
  type = 'success',
  onConfirm,
}: AppPopupProps) {
  if (!isVisible) return null;

  let icon, bgColor, buttonColor;
  switch (type) {
    case 'success':
      icon = <CheckCircleIcon className="h-28 w-28 text-white" />;
      bgColor = 'bg-green-500';
      buttonColor = 'bg-green-500 hover:bg-green-600';
      break;
    case 'error':
      icon = <ExclamationCircleIcon className="h-28 w-28 text-white" />;
      bgColor = 'bg-red-500';
      buttonColor = 'bg-red-500 hover:bg-red-600';
      break;
    case 'warning':
      icon = <InformationCircleIcon className="h-28 w-28 text-white" />;
      bgColor = 'bg-blue-500';
      buttonColor = 'bg-blue-500 hover:bg-blue-600';
      break;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative flex w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Bagian Kiri: Ikon */}
        <div className={`flex w-1/3 items-center justify-center p-8 ${bgColor}`}>
          {icon}
        </div>

        {/* Bagian Kanan: Konten */}
        <div className="flex w-2/3 flex-col justify-center p-8 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-gray-800">{title}</h2>
          <p className="mb-6 text-lg text-gray-600">{message}</p>

          {type === 'warning' && onConfirm ? (
            <div className="flex justify-center space-x-4">
              <button
                onClick={onClose}
                className="rounded-full bg-gray-300 px-8 py-3 text-lg font-semibold text-gray-800 transition hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className={`rounded-full px-8 py-3 text-lg font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColor}`}
              >
                Ya
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className={`mx-auto block rounded-full px-8 py-3 text-lg font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColor}`}
            >
              Okay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
