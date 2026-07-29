// src/app/berita/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { API_URL } from '@/lib/api';
import { motion } from 'framer-motion';

interface Berita {
  _id?: string;
  id?: string;
  judul: string;
  slug: string;
  ringkasan: string;
  konten: string;
  gambar: string;
  kategori: string;
  tanggal: string;
  penulis?: string;
}

export default function DetailBeritaPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [berita, setBerita] = useState<Berita | null>(null);
  const [beritaTerkait, setBeritaTerkait] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchDetailBerita = async () => {
      setLoading(true);
      try {
        // Ambil detail berita berdasarkan slug
        const res = await fetch(`${API_URL}/berita/${slug}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setBerita(json.data);
          }
        }

        // Ambil daftar berita terkait (rekomendasi berita lainnya)
        const resAll = await fetch(`${API_URL}/berita`, { cache: 'no-store' });
        if (resAll.ok) {
          const jsonAll = await resAll.json();
          if (jsonAll.data) {
            // Filter agar berita yang sedang dibaca tidak muncul di berita terkait
            const filtered = jsonAll.data.filter((item: Berita) => item.slug !== slug);
            setBeritaTerkait(filtered.slice(0, 3));
          }
        }
      } catch (error) {
        console.error('Gagal mengambil detail berita:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailBerita();
  }, [slug]);

  // Fungsi Salin Link Berita
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Fungsi Bagikan ke WhatsApp
  const handleShareWA = () => {
    if (typeof window !== 'undefined' && berita) {
      const text = `*${berita.judul}*\n\nBaca selengkapnya di Portal Resmi Kecamatan Tanete Riaja:\n${window.location.href}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  // Fungsi Bagikan ke Facebook
  const handleShareFB = () => {
    if (typeof window !== 'undefined') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* Skeleton Loading State */}
        {loading ? (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-10 bg-slate-300 rounded-xl w-4/5"></div>
            <div className="h-6 bg-slate-200 rounded w-1/2"></div>
            <div className="h-96 bg-slate-200 rounded-3xl w-full"></div>
            <div className="space-y-3 pt-6">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>
          </div>
        ) : !berita ? (
          /* State Berita Tidak Ditemukan */
          <div className="max-w-xl mx-auto px-4 py-24 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black">
              🔍
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-3">Berita Tidak Ditemukan</h1>
            <p className="text-slate-600 mb-8">
              Maaf, artikel yang Anda cari mungkin telah dipindahkan atau belum dipublikasikan.
            </p>
            <Link
              href="/#berita"
              className="inline-flex items-center justify-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-800 transition shadow-lg shadow-emerald-900/20"
            >
              &larr; Kembali ke Beranda
            </Link>
          </div>
        ) : (
          /* ================= ARTIKEL BERITA LENGKAP ================= */
          <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Navigasi */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8 font-medium overflow-x-auto pb-2"
            >
              <Link href="/" className="hover:text-emerald-700 transition">
                Beranda
              </Link>
              <span>/</span>
              <Link href="/#berita" className="hover:text-emerald-700 transition">
                Berita
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-xs">
                {berita.judul}
              </span>
            </motion.nav>

            {/* Header Artikel */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 mb-10"
            >
              {/* Meta Top: Kategori & Tanggal */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                  {berita.kategori}
                </span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {berita.tanggal}
                </span>
              </div>

              {/* Judul Utama Berita */}
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
                {berita.judul}
              </h1>

              {/* Author / Penulis Badge */}
              <div className="flex items-center justify-between border-y border-slate-200 py-4 my-6">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    <Image
                      src="/logobarru.png"
                      alt="Logo Barru"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                      {berita.penulis || 'Humas Kecamatan Tanete Riaja'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Pemerintah Kabupaten Barru
                    </p>
                  </div>
                </div>

                {/* Tombol Akses Bagikan Cepat */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShareWA}
                    title="Bagikan ke WhatsApp"
                    className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition font-bold text-xs flex items-center gap-1.5"
                  >
                    <span>💬</span>
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    title="Salin Link Tautan"
                    className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition font-bold text-xs flex items-center gap-1.5"
                  >
                    <span>{copied ? '✅' : '🔗'}</span>
                    <span className="hidden sm:inline">{copied ? 'Tersalin!' : 'Salin Link'}</span>
                  </button>
                </div>
              </div>
            </motion.header>

            {/* Foto Utama Berita (Featured Image) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full h-[300px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 mb-12 bg-slate-900"
            >
              <img
                src={berita.gambar}
                alt={berita.judul}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* Grid Layout: Konten Utama & Sidebar Informasi */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Kolom Kiri: Isi Artikel (Lg: 8 cols) */}
              <div className="lg:col-span-8 space-y-8">
                {/* Ringkasan Singkat / Highlight Box */}
                <div className="bg-emerald-50/80 border-l-4 border-emerald-700 p-6 rounded-r-2xl text-slate-800 text-lg sm:text-xl font-bold leading-relaxed shadow-sm">
                  {berita.ringkasan}
                </div>

                {/* Body Konten Utama */}
                <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed font-normal space-y-6 text-base sm:text-lg">
                  <div className="whitespace-pre-line leading-relaxed">
                    {berita.konten}
                  </div>
                </div>

                {/* Footer Artikel & Share Bar */}
                <div className="pt-10 border-t border-slate-200 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">Bagikan Artikel Ini</h4>
                      <p className="text-xs text-slate-500">Bantu sebarluaskan informasi publik resmi Tanete Riaja</p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={handleShareWA}
                        className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
                      >
                        Bagikan WA
                      </button>
                      <button
                        onClick={handleShareFB}
                        className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
                      >
                        Facebook
                      </button>
                      <button
                        onClick={handleCopyLink}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1"
                      >
                        {copied ? '✅ Tersalin' : '🔗 Salin'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/#berita"
                      className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-extrabold text-sm group"
                    >
                      <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
                      Kembali ke Daftar Berita Utama
                    </Link>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Sidebar Informasi Kantor & Pemetaan (Lg: 4 cols) */}
              <aside className="lg:col-span-4 space-y-6">
                {/* Card Kontak Informasi Kecamatan */}
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-10 flex-shrink-0">
                        <Image
                          src="/logobarru.png"
                          alt="Logo Barru"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Pemerintah Kabupaten Barru</p>
                        <h4 className="text-sm font-extrabold text-white">Kecamatan Tanete Riaja</h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                      Pusat pelayanan masyarakat & informasi berita resmi pemerintahan lokal.
                    </p>

                    <div className="space-y-2 text-xs text-slate-300 pt-2">
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">📍</span>
                        <span>Ralla, Kelurahan Lompo Riaja, Kec. Tanete Riaja, Kab. Barru</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">🕒</span>
                        <span>Senin - Jumat (08.00 - 16.00 WITA)</span>
                      </div>
                    </div>

                    <Link
                      href="/#pemetaan"
                      className="block text-center w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-emerald-950/50 mt-4"
                    >
                      Lihat Peta Lokasi Kantor &rarr;
                    </Link>
                  </div>
                </div>

                {/* Banner Portal Pelayanan */}
                <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow-lg border border-emerald-700/50">
                  <h4 className="text-lg font-extrabold mb-2">Butuh Layanan Administrasi?</h4>
                  <p className="text-xs text-emerald-100 leading-relaxed mb-4">
                    Urus surat keterangan, verifikasi kependudukan, atau izin usaha mikro tanpa antre.
                  </p>
                  <Link
                    href="/#layanan"
                    className="inline-block bg-white text-emerald-900 font-black text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow-md"
                  >
                    Akses Layanan Digital &rarr;
                  </Link>
                </div>
              </aside>
            </div>

            {/* ================= SEKSI BERITA TERKAIT / REKOMENDASI ================= */}
            {beritaTerkait.length > 0 && (
              <section className="mt-20 pt-12 border-t border-slate-200">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-100 px-3 py-1 rounded-full">
                      Rekomendasi
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                      Berita Terkait Lainnya
                    </h3>
                  </div>
                  <Link
                    href="/#berita"
                    className="text-xs sm:text-sm font-bold text-emerald-700 hover:underline hidden sm:block"
                  >
                    Lihat Semua &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {beritaTerkait.map((item, index) => (
                    <Link
                      key={item._id || item.id || index}
                      href={`/berita/${item.slug}`}
                      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      <div className="h-44 overflow-hidden relative bg-slate-100">
                        <img
                          src={item.gambar}
                          alt={item.judul}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 bg-emerald-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                          {item.kategori}
                        </span>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <span className="text-[11px] text-slate-400 font-semibold mb-2">
                          {item.tanggal}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-base line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors mb-2">
                          {item.judul}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-auto">
                          {item.ringkasan}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}