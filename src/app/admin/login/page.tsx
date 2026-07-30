'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, ShieldCheck, ChevronRight } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login gagal! Periksa username dan password.');
      }

      localStorage.setItem('adminToken', data.data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.data));

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* ========== BACKGROUND ========== */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/pemandagan.png"
          alt="Pemandangan Kecamatan Tanete Riaja"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-emerald-900/40 backdrop-blur-sm" />
      </div>

      {/* ========== KONTEN ========== */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          
          {/* ===== BRANDING (Desktop) ===== */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex flex-col items-start space-y-6 text-white"
          >
            <div className="relative w-40 h-40 drop-shadow-2xl">
              <Image
                src="/logobarru.png"
                alt="Logo Kabupaten Barru"
                fill
                className="object-contain"
                priority
              />
            </div>

            <h1 className="text-4xl xl:text-5xl font-black leading-tight">
              Portal Admin
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                Kecamatan Tanete Riaja
              </span>
            </h1>

            <p className="text-lg text-white/70 max-w-md leading-relaxed">
              Kelola berita, informasi, dan layanan publik dengan aman, cepat, dan efisien.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-white/60 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Sistem Aman
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-medium text-white/60 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5" />
                Terenkripsi JWT
              </span>
            </div>
          </motion.div>

          {/* ===== FORM LOGIN ===== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md mx-auto lg:mx-0"
          >
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20">
              
              {/* Logo Mobile */}
              <div className="flex justify-center lg:hidden mb-6">
                <div className="relative w-20 h-20 drop-shadow-lg">
                  <Image
                    src="/logobarru.png"
                    alt="Logo Barru"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Header */}
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Selamat Datang
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  Masuk untuk mengelola berita dan informasi
                </p>
              </div>

              {/* Form */}
              <form className="mt-8 space-y-5" onSubmit={handleLogin}>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-400/30 text-red-100 text-sm p-3 rounded-xl text-center font-medium backdrop-blur-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username Anda"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition text-sm backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password Anda"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition text-sm backdrop-blur-sm"
                  />
                </div>

                {/* Lupa Password (UI saja) */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-white/40 hover:text-white/70 transition-colors"
                    onClick={() => alert('Hubungi admin untuk reset password.')}
                  >
                    Lupa password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-emerald-400 disabled:to-teal-400 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-700/30 hover:shadow-emerald-700/50 text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Memeriksa Kredensial...
                    </span>
                  ) : (
                    'Masuk ke Dashboard'
                  )}
                </button>
              </form>

              {/* ===== TOMBOL KEMBALI - VERSI PROFESIONAL ===== */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <Link
                  href="/"
                  className="group relative flex items-center justify-center gap-3 w-full sm:w-auto mx-auto text-sm font-medium text-white/60 hover:text-white transition-all duration-300"
                >
                  {/* Garis dekoratif kiri (desktop) */}
                  <span className="hidden sm:block flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent max-w-12" />
                  
                  <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-emerald-500/10">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span>Kembali</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </span>
                  
                  {/* Garis dekoratif kanan (desktop) */}
                  <span className="hidden sm:block flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent max-w-12" />
                </Link>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center text-[10px] text-white/20 border-t border-white/5 pt-4">
                &copy; {new Date().getFullYear()} Pemerintah Kecamatan Tanete Riaja
                <span className="hidden sm:inline"> • </span>
                <br className="sm:hidden" />
                Kabupaten Barru, Sulawesi Selatan
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}