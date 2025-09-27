//File: lib/email.ts

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
    rejectUnauthorized: false
  }
});

export const sendRegistrationEmail = async (to: string, userName: string, className: string) => {
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
  }
};