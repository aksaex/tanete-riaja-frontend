'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockBerita } from '@/data/mockBerita';
import { motion, useInView } from 'framer-motion';

// Komponen Counter animasi
function AnimatedCounter({ target, label }: { target: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;
    const numeric = parseInt(target);
    if (isNaN(numeric)) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(numeric / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= numeric) {
        setCount(numeric);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-center p-4">
      <div className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
        {count.toLocaleString()}
      </div>
      <div className="mt-2 text-base font-medium text-slate-600">{label}</div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION - Bersih, Segar, dan Ramah Aksesibilitas */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-slate-100" />
          
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 pt-20"
          >
            <span className="inline-flex items-center gap-2 bg-emerald-100/80 border border-emerald-200 rounded-full px-5 py-2 text-xs sm:text-sm font-bold tracking-wide uppercase text-emerald-800 mb-8 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              Portal Resmi Pemerintahan
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Kecamatan <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Tanete Riaja
              </span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed">
              Mewujudkan pelayanan publik cepat & transparan, mendorong potensi
              <span className="text-emerald-700 font-bold"> pertanian unggul </span> dan
              <span className="text-teal-700 font-bold"> wisata menawan </span> di Kabupaten Barru.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link
                href="#berita"
                className="group inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40"
              >
                Jelajahi Berita
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="#statistik"
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
              >
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Profil Wilayah
              </Link>
            </div>
          </motion.div>
        </section>

        {/* STATISTIK & POTENSI */}
        <section id="statistik" className="relative -mt-16 z-20 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-slate-100 rounded-3xl p-8 shadow-2xl shadow-slate-200/50"
            >
              <AnimatedCounter target="8" label="Desa & Kelurahan" />
              <div className="hidden md:block w-px bg-slate-100 h-24 mx-auto my-auto" />
              <AnimatedCounter target="27" label="Dusun / Kampung" />
              <div className="hidden md:block w-px bg-slate-100 h-24 mx-auto my-auto" />
              <div className="text-center p-4">
                <div className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-400 bg-clip-text text-transparent">
                  Pertanian
                </div>
                <div className="mt-2 text-base font-medium text-slate-600">Potensi Unggulan</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* BERITA TERKINI */}
        <section id="berita" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm bg-emerald-50 px-4 py-1 rounded-full">
              Kabar Terbaru
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4">
              Berita & Informasi
            </h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-lg">
              Tetap terhubung dengan kegiatan pemerintahan, pembangunan, dan aktivitas masyarakat di Kecamatan Tanete Riaja.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockBerita.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Gambar Thumbnail */}
                <div className="h-56 overflow-hidden relative bg-slate-100">
                  <img
                    src={item.gambar}
                    alt={item.judul}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                  <span className="absolute top-4 left-4 bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    {item.kategori}
                  </span>
                </div>
                
                {/* Konten Berita */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {item.tanggal}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                    {item.judul}
                  </h3>
                  <p className="text-slate-600 line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {item.ringkasan}
                  </p>
                  
                  {/* UPDATE LINK DI SINI SESUAI INSTRUKSI */}
                  <Link
                    href={`/berita/${item.slug}`}
                    className="text-emerald-700 text-sm font-semibold hover:underline inline-flex items-center gap-1 mt-auto"
                  >
                    Baca Selengkapnya →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20"
            >
              Lihat Semua Berita
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}