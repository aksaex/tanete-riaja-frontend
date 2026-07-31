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
import { Calendar, ChevronLeft, Share2, Copy, Check, MessageCircle } from 'lucide-react';

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
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        console.log(`🔍 [Client] Fetching berita for slug: ${slug}`);
        const res = await fetch(`${API_URL}/berita/${slug}`, { cache: 'no-store' });
        console.log(`📡 [Client] Response status: ${res.status}`);

        if (!res.ok) {
          if (res.status === 404) {
            setNotFound(true);
          } else {
            // Jika error lain, redirect ke daftar berita
            router.push('/berita');
          }
          setLoading(false);
          return;
        }

        const json = await res.json();
        if (json.data) {
          setBerita(json.data);
        } else {
          setNotFound(true);
        }

        // Ambil berita terkait
        const resAll = await fetch(`${API_URL}/berita`, { cache: 'no-store' });
        if (resAll.ok) {
          const jsonAll = await resAll.json();
          if (jsonAll.data) {
            const filtered = jsonAll.data.filter((item: Berita) => item.slug !== slug).slice(0, 3);
            setBeritaTerkait(filtered);
          }
        }
      } catch (error) {
        console.error('❌ [Client] Error fetching detail:', error);
        setNotFound(true);
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

  const handleShareFB = () => {
    if (typeof window !== 'undefined') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    }
  };

  // --- LOADING ---
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

  // --- NOT FOUND ---
  if (notFound || !berita) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold text-slate-900">Berita Tidak Ditemukan</h1>
            <p className="text-slate-500 mt-2 text-sm">
              Maaf, artikel dengan judul atau slug yang Anda cari tidak tersedia. Mungkin telah dihapus atau dipindahkan.
            </p>
            <div className="mt-6 space-y-3">
              <Link
                href="/berita"
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali ke Daftar Berita
              </Link>
              <div className="text-xs text-slate-400">
                Slug yang dicari: <code className="bg-slate-100 px-1 py-0.5 rounded">{slug}</code>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- RENDER BERITA ---
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

          {/* Gambar */}
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

          {/* ... sisanya sama seperti sebelumnya ... */}
          {/* (Konten, Sidebar, Berita Terkait) */}
        </article>
      </main>
      <Footer />
    </div>
  );
}