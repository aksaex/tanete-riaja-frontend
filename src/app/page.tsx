'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { API_URL } from '@/lib/api';
import {
  MapPin,
  Calendar,
  Users,
  Ruler,
  ChevronRight,
  Newspaper,
  Landmark,
  Map,
  Move,
} from 'lucide-react'; // tambahkan Map dan Move

// ============================================================
//  TIPE & DATA MOCK
// ============================================================
interface Berita {
  id?: string;
  _id?: string;
  judul: string;
  slug: string;
  ringkasan: string;
  gambar: string;
  kategori: string;
  tanggal: string;
}

const mockBerita: Berita[] = [
  {
    id: '1',
    judul: 'Panen Raya Padi di Desa Kading',
    slug: 'panen-raya-padi-desa-kading',
    ringkasan: 'Petani di Desa Kading berhasil panen raya dengan hasil melimpah berkat program irigasi baru.',
    gambar: 'https://picsum.photos/seed/padi/800/400',
    kategori: 'Pertanian',
    tanggal: '28 Juli 2026',
  },
  {
    id: '2',
    judul: 'Musyawarah Perencanaan Pembangunan Desa',
    slug: 'musyawarah-perencanaan-pembangunan-desa',
    ringkasan: 'Kegiatan musrenbangdes di seluruh desa se-Kecamatan Tanete Riaja berjalan lancar dan partisipatif.',
    gambar: 'https://picsum.photos/seed/musrenbang/800/400',
    kategori: 'Pemerintahan',
    tanggal: '25 Juli 2026',
  },
  {
    id: '3',
    judul: 'Pelatihan Peternakan Sapi Bali untuk Pemuda',
    slug: 'pelatihan-peternakan-sapi-bali',
    ringkasan: 'Dinas Peternakan mengadakan pelatihan budidaya sapi Bali bagi generasi muda di Kecamatan Tanete Riaja.',
    gambar: 'https://picsum.photos/seed/sapi/800/400',
    kategori: 'Pendidikan',
    tanggal: '20 Juli 2026',
  },
];

// ============================================================
//  DATA STATIS KECAMATAN
// ============================================================
const DATA_KECAMATAN = {
  nama: 'Tanete Riaja',
  kabupaten: 'Barru',
  provinsi: 'Sulawesi Selatan',
  negara: 'Indonesia',
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
    'Desa Mattirowalie',
  ],
  potensi: [
    { icon: '🌾', nama: 'Pertanian Padi', deskripsi: 'Sawah tadah hujan unggul' },
    { icon: '🐄', nama: 'Peternakan Sapi Bali', deskripsi: 'Potensi ekonomi utama' },
    { icon: '🌴', nama: 'Perkebunan', deskripsi: 'Komoditas unggulan' },
  ],
};

// ============================================================
//  KOMPONEN UI (NewsCard dan NewsSkeleton)
// ============================================================

function NewsCard({ item, index }: { item: Berita; index: number }) {
  const [imgSrc, setImgSrc] = useState(item.gambar || '/pemandagan.png');

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={imgSrc}
          alt={item.judul}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc('/pemandagan.png')}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {item.kategori}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-2">
          <Calendar className="w-3.5 h-3.5" />
          {item.tanggal}
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {item.judul}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{item.ringkasan}</p>
        <Link
          href={`/berita/${item.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          Baca <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  );
}

function NewsSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-slate-200 rounded w-1/4" />
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
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

  useEffect(() => {
    const fetchBerita = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/berita`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            const data = json.data.map((item: any) => ({
              ...item,
              gambar: item.gambar?.includes('unsplash.com')
                ? `https://picsum.photos/seed/${item.slug || 'default'}/800/400`
                : item.gambar || '/pemandagan.png',
            }));
            setBeritaList(data);
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />

      <main className="flex-grow">
        {/* ============================================================
            HERO SECTION
            ============================================================ */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/pemandagan.png"
              alt="Pemandangan Kecamatan Tanete Riaja"
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-900/80" />
          </div>

          <div className="relative z-10 max-w-5xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
                Kecamatan{' '}
                <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  {DATA_KECAMATAN.nama}
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light">
                {DATA_KECAMATAN.kabupaten}, {DATA_KECAMATAN.provinsi}, {DATA_KECAMATAN.negara}
              </p>

              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base text-white/70">
                <span className="flex items-center gap-1.5">
                  <Ruler className="w-4 h-4" /> {DATA_KECAMATAN.luas} {DATA_KECAMATAN.luasSatuan}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> {DATA_KECAMATAN.penduduk} jiwa
                </span>
                <span className="flex items-center gap-1.5">
                  <Landmark className="w-4 h-4" /> {DATA_KECAMATAN.camat}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link
                  href="#berita"
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-emerald-50 transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                >
                  <Newspaper className="w-4 h-4" />
                  Jelajahi Berita
                </Link>
                <Link
                  href="#profil"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-white/20 transition-all hover:-translate-y-0.5"
                >
                  <MapPin className="w-4 h-4" />
                  Profil Wilayah
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            PROFIL WILAYAH
            ============================================================ */}
        <section id="profil" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block text-emerald-600 font-bold tracking-widest text-xs uppercase bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
              Profil Wilayah
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-4 tracking-tight">
              Mengenal {DATA_KECAMATAN.nama}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-3" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">Informasi Geografis</h3>
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
                  <span className="font-medium text-slate-900">
                    {DATA_KECAMATAN.luas} {DATA_KECAMATAN.luasSatuan}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Jumlah Penduduk</span>
                  <span className="font-medium text-slate-900">
                    {DATA_KECAMATAN.penduduk} jiwa ({DATA_KECAMATAN.tahunPenduduk})
                  </span>
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
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {DATA_KECAMATAN.desa} Desa + {DATA_KECAMATAN.kelurahan} Kelurahan
                </h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {DATA_KECAMATAN.daftarDesa.map((desa, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span>{desa}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Potensi Unggulan</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {DATA_KECAMATAN.potensi.map((item, idx) => (
                    <div key={idx}>
                      <div className="text-3xl mb-1">{item.icon}</div>
                      <div className="text-xs font-semibold text-slate-700">{item.nama}</div>
                      <div className="text-[10px] text-slate-500">{item.deskripsi}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            BERITA
            ============================================================ */}
        <section id="berita" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block text-emerald-600 font-bold tracking-widest text-xs uppercase bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
              Kabar Terbaru
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-4 tracking-tight">
              Berita & Informasi
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-3" />
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-sm font-light">
              Tetap terhubung dengan kegiatan pemerintahan dan masyarakat di Kecamatan {DATA_KECAMATAN.nama}.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <NewsSkeleton key={i} />)
            ) : beritaList.length > 0 ? (
              beritaList.slice(0, 6).map((item, index) => (
                <NewsCard key={item.id || item._id || index} item={item} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-4xl mb-3">📰</div>
                <p className="text-slate-500 font-medium">Belum ada berita terbaru</p>
              </div>
            )}
          </div>

          {!loading && beritaList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Link
                href="/berita"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Lihat Semua Berita
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </section>

        {/* ============================================================
            PETA LOKASI – PREMIUM VERSION (REVISI SATELIT & BATAS WILAYAH)
            ============================================================ */}
        <section id="lokasi" className="py-16 bg-white border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <span className="inline-block text-emerald-600 font-bold tracking-widest text-xs uppercase bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                Peta Wilayah
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-4 tracking-tight">
                Lokasi {DATA_KECAMATAN.nama}
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-3" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2 relative h-[400px] rounded-2xl overflow-hidden shadow-lg shadow-slate-200/60 border border-slate-100 bg-slate-100 group"
              >
                {/* 
                  REVISI IFRAME:
                  q = Query pencarian nama kecamatan (memancing Google menampilkan garis batas)
                  t = h (Hybrid: Citra satelit + label jalan & tempat)
                  z = 13 (Zoom level standar kecamatan)
                  output = embed
                */}
                <iframe
                  src={`https://maps.google.com/maps?q=Kecamatan ${DATA_KECAMATAN.nama}, ${DATA_KECAMATAN.kabupaten}&t=h&z=13&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Peta Kecamatan ${DATA_KECAMATAN.nama}`}
                  className="relative z-10"
                />

                {/* Badge lokasi mengambang */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-sm pl-2.5 pr-4 py-2 rounded-full shadow-md border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">{DATA_KECAMATAN.nama}</span>
                </div>

                {/* Hint interaksi */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Move className="w-3 h-3 text-slate-400" />
                  <span className="text-[11px] text-slate-500 font-medium">Geser untuk eksplorasi</span>
                </div>

                <div className="absolute inset-0 z-20 pointer-events-none rounded-2xl ring-1 ring-inset ring-black/5" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 flex-shrink-0">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Alamat Kantor</h4>
                      <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                        Kecamatan {DATA_KECAMATAN.nama}, Kabupaten {DATA_KECAMATAN.kabupaten}, {DATA_KECAMATAN.provinsi}, {DATA_KECAMATAN.negara}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600 flex-shrink-0">
                      <Map className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Wilayah</h4>
                      <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                        {DATA_KECAMATAN.desaKelurahan} desa/kelurahan, luas {DATA_KECAMATAN.luas} {DATA_KECAMATAN.luasSatuan}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mini stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3.5 text-center border border-emerald-100/60">
                    <p className="text-xl font-bold text-slate-900">{DATA_KECAMATAN.desaKelurahan}</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Kelurahan</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3.5 text-center border border-emerald-100/60">
                    <p className="text-xl font-bold text-slate-900">{DATA_KECAMATAN.luas}</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{DATA_KECAMATAN.luasSatuan}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* ✅ BUNGKUS FOOTER DENGAN SECTION id="kontak" */}
      <section id="kontak" className="scroll-mt-20">
        <Footer />
      </section>
    </div>
  );
}