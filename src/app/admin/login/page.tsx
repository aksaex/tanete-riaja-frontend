// src/app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simulasi login sementara untuk 2 akun admin sebelum terhubung ke backend
    if (
      (username === 'admin' && password === 'admin123') ||
      (username === 'superadmin' && password === 'superadmin123')
    ) {
      // Redirect ke Dashboard jika berhasil
      router.push('/admin/dashboard');
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-md border border-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-700 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-md">
            TR
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
            Login Portal Admin
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Kecamatan Tanete Riaja, Kabupaten Barru
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg text-sm"
            >
              Masuk ke Dashboard
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-emerald-700 transition"
            >
              &larr; Kembali ke Situs Utama
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}