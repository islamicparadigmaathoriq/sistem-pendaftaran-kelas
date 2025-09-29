# Sistem Pendaftaran Kelas dengan Kuota Real-time

## Deskripsi singkat

Aplikasi web untuk pendaftaran kelas yang menampilkan kuota real-time.
Siswa dapat mendaftar kelas, melihat sisa kuota, dan menerima konfirmasi.
Admin dapat membuat, mengedit, menghapus kelas, serta melihat daftar peserta.

Aplikasi Live: https://sistem-pendaftaran-kelas.vercel.app/
---

## Daftar Isi

1. [Fitur utama](#fitur-utama)
2. [Stack Teknologi](#stack-teknologi)
3. [Prasyarat](#prasyarat)
4. [Instalasi & Menjalankan Secara Lokal](#instalasi--menjalankan-secara-lokal)
5. [Variabel Lingkungan (.env)](#variabel-lingkungan-env)
6. [Database & Prisma](#database--prisma)
7. [Script NPM Penting](#script-npm-penting)
8. [Testing Email (debugging nodemailer)](#testing-email-debugging-nodemailer)
9. [Panduan Deploy Lengkap](#panduan-deploy-lengkap)
10. [Troubleshooting umum](#troubleshooting-umum)
11. [Kontribusi](#kontribusi)
12. [License](#license)
13. [ERD / Arsitektur Visual](#erd--arsitektur-visual)
14. [Hasil Uji Aksesibilitas Frontend](#Hasil-Uji-Aksesibilitas-Frontend)
15. [Menjalankan Pengujian / Testing](#Menjalankan-Pengujian--Testing)
16. [Catatan Perkembangan](#catatan-perkembangan)
17. [Tabel Progres Proyek](#Tabel-Progres-Proyek)

---

## Fitur Utama

* Registrasi & Login berbasis JWT.
* Manajemen Kelas (CRUD) oleh Admin.
* Tampilan daftar kelas beserta sisa kuota untuk Siswa.
* Pendaftaran kelas dengan kuota real-time (transaksi atomik dengan Prisma).
* Fitur Lupa & Reset Password.
* Notifikasi email otomatis (Nodemailer) untuk konfirmasi pendaftaran dan reset password.

---

## Stack Teknologi

* Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS
* Backend: Next.js API Routes, Prisma ORM
* Auth: `bcryptjs` untuk hashing password, `jsonwebtoken` (JWT) untuk sesi
* Email: `Nodemailer` dengan Gmail App Password
* Database: PostgreSQL
* Testing: `Jest` untuk Unit Test (Backend), `Playwright` untuk E2E Test (Frontend)

---

## Prasyarat

Pastikan perangkat lokal ini sudah terinstal:

* Node.js (v18+ direkomendasikan)
* npm (atau yarn/pnpm)
* PostgreSQL (atau gunakan layanan hosted seperti Supabase)
* Git

---

## Instalasi & Menjalankan Secara Lokal

1. Clone repository ini:

```bash
git clone [https://github.com/islamicparadigmaathoriq/sistem-pendaftaran-kelas.git](https://github.com/islamicparadigmaathoriq/sistem-pendaftaran-kelas.git)
cd sistem-pendaftaran-kelas
```

2. Install semua dependencies:

```bash
npm install
```

3. Siapkan file environment: Salin dari contoh yang ada.

```bash
# macOS / Linux
cp .env.example .env

# Windows (PowerShell)
copy .env.example .env
```

4. Konfigurasi `.env`: Buka file `.env` dan isi semua variabel yang dibutuhkan (lihat bagian Variabel Lingkungan).

5. Jalankan migrasi database: Perintah ini akan membuat semua tabel di database Anda sesuai skema Prisma.

```bash
npx prisma migrate dev
```

6. Jalankan server development:

```bash
npm run dev
```

Aplikasi sekarang berjalan di `http://localhost:3000`

---

## Variabel Lingkungan (.env)

File `.env` digunakan untuk menyimpan semua konfigurasi rahasia.:

```env
# Koneksi Database (contoh untuk Supabase)
# PENTING: Gunakan connection string dari "Connection Pooler" dan tambahkan ?pgbouncer=true
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"

# Kunci rahasia untuk JWT
JWT_SECRET="your_strong_random_secret_key"

# Kredensial untuk mengirim email (gunakan App Password dari Gmail)
EMAIL_USER=yourgmailaccount@gmail.com
EMAIL_PASS=your_gmail_app_password_without_spaces
```

**Catatan penting untuk EMAIL_PASS:**

* Jika memakai Gmail, buat *App Password* (Google Account → Security → App passwords) dan pakai nilai tersebut.

---

## Database & Prisma

Skema database didefinisikan di `prisma/schema.prisma`.

* Untuk menjalankan migrasi:
```bash
npx prisma migrate dev --name init`
```
* Untuk melihat dan mengelola data di database secara visual, jalankan:
```bash
npx prisma studio
```

Jika ingin menambah seed data, buat skrip seed sesuai kebutuhan dan jalankan `npx prisma db seed` (jika sudah dikonfigurasi).

---

## Script NPM Penting

Berikut adalah beberapa perintah yang sering digunakan dalam proyek ini yang mungkin ada di `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "test:backend": "jest --config jest.config.backend.js",
    "test:e2e": "playwright test"
  }
}
```

---

## Testing Email (debugging nodemailer)

Jika email konfirmasi tidak masuk saat pengujian lokal, lakukan pengecekan:

1. Pastikan `EMAIL_USER` dan `EMAIL_PASS` benar.
2. Untuk Gmail: aktifkan 2FA dan buat App Password, gunakan App Password itu sebagai `EMAIL_PASS`.

**Skrip kecil untuk verifikasi transporter (node):**

Buat file `scripts/test-email.js` di root proyek (Node, bukan Next):

```js
// scripts/test-email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

async function main() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.verify();
    console.log('SMTP connection OK');
  } catch (err) {
    console.error('SMTP connection ERROR', err);
  }
}

main();
```

Jalankan:

```bash
node scripts/test-email.js
```

Jika `SMTP connection OK` → transporter valid atau koneksi berhasil.
Jika `Email terkirim: <message-id>` → email terkirim.

📌 **Catatan penting dari hasil uji coba:**

* Tanpa `tls: { rejectUnauthorized: false }` → di environment lokal (Windows + Node.js) TLS handshake gagal dengan error *"self-signed certificate in certificate chain"*.
* Dengan tambahan `tls: { rejectUnauthorized: false }` → koneksi berhasil dan email terkirim.
* Ini aman dipakai untuk **testing lokal** 👍.
* Saat sudah deploy ke Vercel/hosting biasanya **tidak perlu lagi** opsi TLS longgar karena server punya sertifikat CA valid.

---

## Panduan Deploy Lengkap
Aplikasi ini di-deploy menggunakan Vercel untuk frontend/API dan Supabase untuk database PostgreSQL.

### 1. Persiapan
- Pastikan project sudah di-push ke GitHub.
- Buat akun:
  - [Vercel](https://vercel.com) → hosting frontend + API
  - [Supabase](https://supabase.com) → hosting PostgreSQL
  
---

### 2. Siapkan Database di Supabase:
* Buat proyek baru di Supabase dengan:
1. Tentukan password database (catat baik-baik).
2. Setelah project dibuat, buka **Project Settings → Database**.
3. Salin **Connection String** format `DATABASE_URL`: (pakai yang Session pooler) ke `Environtment Variables` di vercel.

>PENTING: Tambahkan `?pgbouncer=true` di akhir URL untuk stabilitas koneksi dari Vercel.

---

### 3. Deploy Backend + Frontend di Vercel:

1. Login ke Vercel → **New Project** → Import repository dari GitHub.
2. Pilih project `sistem-pendaftaran-kelas`.
3. Atur **Environment Variables** di Vercel:
- `DATABASE_URL` → isi dengan connection string dari Supabase
- `JWT_SECRET` → isi string acak (gunakan [randomkeygen.com](https://randomkeygen.com))
- `EMAIL_USER` → email pengirim (mis. Gmail)
- `EMAIL_PASS` → App Password Gmail (jangan password asli)
4. Klik **Deploy**.

> Catatan: Vercel akan otomatis melakukan deploy setiap kali Anda melakukan `git push` ke branch `main`.

---

### 4. Migrasi Database Prisma ke Supabase
Supaya tabel otomatis dibuat di Supabase:

1. Pastikan `.env` lokal mengarah ke Supabase:
```env
DATABASE_URL="postgresql://postgres:<PASSWORD>@db.<HASH>.supabase.co:6543/postgres?pgbouncer=true"
```

---

## Troubleshooting Umum

* Error: `prepared statement "..." already exists`: Ini terjadi karena koneksi antara Prisma & Supabase Pooler. Solusi: Tambahkan `?pgbouncer=true` di akhir `DATABASE_URL` Anda.

* Email Tidak Terkirim di Vercel: Pastikan variabel `EMAIL_USER` dan `EMAIL_PASS` sudah diatur dengan benar di Environment Variables Vercel dan `EMAIL_PASS` adalah App Password (tanpa spasi).

* E2E Test Gagal Login: Pastikan akun yang digunakan untuk tes (`youremail@gmail.com`) benar-benar ada di database Supabase Anda dan memiliki peran (`role`) sebagai `ADMIN`.

---

## Kontribusi

Silakan buat branch baru untuk setiap fitur atau perbaikan, lalu ajukan Pull Request (PR) ke main.

Contoh workflow:

```bash
git checkout -b docs/readme
git add README.md
git commit -m "docs: add README installation guide"
git push -u origin docs/readme
```

---

## License

Proyek ini dibuat untuk keperluan tugas pada mata kuliah Pemrograman Berbasis Web.
Hak cipta © 2025 islamicparadigmaathoriq.

---

## ERD / Arsitektur Visual

Berikut adalah Entity Relationship Diagram (ERD) sistem yang digenerasi dari skema Prisma:

![ERD](./prisma/ERD.svg)

**Keterangan simbol:**
- 🔑 Primary Key  
- ❓ Kolom opsional (nullable)

---

## Hasil Uji Aksesibilitas Frontend

Pengujian dilakukan dengan **Lighthouse (Chrome DevTools)** pada tab **Accessibility**.  
Target skor minimal adalah **≥ 80**.

| Halaman                                   | Skor Lighthouse |
|-------------------------------------------|-----------------|
| Home / Landing (`app/page.tsx`)           | ✅ 100 |
| Login (`app/login/page.tsx`)              | ⚠️ 91 |
| Register (`app/register/page.tsx`)        | ✅ 96 |
| Dashboard Student (`app/dashboard/page.tsx`)| ✅ 94 |
| Dashboard Admin (`app/admin/page.tsx`)    | ✅ 95 |
| Forgot Password (`app/forgot-password/page.tsx`) | ✅ 96 |
| Reset Password (`app/reset-password/page.tsx`)   | ✅ 96 |

### Catatan Perbaikan yang Sudah Dilakukan
- Menambahkan atribut `lang="id"` di `<html>`.
- Menambahkan `<title>` pada setiap halaman.
- Memberikan `alt` pada semua elemen gambar.
- Perbaikan kontras warna pada tombol & link.
- Menambahkan *underline* dan *focus style* pada link/tombol untuk navigasi keyboard.
- Uji manual navigasi dengan keyboard (`Tab`, `Enter`, `Space`) → hasil **sesuai** (tidak ada *focus trap*, urutan logis).

---

## Menjalankan Pengujian (Testing)

### 1. Unit Test (Backend API)

Tes ini akan memverifikasi logika API secara terisolasi tanpa memerlukan database asli.

```bash
npm run test:backend
```

### 2. End-to-End Test (Alur Pengguna)

Tes ini akan menjalankan "robot" yang mensimulasikan interaksi pengguna nyata di browser (login, klik, dll).

```bash
npm run test:e2e
```

Untuk melihat laporan visual hasil E2E test, jalankan:

```bash
npx playwright show-report
```

## Catatan Perkembangan

📌 **Status saat ini**:

* Aplikasi telah berhasil di-deploy ke Vercel dan berfungsi penuh secara online.

* Semua fitur inti untuk Admin dan Siswa telah selesai diimplementasikan dan diuji secara manual.

* Fitur bonus seperti notifikasi email untuk reset password dan konfirmasi pendaftaran telah berhasil diimplementasikan.

* Unit test (`Jest`) untuk API backend telah dibuat dan berhasil dijalankan.

* E2E test (`Playwright`) telah disiapkan, hanya menunggu penyelesaian masalah data untuk bisa berjalan PASS.

* Seluruh dokumen pendukung (`API Spec`, `ERD`, `Panduan Deploy`) telah diselesaikan.

📌 **Target berikutnya agar tugas selesai**:

1. Membuat **video demo aplikasi**.
2. Menambahkan **unit test & E2E test minimal**.
3. (Opsional bonus) Implementasi role granular & dashboard analitik.

---

## Tabel Progres Proyek

| Aspek Penilaian          | Detail Tugas                              | Status |
|---------------------------|-------------------------------------------|--------|
| **Kelengkapan Fitur**     | Register & Login dengan JWT                | ✅     |
|                           | CRUD Kelas untuk Admin (Create, Read, Update, Delete) | ✅ |
|                           | Student bisa melihat daftar kelas + sisa kuota | ✅ |
|                           | Student bisa mendaftar kelas (kuota real-time) | ✅ |
|                           | Admin bisa melihat daftar peserta per kelas | ✅ |
| **Desain & UX**           | Navigasi jelas, responsif                 | ✅     |
|                           | Aksesibilitas dasar (Lighthouse ≥ 91)     | ✅     |
| **Kode Backend**          | Struktur modular API Routes               | ✅     |
|                           | Validasi input & error handling           | ✅     |
|                           | Middleware JWT + role-based               | ✅     |
|                           | Keamanan dasar (hashed password, JWT secret, .env) | ✅ |
| **Kode Frontend**         | State handling (React hooks)              | ✅     |
|                           | Komponen reusable (Popup, API helper)     | ✅     |
|                           | Error handling di form & dashboard        | ✅     |
| **Testing**               | Unit test / E2E test minimal              | 	🔄     |
| **Dokumentasi**           | README proyek                             | ✅     |
|                           | API Spec (API_SPEC.md)                    | ✅     |
|                           | ERD / Arsitektur Visual                   | ✅     |
|                           | Panduan Deploy                            | ✅     |
| **Deployment & Demo**     | Deploy aplikasi online (Vercel + DB)      | ✅     |
|                           | Video demo aplikasi                       | ❌     |
| **Git Hygiene**           | Commit kecil bermakna, branching, PR/issues | 🔄 (sudah latihan, belum konsisten) |
| **Bonus (opsional)**      | Notifikasi email saat sukses daftar       | ✅     |
|                           | Role & izin granular (Admin/Staff)        | 🔄 (baru Admin & Student) |
|                           | Dashboard analitik                        | ❌     |

---