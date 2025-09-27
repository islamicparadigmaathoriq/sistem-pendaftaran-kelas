# Sistem Pendaftaran Kelas dengan Kuota Real-time

## Deskripsi singkat

Aplikasi web untuk pendaftaran kelas yang menampilkan kuota real-time.
Siswa dapat mendaftar kelas, melihat sisa kuota, dan menerima konfirmasi.
Admin dapat membuat, mengedit, menghapus kelas, serta melihat daftar peserta.

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
9. [Panduan Deploy Singkat](#panduan-deploy-singkat)
10. [Troubleshooting umum](#troubleshooting-umum)
11. [Kontribusi](#kontribusi)
12. [License](#license)
13. [Catatan Perkembangan](#catatan-perkembangan)

---

## Fitur Utama

* Registrasi & Login (JWT)
* CRUD Kelas (Admin)
* Lihat daftar kelas + sisa kuota (Student)
* Pendaftaran kelas dengan kuota real-time (transaksi atomik dengan Prisma)
* Reset password (forgot / reset)
* Notifikasi email (Nodemailer) — konfigurasi diperlukan agar email benar-benar terkirim

---

## Stack Teknologi

* Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS
* Backend: Next.js API Routes, Prisma (PostgreSQL)
* Auth: bcryptjs + JWT
* Email: Nodemailer
* Database: PostgreSQL

---

## Prasyarat

Pastikan terpasang di mesin lokal:

* Node.js (v18+ direkomendasikan)
* npm (atau yarn)
* PostgreSQL (atau gunakan layanan hosted seperti Railway / Supabase)
* Git

---

## Instalasi & Menjalankan Secara Lokal

Ikuti langkah berikut dari terminal (Linux / macOS / WSL) atau PowerShell (Windows):

1. Clone repository

```bash
git clone <REPO_URL>
cd sistem-pendaftaran-kelas
```

2. Buat branch baru (opsional, direkomendasikan)

```bash
git checkout -b docs/readme
```

3. Install dependencies

```bash
npm install
```

4. Buat file environment dari contoh

```bash
# macOS / Linux
cp .env.example .env

# Windows (PowerShell)
copy .env.example .env
```

5. Edit `.env` dan isi variabel lingkungan (lihat bagian "Variabel Lingkungan")

6. Jalankan migrasi database (Prisma)

```bash
npx prisma migrate dev --name init
```

> Jika ini pertama kali menghubungkan ke database, Prisma akan membuat tabel sesuai skema.

7. Jalankan aplikasi

```bash
npm run dev
```

Buka browser: `http://localhost:3000`

---

## Variabel Lingkungan (.env)

Buat file `.env` di root project dengan isi minimal seperti berikut (contoh):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sistem-pendaftaran-db"
JWT_SECRET="ganti_dengan_string_acak_yang_kuat"
EMAIL_USER=email_pengirim@example.com
EMAIL_PASS=app_password_or_smtp_password
```

**Catatan penting untuk EMAIL_PASS:**

* Jika memakai Gmail, buat *App Password* (Google Account → Security → App passwords) dan pakai nilai tersebut.
* Untuk testing lokal yang mudah, gunakan Mailtrap atau layanan SMTP testing.

---

## Database & Prisma

Skema Prisma sudah disiapkan di `prisma/schema.prisma`.

* Jalankan migrasi: `npx prisma migrate dev --name init`
* Jalankan Prisma Studio untuk melihat data: `npx prisma studio`

Jika ingin menambah seed data, buat skrip seed sesuai kebutuhan dan jalankan `npx prisma db seed` (jika sudah dikonfigurasi).

---

## Script NPM Penting

Beberapa script yang mungkin ada di `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
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

## Panduan Deploy Singkat

Saran deploy:

* Frontend + API: **Vercel** (Next.js sangat cocok)
* Database: **Railway** atau **Supabase** (saya menggunakan PostgreSQL)

Langkah ringkas:

1. Push repo ke GitHub.
2. Daftar di Vercel, hubungkan repo.
3. Atur environment variables di Vercel sesuai `.env`.
4. Atur database di Railway/Supabase dan update `DATABASE_URL` di Vercel.
5. Deploy.

> Catatan: Email (Nodemailer) sering diblokir saat dites dari `localhost` oleh penyedia email. Sebaiknya atur App Password (Gmail) atau gunakan layanan SMTP tepercaya saat deploy.

---

## Troubleshooting Umum

* **500 / Token invalid** → cek `JWT_SECRET` di env.
* **Email tidak terkirim** → cek `EMAIL_USER`/`EMAIL_PASS`, gunakan App Password atau Mailtrap.
* **Prisma P2025 (not found)** → pastikan data exist sebelum update/delete.
* **Prisma connection error** → cek `DATABASE_URL` dan apakah server Postgres berjalan.

---

## Kontribusi

Silakan buat branch baru (mis. `feature/xxx` atau `fix/yyy`), commit kecil & buat PR ke `main`.

Contoh workflow:

```bash
git checkout -b feature/readme
git add README.md
git commit -m "docs: add README installation guide"
git push -u origin feature/readme
```

---

## License

Proyek ini dibuat untuk keperluan tugas pada mata kuliah Pemrograman Berbasis Web.
Hak cipta © 2025 islamicparadigmaathoriq.

---

## Catatan Perkembangan

📌 **Status saat ini**:

* README awal sudah dibuat.
* `.env.example` sudah ditambahkan dan `.env` di-ignore.
* GitHub repo sudah terbentuk.
* Workflow Git (branch + PR) sedang dipelajari.
* Testing email dengan Nodemailer sudah **berhasil secara lokal** menggunakan Gmail App Password.
* Branch `chore/testing` dibuat untuk menyimpan `scripts/test-email.js` (PR tidak di-merge ke `main` agar tetap jadi catatan progres).
* Dokumentasi API Spec, ERD visual, dan panduan deploy detail masih perlu ditambahkan.
* Deployment (Vercel + Railway/Supabase) dan video demo masih pending.

📌 **Target berikutnya agar tugas selesai**:

1. Menyusun **API Spec formal**.
2. Membuat **ERD / Arsitektur visual**.
3. Menambahkan **Panduan Deploy** lebih lengkap.
4. Menyusun **video demo aplikasi**.
