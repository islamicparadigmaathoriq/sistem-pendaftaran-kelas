// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 🚀 Abaikan error ESLint saat build di Vercel
  },
  typescript: {
    ignoreBuildErrors: true, // 🚀 Abaikan error TS saat build di Vercel
  },
};

export default nextConfig;
