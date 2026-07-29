// src/lib/api.ts

// Alamat API Backend lokal kita (nanti saat di-vercel kita tinggal ubah di environment variable)
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';