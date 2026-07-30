// src/app/admin/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, KeyRound, ArrowLeft } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* ===== BACKGROUND SEDERHANA ===== */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/pemandagan.png"
          alt="Background"
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-emerald-950/50" />
      </div>

      {/* ===== DECORATIVE BLUR ELEMENTS (ringan) ===== */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      {/* ===== TOMBOL KEMBALI FLOATING (ESTETIK & MINIMALIS) ===== */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute top-6 left-6 md:top-8 md:left-8 z-50"
      >
        <Link
          href="/"
          className="flex items-center justify-center w-11 h-11 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-white/50 hover:text-white transition-all duration-300 shadow-xl group"
          aria-label="Kembali ke Beranda"
          title="Kembali ke Beranda"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        </Link>
      </motion.div>

      {/* ===== KONTEN ===== */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center min-h-[90vh]">
          
          {/* ===== BRANDING (Desktop) ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden lg:block lg:col-span-2 text-white space-y-6"
          >
            <div className="relative w-28 h-28">
              <Image
                src="/logobarru.png"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight">
              Admin Panel
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Kecamatan Tanete Riaja
              </span>
            </h1>
            <p className="text-white/60 text-base max-w-sm leading-relaxed">
              Kelola berita dan informasi publik dengan aman dan efisien.
            </p>
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Terenkripsi
              </span>
              <span className="w-px h-3 bg-white/10" />
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                JWT Secure
              </span>
            </div>
          </motion.div>

          {/* ===== FORM LOGIN ===== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/30">
              
              {/* Mobile Logo */}
              <div className="flex justify-center lg:hidden mb-6">
                <div className="relative w-16 h-16">
                  <Image src="/logobarru.png" alt="Logo" fill className="object-contain" />
                </div>
              </div>

              {/* Header */}
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-white">Masuk ke Dashboard</h2>
                <p className="mt-1 text-sm text-white/40">
                  Gunakan kredensial yang diberikan oleh admin
                </p>
              </div>

              {/* Form */}
              <form className="mt-8 space-y-4" onSubmit={handleLogin}>
                {error && (
                  <div className="bg-red-500/10 border border-red-400/20 text-red-300 text-sm p-3 rounded-xl text-center">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Masukkan username"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition text-xs font-medium"
                    >
                      {showPassword ? 'Sembunyi' : 'Lihat'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-white/40 cursor-pointer">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-emerald-500" />
                    Ingat saya
                  </label>
                  <button
                    type="button"
                    className="text-white/30 hover:text-white/60 transition"
                    onClick={() => alert('Hubungi admin untuk reset password.')}
                  >
                    Lupa password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    'Masuk ke Dashboard'
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-white/5 text-center text-[10px] text-white/15">
                &copy; {new Date().getFullYear()} Kecamatan Tanete Riaja · Kabupaten Barru
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}