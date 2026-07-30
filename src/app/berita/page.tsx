'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { NewsCard } from '@/components/NewsCard';
import { NewsSkeleton } from '@/components/NewsSkeleton';
import { API_URL } from '@/lib/api';
import { Search, X, Filter } from 'lucide-react';

interface Berita {
  _id?: string;
  id?: string;
  judul: string;
  slug: string;
  ringkasan: string;
  gambar: string;
  kategori: string;
  tanggal: string;
}

export default function BeritaPage() {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [filteredList, setFilteredList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = ['Semua', ...new Set(beritaList.map((item) => item.kategori))];

  useEffect(() => {
    const fetchAllBerita = async () => {
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
            setFilteredList(data);
          } else {
            setBeritaList([]);
            setFilteredList([]);
          }
        }
      } catch (error) {
        console.error('Gagal mengambil data berita:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBerita();
  }, []);

  // Filter & Search
  useEffect(() => {
    let result = beritaList;
    if (selectedKategori !== 'Semua') {
      result = result.filter((item) => item.kategori === selectedKategori);
    }
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((item) =>
        item.judul.toLowerCase().includes(query) ||
        item.ringkasan.toLowerCase().includes(query)
      );
    }
    setFilteredList(result);
  }, [searchQuery, selectedKategori, beritaList]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedKategori('Semua');
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Semua Berita
            </h1>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-sm sm:text-base font-light">
              Kumpulan informasi dan kegiatan terbaru seputar Kecamatan Tanete Riaja, Kabupaten Barru.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-4" />
          </motion.div>

          {/* Filter & Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 mb-10">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari judul berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition text-sm bg-slate-50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium text-sm"
              >
                <Filter className="w-4 h-4" />
                Filter Kategori
                {selectedKategori !== 'Semua' && (
                  <span className="ml-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {selectedKategori}
                  </span>
                )}
              </button>

              <div className="hidden sm:flex items-center gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedKategori(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedKategori === cat
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {(searchQuery || selectedKategori !== 'Semua') && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium underline-offset-2 hover:underline px-2"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="sm:hidden mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedKategori(cat);
                        setIsFilterOpen(false);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedKategori === cat
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
              <span>
                Menampilkan <strong className="text-slate-700">{filteredList.length}</strong> berita
                {beritaList.length > 0 && ` dari ${beritaList.length} total`}
              </span>
              {selectedKategori !== 'Semua' && (
                <span className="text-emerald-600">Kategori: {selectedKategori}</span>
              )}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <NewsSkeleton key={i} />
              ))}
            </div>
          ) : filteredList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredList.map((item, index) => (
                <NewsCard key={item._id || item.id || index} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-slate-900">Tidak Ada Berita</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                {searchQuery || selectedKategori !== 'Semua'
                  ? 'Tidak ada berita yang sesuai dengan filter Anda.'
                  : 'Belum ada berita yang dipublikasikan.'}
              </p>
              {(searchQuery || selectedKategori !== 'Semua') && (
                <button
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                >
                  Reset Filter
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}