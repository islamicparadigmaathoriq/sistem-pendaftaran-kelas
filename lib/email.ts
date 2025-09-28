// File: lib/email.ts

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Muat variabel lingkungan
dotenv.config();

// Konfigurasi transporter email
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // gunakan 465 untuk SSL
  secure: true, // true = pakai SSL/TLS
  auth: {
    user: process.env.EMAIL_USER, // Alamat email pengirim
    pass: process.env.EMAIL_PASS, // Kata sandi atau App Password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendRegistrationEmail = async (
  to: string,
  userName: string,
  className: string
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: `Konfirmasi Pendaftaran Kelas ${className}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4CAF50;">Pendaftaran Berhasil!</h2>
        <p>Halo, <strong>${userName}</strong>,</p>
        <p>Selamat! Pendaftaran Anda untuk kelas <strong>${className}</strong> telah berhasil dikonfirmasi.</p>
        <p>Terima kasih telah mendaftar. Sampai jumpa di kelas!</p>
        <p>Salam hangat,<br>Tim Pelatihan</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email konfirmasi berhasil dikirim ke ${to}`);
  } catch (error) {
    console.error(`Gagal mengirim email konfirmasi ke ${to}:`, error);
    // PERUBAHAN: Melemparkan error agar API tahu jika pengiriman gagal
    throw new Error('Gagal mengirim email konfirmasi.');
  }
};

// PERUBAHAN: Menambahkan fungsi baru untuk mengirim email reset password
export const sendPasswordResetEmail = async (to: string, resetUrl: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Link Reset Password Anda',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #007bff;">Reset Password</h2>
        <p>Halo,</p>
        <p>Anda menerima email ini karena ada permintaan untuk mereset password akun Anda.</p>
        <p>Silakan klik tautan di bawah ini untuk melanjutkan:</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password Sekarang</a>
        </p>
        <p>Jika Anda tidak merasa meminta reset password, abaikan saja email ini.</p>
        <p>Salam,<br>Tim Sistem Pendaftaran</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email reset password berhasil dikirim ke ${to}`);
  } catch (error) {
    console.error(`Gagal mengirim email reset password ke ${to}: `, error);
    // PERUBAHAN: Melemparkan error agar API tahu jika pengiriman gagal
    // Ini penting agar pengguna di frontend tahu jika ada masalah.
    throw new Error('Gagal mengirim email reset password.');
  }
};
