'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockBerita, Berita } from '@/data/mockBerita';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';

// ============================================================
//  DATA STATIS KECAMATAN (VALID)
// ============================================================

const DATA_KECAMATAN = {
  nama: 'Tanete Riaja',
  kabupaten: 'Barru',
  provinsi: 'Sulawesi Selatan',
  luas: '174.29',
  luasSatuan: 'km²',
  penduduk: '26755',
  tahunPenduduk: '2024',
  camat: 'Dr. Mukti Alimin, SH. MH',
  desaKelurahan: 7,
  desa: 6,
  kelurahan: 1,
  kodePos: '90763',
  daftarDesa: [
    'Kelurahan Lompo Riaja',
    'Desa Kading',
    'Desa Lompo Tengah',
    'Desa Libureng',
    'Desa Lempang',
    'Desa Harapan',
    'Desa Mattirowalie'
  ],
  potensi: [
    { icon: '🌾', nama: 'Pertanian Padi', deskripsi: 'Sawah tadah hujan unggul di Kecamatan Tanete Riaja' },
    { icon: '🐄', nama: 'Peternakan Sapi Bali', deskripsi: 'Potensi ekonomi utama bagi petani lokal' },
    { icon: '🌴', nama: 'Perkebunan', deskripsi: 'Komoditas perkebunan unggulan' }
  ]
};

// ============================================================
//  KOMPONEN PREMIUM
// ============================================================

// 1. Animated Counter
function PremiumCounter({ target, label, icon, suffix = '' }: { target: string; label: string; icon: React.ReactNode; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;
    const numeric = parseFloat(target);
    if (isNaN(numeric)) return;
    let start = 0;
    const duration = 2500;
    const step = numeric / (duration / 16);
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

  const displayValue = Number.isInteger(count) ? count.toLocaleString() : count.toFixed(1);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className="group relative bg-white rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 border border-slate-100 shadow-lg hover:-translate-y-1"
    >
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 p-3 rounded-2xl shadow-lg shadow-emerald-500/30">
        {icon}
      </div>
      <div className="mt-6">
        <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent tracking-tight">
          {displayValue}{suffix}
        </div>
        <div className="mt-2 text-sm font-semibold text-slate-600">{label}</div>
      </div>
    </motion.div>
  );
}

// 2. Kartu Berita dengan Tilt Effect
function PremiumNewsCard({ item, index }: { item: Berita; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(0);
  const [glowY, setGlowY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setRotateX(rotateX);
    setRotateY(rotateY);
    setGlowX((x / rect.width) * 100);
    setGlowY((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 transition-all duration-500"
      style={{
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(16, 185, 129, 0.12) 0%, transparent 60%)`,
        }}
      />

      <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-emerald-400/30 to-teal-400/30 group-hover:from-emerald-400/60 group-hover:to-teal-400/60 transition duration-500" />

      <div className="relative bg-white rounded-3xl overflow-hidden">
        <div className="h-56 overflow-hidden relative bg-slate-100">
          <Image
            src={item.gambar}
            alt={item.judul}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/30">
              {item.kategori}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow relative z-10">
          <div className="flex items-center gap-2 text-sm text-slate-400 font-medium mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {item.tanggal}
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors duration-300">
            {item.judul}
          </h3>
          <p className="text-slate-500 line-clamp-3 mb-4 flex-grow leading-relaxed text-sm">
            {item.ringkasan}
          </p>
          <Link
            href={`/berita/${item.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group/link"
            aria-label={`Baca selengkapnya tentang ${item.judul}`}
          >
            <span>Baca Selengkapnya</span>
            <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

// 3. Skeleton
function PremiumSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 animate-pulse">
      <div className="h-56 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-6 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
      </div>
    </div>
  );
}

// 4. Floating Element
function FloatingElement({ children, delay = 0, duration = 6, distance = 20 }: any) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -distance, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

// 5. Slider/Carousel untuk Potensi
function PotensiSlider() {
  const potensi = DATA_KECAMATAN.potensi;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % potensi.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [potensi.length]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 p-8 border border-emerald-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">{potensi[current].icon}</div>
          <h4 className="text-2xl font-bold text-slate-900">{potensi[current].nama}</h4>
          <p className="text-slate-600 mt-2">{potensi[current].deskripsi}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-2 mt-6">
        {potensi.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === current ? 'w-8 bg-emerald-600' : 'bg-emerald-200'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
//  MAIN PAGE
// ============================================================

export default function Home() {
  const [beritaList, setBeritaList] = useState<Berita[]>(mockBerita);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  useEffect(() => {
    const fetchBerita = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/berita`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setBeritaList(json.data);
          }
        }
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBerita();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
        {/* ============================================================
            HERO SECTION – TANPA BADGE "PORTAL RESMI PEMERINTAHAN"
            ============================================================ */}
        <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <Image
              src="/pemandagan.png"
              alt="Pemandangan Kecamatan Tanete Riaja"
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={90}
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-black/40 to-teal-900/60" />

          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="heroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#heroGrid)" />
            </svg>
          </div>

          <FloatingElement delay={0} distance={25} duration={7}>
            <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-emerald-400/20 blur-3xl" />
          </FloatingElement>
          <FloatingElement delay={1.5} distance={20} duration={8}>
            <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-teal-400/20 blur-3xl" />
          </FloatingElement>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-6xl mx-auto text-center px-6 pt-10 pb-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex justify-center mb-6"
            >
              <div className="relative h-24 w-auto drop-shadow-2xl">
                <Image
                  src="/logobarru.png"
                  alt="Logo Kabupaten Barru"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]"
            >
              <span className="text-white">Kecamatan</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-200 via-teal-200 to-emerald-300 bg-clip-text text-transparent">
                {DATA_KECAMATAN.nama}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-white/80 drop-shadow-lg leading-relaxed font-light"
            >
              {DATA_KECAMATAN.kabupaten}, {DATA_KECAMATAN.provinsi}
              <span className="block text-sm text-white/60 mt-1">
                Luas {DATA_KECAMATAN.luas} {DATA_KECAMATAN.luasSatuan} · {DATA_KECAMATAN.penduduk} jiwa ({DATA_KECAMATAN.tahunPenduduk})
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-5"
            >
              <Link
                href="#berita"
                className="group inline-flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold text-base hover:bg-emerald-50 transition-all duration-300 shadow-2xl shadow-black/30 hover:shadow-emerald-500/30 hover:-translate-y-1"
              >
                <span>Jelajahi Berita</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="#profil"
                className="group inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:-translate-y-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Profil Wilayah</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mt-8 inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2 text-xs text-white/60"
            >
              <span className="font-medium">Camat:</span>
              <span className="text-white/80 font-medium">{DATA_KECAMATAN.camat}</span>
            </motion.div>
          </motion.div>
        </section>

        {/* ============================================================
            STATISTIK – DIBERI JARAK YANG PAS
            ============================================================ */}
        <section id="statistik" className="relative z-20 py-16 -mt-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            >
              <PremiumCounter
                target={DATA_KECAMATAN.desaKelurahan.toString()}
                label="Desa & Kelurahan"
                icon={
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
              />
              <PremiumCounter
                target={DATA_KECAMATAN.luas}
                label="Luas Wilayah"
                suffix={` ${DATA_KECAMATAN.luasSatuan}`}
                icon={
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                }
              />
              <PremiumCounter
                target={DATA_KECAMATAN.penduduk}
                label="Jumlah Penduduk"
                icon={
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
              />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group relative bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-3xl p-6 text-center hover:bg-white/80 transition-all duration-500 border border-amber-200/30 shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 p-2.5 rounded-2xl shadow-lg shadow-amber-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="mt-6">
                  <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent tracking-tight">
                    Pertanian
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">Potensi Unggulan</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            PROFIL WILAYAH
            ============================================================ */}
        <section id="profil" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block text-emerald-600 font-bold tracking-widest uppercase text-sm bg-emerald-50/80 backdrop-blur-sm px-5 py-2 rounded-full border border-emerald-100">
              Profil Wilayah
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-5 tracking-tight">
              Mengenal {DATA_KECAMATAN.nama}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4">Informasi Geografis</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Kabupaten</span>
                  <span className="font-medium text-slate-900">{DATA_KECAMATAN.kabupaten}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Provinsi</span>
                  <span className="font-medium text-slate-900">{DATA_KECAMATAN.provinsi}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Luas Wilayah</span>
                  <span className="font-medium text-slate-900">{DATA_KECAMATAN.luas} {DATA_KECAMATAN.luasSatuan}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Jumlah Penduduk</span>
                  <span className="font-medium text-slate-900">{DATA_KECAMATAN.penduduk} jiwa ({DATA_KECAMATAN.tahunPenduduk})</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Camat</span>
                  <span className="font-medium text-slate-900">{DATA_KECAMATAN.camat}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Kode Pos</span>
                  <span className="font-medium text-slate-900">{DATA_KECAMATAN.kodePos}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {DATA_KECAMATAN.desa} Desa + {DATA_KECAMATAN.kelurahan} Kelurahan
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {DATA_KECAMATAN.daftarDesa.map((desa, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span>{desa}</span>
                    </div>
                  ))}
                </div>
              </div>

              <PotensiSlider />
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            BERITA
            ============================================================ */}
        <section id="berita" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block text-emerald-600 font-bold tracking-widest uppercase text-sm bg-emerald-50/80 backdrop-blur-sm px-5 py-2 rounded-full border border-emerald-100">
              Kabar Terbaru
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-5 tracking-tight">
              Berita & Informasi
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-4" />
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-base font-light">
              Tetap terhubung dengan kegiatan pemerintahan, pembangunan, dan aktivitas masyarakat di Kecamatan {DATA_KECAMATAN.nama}.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <PremiumSkeleton key={i} />)
            ) : beritaList.length > 0 ? (
              beritaList.slice(0, 6).map((item, index) => (
                <PremiumNewsCard key={item.id || index} item={item} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="text-5xl mb-4">📰</div>
                <p className="text-xl text-slate-500 font-medium">Belum ada berita terbaru</p>
                <p className="text-slate-400 text-sm">Pantau terus situs ini untuk informasi terkini.</p>
              </div>
            )}
          </div>

          {!loading && beritaList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                href="/berita"
                className="group inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/30 hover:-translate-y-1"
              >
                <span>Lihat Semua Berita</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          )}
        </section>

        {/* ============================================================
            PETA LOKASI
            ============================================================ */}
        <section id="lokasi" className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block text-emerald-600 font-bold tracking-widest uppercase text-sm bg-emerald-50/80 backdrop-blur-sm px-5 py-2 rounded-full border border-emerald-100">
                Peta Wilayah
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-5 tracking-tight">
                Lokasi {DATA_KECAMATAN.nama}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-4" />
              <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-base font-light">
                {DATA_KECAMATAN.nama} terletak di bagian timur Kabupaten {DATA_KECAMATAN.kabupaten}, {DATA_KECAMATAN.provinsi}.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2 relative h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 bg-slate-100"
              >
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100 pointer-events-none">
                  <div className="text-center">
                    <svg className="w-10 h-10 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm">Memuat peta...</p>
                  </div>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25462.183914597852!2d119.6763!3d-4.4325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMjYnMzcuMCJTIDExOcKwNDAnMzUuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Peta Kecamatan ${DATA_KECAMATAN.nama}`}
                  className="relative z-10"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-50 rounded-2xl flex-shrink-0">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Alamat Kantor</h4>
                      <p className="text-sm text-slate-500 mt-1">
                        Kecamatan {DATA_KECAMATAN.nama}, Kabupaten {DATA_KECAMATAN.kabupaten}, {DATA_KECAMATAN.provinsi}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-50 rounded-2xl flex-shrink-0">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Wilayah Kecamatan</h4>
                      <p className="text-sm text-slate-500 mt-1">
                        {DATA_KECAMATAN.desaKelurahan} desa/kelurahan dengan luas {DATA_KECAMATAN.luas} {DATA_KECAMATAN.luasSatuan}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-5 border border-emerald-100/50">
                  <p className="text-xs text-slate-500 text-center">
                    📍 Klik dan geser peta untuk menjelajahi wilayah sekitar.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}