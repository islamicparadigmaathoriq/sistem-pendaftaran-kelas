import { defineConfig, devices } from '@playwright/test';

// Konfigurasi ini memberitahu Playwright cara menjalankan tes-mu.
export default defineConfig({
  // PERBAIKAN: Arahkan ke folder 'test' sesuai struktur proyekmu
  testDir: './tests',

  // Jalankan semua tes secara paralel untuk kecepatan
  fullyParallel: true,

  // Konfigurasi untuk reporter (hasil tes)
  reporter: 'html', // Membuat laporan HTML yang bagus setelah tes selesai

  use: {
    // URL dasar yang akan digunakan untuk semua tes.
    baseURL: 'http://localhost:3000',

    // Mengumpulkan 'trace' saat tes gagal. Ini seperti rekaman video
    // dari apa yang terjadi, sangat berguna untuk debugging.
    trace: 'on-first-retry',
  },

  // Bagian ini memberitahu Playwright untuk menjalankan server development-mu
  // secara otomatis sebelum memulai tes.
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },

  /* Konfigurasi untuk browser yang akan diuji */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

