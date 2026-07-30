'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { NewsCard } from '@/components/NewsCard';
import { API_URL } from '@/lib/api';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, Share2, Copy, Check, MessageCircle } from 'lucide-react'; // ❌ Hapus Facebook

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
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/berita/${slug}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setBerita(json.data);
          } else {
            router.push('/berita');
            return;
          }
        } else {
          router.push('/berita');
          return;
        }

        const resAll = await fetch(`${API_URL}/berita`, { cache: 'no-store' });
        if (resAll.ok) {
          const jsonAll = await resAll.json();
          if (jsonAll.data) {
            const filtered = jsonAll.data
              .filter((item: Berita) => item.slug !== slug)
              .slice(0, 3);
            setBeritaTerkait(filtered);
          }
        }
      } catch (error) {
        console.error('Gagal mengambil detail berita:', error);
        router.push('/berita');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug, router]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWA = () => {
    if (typeof window !== 'undefined' && berita) {
      const text = `*${berita.judul}*\n\nBaca selengkapnya di Portal Resmi Kecamatan Tanete Riaja:\n${window.location.href}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  // 🔥 Ganti Facebook dengan fungsi share ke FB menggunakan URL
  const handleShareFB = () => {
    if (typeof window !== 'undefined') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-10 bg-slate-300 rounded-xl w-4/5" />
            <div className="h-6 bg-slate-200 rounded w-1/2" />
            <div className="h-96 bg-slate-200 rounded-3xl" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-slate-900">Berita Tidak Ditemukan</h1>
            <p className="text-slate-500 mt-2">Artikel yang Anda cari mungkin telah dihapus atau dipindahkan.</p>
            <Link href="/berita" className="mt-6 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium">
              <ChevronLeft className="w-4 h-4" /> Kembali ke Daftar Berita
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium"
          >
            <Link href="/" className="hover:text-emerald-600 transition">Beranda</Link>
            <span>/</span>
            <Link href="/berita" className="hover:text-emerald-600 transition">Berita</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-[200px]">{berita.judul}</span>
          </motion.nav>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 mb-10"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                {berita.kategori}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                {berita.tanggal}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
              {berita.judul}
            </h1>

            {/* Author & Share */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                  <Image src="/logobarru.png" alt="Logo Barru" fill className="object-contain p-1" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 uppercase">
                    {berita.penulis || 'Humas Kecamatan Tanete Riaja'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">Pemerintah Kabupaten Barru</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareWA}
                  className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition text-xs font-bold flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>
                {/* 🔥 Tombol Facebook dengan ikon Share2 (atau bisa pakai SVG manual) */}
                <button
                  onClick={handleShareFB}
                  className="p-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition text-xs font-bold flex items-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Facebook</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition text-xs font-bold flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copied ? 'Tersalin!' : 'Salin Link'}</span>
                </button>
              </div>
            </div>
          </motion.header>

          {/* Gambar Utama */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full h-[300px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 mb-12 bg-slate-900"
          >
            <img
              src={imgError ? '/pemandagan.png' : berita.gambar}
              alt={berita.judul}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Konten */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-emerald-50/80 border-l-4 border-emerald-700 p-6 rounded-r-2xl text-slate-800 text-lg font-bold leading-relaxed shadow-sm">
                {berita.ringkasan}
              </div>

              <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-6 text-base sm:text-lg">
                <div className="whitespace-pre-line leading-relaxed">{berita.konten}</div>
              </div>

              <div className="pt-10 border-t border-slate-200 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Bagikan Artikel Ini</h4>
                    <p className="text-xs text-slate-500">Bantu sebarluaskan informasi publik</p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleShareWA}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" /> WA
                    </button>
                    <button
                      onClick={handleShareFB}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" /> FB
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Tersalin' : 'Salin'}
                    </button>
                  </div>
                </div>

                <Link href="/berita" className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-bold text-sm group">
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Kembali ke Daftar Berita
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-10 flex-shrink-0">
                      <Image src="/logobarru.png" alt="Logo Barru" fill className="object-contain" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Pemerintah Kabupaten Barru</p>
                      <h4 className="text-sm font-bold text-white">Kecamatan Tanete Riaja</h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                    Pusat pelayanan masyarakat & informasi berita resmi pemerintahan lokal.
                  </p>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">📍</span>
                      <span>Ralla, Kelurahan Lompo Riaja, Kec. Tanete Riaja, Kab. Barru</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">🕒</span>
                      <span>Senin - Jumat (08.00 - 16.00 WITA)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow-lg border border-emerald-700/50">
                <h4 className="text-lg font-bold mb-2">Butuh Layanan Administrasi?</h4>
                <p className="text-xs text-emerald-100 leading-relaxed mb-4">
                  Urus surat keterangan, verifikasi kependudukan, atau izin usaha mikro tanpa antre.
                </p>
                <Link href="/#kontak" className="inline-block bg-white text-emerald-900 font-black text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow-md">
                  Akses Layanan Digital →
                </Link>
              </div>
            </aside>
          </div>

          {/* Berita Terkait */}
          {beritaTerkait.length > 0 && (
            <section className="mt-20 pt-12 border-t border-slate-200">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-100 px-3 py-1 rounded-full">
                    Rekomendasi
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Berita Terkait Lainnya</h3>
                </div>
                <Link href="/berita" className="text-sm font-bold text-emerald-700 hover:underline hidden sm:block">
                  Lihat Semua →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {beritaTerkait.map((item, index) => (
                  <NewsCard key={item._id || item.id || index} item={item} index={index} />
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}