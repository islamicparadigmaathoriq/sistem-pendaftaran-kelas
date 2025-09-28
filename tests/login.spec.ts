//file: tests/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

  test('should allow an admin user to log in successfully', async ({ page }) => {
    // 1. Buka halaman login
    await page.goto('/login');

    // 2. Isi form login dengan kredensial admin yang valid
    await page.getByPlaceholder('Email').fill('Dygmambep@gmail.com');
    await page.getByPlaceholder('Password').fill('12345');

    // 3. Klik tombol login
    await page.getByRole('button', { name: 'Login' }).click();

    // 4. Lakukan Pengecekan (Assert) yang lebih andal
    // PERBAIKAN: Tunggu elemen unik dari halaman admin muncul.
    // Ini adalah bukti paling kuat bahwa login dan redirect berhasil.
    await expect(page.getByText('Admin Dashboard')).toBeVisible();

    // Pengecekan URL bisa menjadi tambahan (opsional) setelahnya.
    await expect(page).toHaveURL('/admin');
  });

});

