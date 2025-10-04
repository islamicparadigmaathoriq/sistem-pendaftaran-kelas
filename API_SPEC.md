# API_SPEC
# Spesifikasi API - Sistem Pendaftaran Kelas

Dokumen ini menjelaskan semua endpoint API yang tersedia dalam proyek ini, termasuk autentikasi, manajemen kelas oleh admin, serta interaksi siswa terhadap kelas.

---

## 1. Autentikasi & User

Endpoint yang berhubungan dengan registrasi, login, dan manajemen profil pengguna.

### POST /api/auth/register

**Deskripsi**: Mendaftarkan pengguna baru dengan role default `STUDENT`. Password akan di-*hash* sebelum disimpan.
- **Authorization**: ❌ Tidak memerlukan token.
- **Request Body**:
  ```json
  {
    "name": "Nama Lengkap User",
    "email": "user@example.com",
    "password": "password_rahasia"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
  "message": "User registered successfully",
  "user": {
    "id": "uuid-string-unik",
    "email": "user@example.com",
    "name": "Nama Lengkap User",
    "role": "STUDENT"
    }
  }
  ```
- **Error Response (409 Conflict)**: Terjadi jika email sudah terdaftar.
  ```json
  {
  "message": "User with this email already exists"
  }
  ```
---

### POST /api/auth/login

- **Deskripsi**: Memverifikasi kredensial pengguna dan mengembalikan JWT (JSON Web Token) jika berhasil.
- **Authorization**: ❌ Tidak memerlukan token.
- **Request Body**:
  ```json
  {"email": "user@example.com", "password": "password_rahasia"}
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": "uuid-string-unik",
      "email": "user@example.com",
      "name": "Nama Lengkap User",
      "role": "STUDENT"
    }
  }
  ```
- **Error Response (401 Unauthorized)**: Terjadi jika email tidak ditemukan atau password salah.
  ```json
  {
  "message": "Invalid credentials"
  }
  ```
---

### POST /api/auth/forgot-password

- **Deskripsi**: Memulai proses lupa password dan mengirim email berisi link reset.
- **Authorization**: ❌ Tidak memerlukan token.
- **Request Body**:
  ```json
  { "email": "user@example.com" }
  ```
- **Success Response (200 OK)**: Mengembalikan pesan generik untuk alasan keamanan.
  ```json
  { "message": "If user exists, a password reset link has been sent to their email." }
  ```

---

### POST /api/auth/reset-password

- **Deskripsi**: Mengganti password pengguna menggunakan token yang valid dari proses lupa password.
- **Authorization**: ❌ Tidak memerlukan token.
- **Request Body**:
  ```json
  {
  "token": "reset_token_valid",
  "newPassword": "password_baru"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  { "message": "Password has been successfully reset" }
  ```
- **Error Response (400 Bad Request)**: Token tidak valid atau sudah kedaluwarsa.
```json
{ "message": "Invalid or expired token" }
```

---

### GET /api/me

- **Deskripsi**: Mengambil data profil dari pengguna yang sedang login berdasarkan token JWT yang dikirim.
- **Authorization**: ✅ Bearer Token Dibutuhkan.
- **Success Response (200 OK)**:
  ```json
  {
    "id": "uuid-string-unik",
    "name": "Nama Lengkap User",
    "email": "user@example.com",
    "profilePicture": null,
    "createdAt": "2025-09-27T00:00:00.000Z"
  }
  ```
- **Error Response (401 Unauthorized)**: Terjadi jika token tidak ada, tidak valid, atau sudah kedaluwarsa.
  ```json
  {
  "message": "Token tidak ditemukan"
  }
  ```
---

## 2. Admin & Staff

Endpoint yang hanya bisa diakses oleh pengguna dengan role **ADMIN** atau **STAFF**. 
Semua endpoint di bagian ini memerlukan Bearer Token.

### GET /api/admin/classes

- **Deskripsi**: Mengambil daftar semua kelas yang ada.
- **Authorization**: ✅ Bearer Token Dibutuhkan (Role: `ADMIN`, `STAFF`).
- **Success Response (200 OK)**:
  ```json
  [
    {
      "id": "uuid-class-1",
      "name": "Data Analyst",
      "quota": 30,
      "available": 28,
      "description": "Program pelatihan...",
      "trainingDate": "2025-10-08T00:00:00.000Z"
    }
  ]
  ```
---

### POST /api/admin/classes

- **Deskripsi**: Membuat kelas baru. Kuota available akan otomatis diisi sama dengan quota.
- **Authorization**: ✅ Bearer Token Dibutuhkan (Role: `ADMIN`, `STAFF`).
- **Request Body**:
  ```json
  {
  "name": "AI Automation",
  "quota": 25,
  "description": "Pelajari keterampilan...",
  "trainingDate": "2025-10-24"
  }
  ```
- **Success Response (201 Created)**: Mengembalikan data kelas yang baru dibuat.
---

### PUT /api/admin/classes/[id]

- **Deskripsi**: Memperbarui data kelas berdasarkan ID-nya.
- **Authorization**: ✅ Bearer Token Dibutuhkan (Role: `ADMIN`, `STAFF`).
- **Request Body**:
  ```json
  {
    "name": "AI Automation Engineer",
    "quota": 30,
    "description": "Update deskripsi...",
    "trainingDate": "2025-10-25"
  }
  ```
- **Success Response (200 OK)**: Mengembalikan data kelas yang sudah diperbarui.
---

### DELETE /api/admin/classes/[id]

- **Deskripsi**: Menghapus data kelas berdasarkan ID-nya.
- **Authorization**: ✅ Bearer Token Dibutuhkan (Role: `ADMIN`, `STAFF`).
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Class deleted successfully"
  }
  ```
- **Error Response (409 Conflict)**: Terjadi jika kelas masih memiliki peserta terdaftar.
  ```json
  {
    "message": "Cannot delete class with existing registrations."
  }
  ```
---

### GET /api/admin/registrations/[classId]

- **Deskripsi**: Melihat daftar peserta di sebuah kelas.
- **Authorization**: ✅ Bearer Token Dibutuhkan (Role: `ADMIN`, `STAFF`).
- **Success Response (200 OK)**:
  ```json
  [
    {
      "id": "uuid-registrasi",
      "userId": "uuid-user",
      "classId": "uuid-class-yang-dicari",
      "createdAt": "2025-09-26T00:00:00.000Z",
      "user": {
        "id": "uuid-user",
        "name": "Nama Peserta",
        "email": "peserta@example.com"
      }
    }
  ]
  ```
---

### GET /api/admin/analytics

- **Deskripsi**: Mengambil data agregat untuk analitik pendaftaran harian.
- **Authorization**: ✅ Bearer Token Dibutuhkan (Role: `ADMIN`, `STAFF`).
- **Success Response (200)**:
  ```json
  {
    "labels": ["2025-10-01", "2025-10-02"],
    "data": [5, 12]
  }
  ```
---

## 3. Student

Endpoint yang digunakan oleh siswa untuk berinteraksi dengan kelas. Semua endpoint di bagian ini memerlukan Bearer Token.

### GET /api/classes

- **Deskripsi**: Mengambil daftar semua kelas yang tersedia untuk siswa. Setiap kelas memiliki properti tambahan `isRegistered` untuk menandakan apakah siswa tersebut sudah mendaftar.
- **Success Response (200 OK)**:
  ```json
  [
    {
      "id": "uuid-class-1",
      "name": "Data Analyst",
      "quota": 30,
      "available": 28,
      "description": "Program pelatihan...",
      "trainingDate": "2025-10-08T00:00:00.000Z",
      "isRegistered": true
    }
  ]
  ```
---

### POST /api/register/class

- **Deskripsi**: Mendaftarkan pengguna yang sedang login ke sebuah kelas. Proses ini bersifat atomik (menggunakan transaksi Prisma) untuk memastikan kuota berkurang dan pendaftaran dibuat secara bersamaan.
- **Request Body**:
  ```json
  {
    "classId": "uuid-class-yang-ingin-didaftar"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Registered successfully",
    "registration": {
      "id": "uuid-pendaftaran-baru",
      "userId": "uuid-user-login",
      "classId": "uuid-class-yang-ingin-didaftar",
      "createdAt": "2025-09-27T00:00:00.000Z"
    }
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "message": "No more available slots for this class" 
  }
  ```
  atau
  ```json
  {
  "message": "You are already registered for this class"
  }
  ```

---

## 4. Middleware & Catatan Teknis
Semua endpoint yang memerlukan autentikasi menggunakan **JWT**. Token dikirim melalui header `Authorization: Bearer <token>`.

---

### Aturan Role
- `role = ADMIN` atau `role = STAFF` → bisa mengakses semua endpoint yang diawali `/api/admin/**`.
- `role = STUDENT` → bisa mengakses endpoint `/api/classes` dan `/api/register/class`

---

### Error Handling
- **401 Unauthorized**: Terjadi jika token tidak ada, tidak valid, atau kedaluwarsa.  
- **403 Forbidden**: Terjadi jika peran pengguna tidak sesuai dengan yang diizinkan oleh endpoint.

---

### Teknologi yang Digunakan
- **JWT (jsonwebtoken)**: Untuk autentikasi & otorisasi.
- **bcryptjs**: Untuk hashing password. 
- **Prisma ORM**: Untuk komunikasi database (PostgreSQL). 
- **Nodemailer**: Untuk mengirim email konfirmasi & reset password.  
- **auth.ts**: Middleware kustom untuk memverifikasi JWT & peran sebelum handler API dieksekusi.

---

## 5. Infrastruktur & Komponen Pendukung

Selain endpoint API, sistem ini menggunakan beberapa komponen backend untuk mengelola database, pengiriman email, dan konfigurasi aplikasi.

### 5.1 lib/api.ts

- **Fungsi**: Helper untuk komunikasi frontend ↔ backend API.
- **Keterangan**: Menyediakan fungsi wrapper `apiGet`, `apiPost`, `apiPut`, `apiDelete` menggunakan `fetch`.  
  Secara otomatis menambahkan header `Authorization` jika token tersedia DI `localStorage`.

---

### 5.2 lib/db.ts

- **Fungsi**: Inisialisasi `PrismaClient` untuk mengakses database PostgreSQL.
- **Keterangan**: Menggunakan pola singleton untuk mencegah pembuatan koneksi ganda di lingkungan development.

---

### 5.3 lib/email.ts

- **Fungsi**: Mengirim email transaksional (reset password, notifikasi pendaftaran).
- **Keterangan**: Menggunakan `Nodemailer` dengan kredensial dari `.env`. Terdapat fungsi `sendPasswordResetEmail` dan `sendRegistrationEmail`.

---

### 5.4 prisma/schema.prisma

- **Fungsi**: Mendefinisikan skema database dengan Prisma ORM.
- **Keterangan**: erdiri dari model `User`, `Class`, dan `Registration` serta `enum Role`.
- **Contoh**:
  ```prisma
    model User {
    id               String     @id @default(uuid())
    email            String     @unique
    password         String
    name             String?
    role             Role       @default(STUDENT)
    profilePicture   String?
    createdAt        DateTime   @default(now())
    resetToken       String?
    resetTokenExpiry DateTime?
    registrations    Registration[]
  }
  model Class {
    id           String   @id @default(uuid())
    name         String
    quota        Int
    available    Int
    description  String
    trainingDate DateTime
    registrations Registration[]
  }
  model Registration {
    id        String   @id @default(uuid())
    userId    String
    classId   String
    createdAt DateTime @default(now())
    user      User     @relation(fields: [userId], references: [id])
    class     Class    @relation(fields: [classId], references: [id])

    @@unique([userId, classId])
  }

  enum Role {
    ADMIN
    STUDENT
    STAFF
  }
  ```
---

### 5.5 .env

- **Fungsi**: Menyimpan variabel konfigurasi aplikasi yang bersifat rahasia.
- **Keterangan**: File ini tidak boleh dipublikasikan ke repositori. Gunakan `.env.example` sebagai template.
- **Contoh untuk Produksi (Vercel + Supabase)**:
  ```env
  DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
  JWT_SECRET="super_secret_key"
  EMAIL_USER="youremail@gmail.com"
  EMAIL_PASS="your_gmail_app_password"
  ```
---