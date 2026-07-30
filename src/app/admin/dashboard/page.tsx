// src/app/admin/dashboard/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

// Helper fetch dengan token & handle 401
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    throw new Error('Unauthorized');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`,
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    throw new Error('Sesi habis, silakan login ulang.');
  }

  return response;
};

// Interface untuk tipe data berita
interface Berita {
  _id: string;
  judul: string;
  slug: string;
  ringkasan: string;
  konten: string;
  gambar: string;
  kategori: string;
  tanggal: string;
  penulis: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State (untuk tambah & edit)
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Pemerintahan');
  const [ringkasan, setRingkasan] = useState('');
  const [konten, setKonten] = useState('');
  const [gambarFile, setGambarFile] = useState<File | null>(null);
  const [existingGambar, setExistingGambar] = useState<string>(''); // untuk edit, menyimpan URL lama

  // Ref untuk input file (agar bisa di-reset)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ambil Data Berita
  const fetchBerita = async () => {
    try {
      const res = await fetchWithAuth(`${API_URL}/berita`);
      const data = await res.json();
      if (res.ok) {
        setBeritaList(data.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching berita:', error);
      if (error.message === 'Sesi habis, silakan login ulang.' ||
          error.message === 'Unauthorized') {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchBerita();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  // --- FUNGSI TAMBAH BERITA ---
  const resetForm = () => {
    setJudul('');
    setKategori('Pemerintahan');
    setRingkasan('');
    setKonten('');
    setGambarFile(null);
    setExistingGambar('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmitBerita = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gambarFile) {
      alert('Pilih gambar berita terlebih dahulu!');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('kategori', kategori);
    formData.append('ringkasan', ringkasan);
    formData.append('konten', konten);
    formData.append('gambar', gambarFile);

    try {
      const res = await fetchWithAuth(`${API_URL}/berita`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mempublikasikan berita');
      }

      alert('✅ Berita berhasil dipublikasikan!');
      setIsAddModalOpen(false);
      resetForm();
      fetchBerita();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      if (error.message.includes('Sesi habis')) {
        router.push('/admin/login');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // --- FUNGSI EDIT BERITA ---
  // Buka modal edit dengan data berita yang dipilih
  const handleEdit = (berita: Berita) => {
    setEditingId(berita._id);
    setJudul(berita.judul);
    setKategori(berita.kategori);
    setRingkasan(berita.ringkasan);
    setKonten(berita.konten);
    setExistingGambar(berita.gambar); // simpan URL gambar lama
    setGambarFile(null); // reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsEditModalOpen(true);
  };

  const handleUpdateBerita = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('kategori', kategori);
    formData.append('ringkasan', ringkasan);
    formData.append('konten', konten);
    // Jika ada file gambar baru, kirim; jika tidak, jangan kirim field gambar
    if (gambarFile) {
      formData.append('gambar', gambarFile);
    }

    try {
      const res = await fetchWithAuth(`${API_URL}/berita/${editingId}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal memperbarui berita');
      }

      alert('✅ Berita berhasil diperbarui!');
      setIsEditModalOpen(false);
      resetForm();
      setEditingId(null);
      fetchBerita();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      if (error.message.includes('Sesi habis')) {
        router.push('/admin/login');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // --- FUNGSI HAPUS BERITA ---
  const handleHapus = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;

    try {
      const res = await fetchWithAuth(`${API_URL}/berita/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Berita berhasil dihapus!');
        fetchBerita();
      } else {
        const data = await res.json();
        alert(data.message || 'Gagal menghapus berita.');
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      if (error.message.includes('Sesi habis')) {
        router.push('/admin/login');
      }
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
      {/* Header Admin */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">
              TR
            </div>
            <span className="font-bold text-gray-900">Admin Panel Tanete Riaja</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:text-red-700 transition"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Berita</h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola dan publikasikan berita terbaru langsung ke MongoDB & Cloudinary.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition shadow-sm"
          >
            + Buat Berita Baru
          </button>
        </div>

        {/* Tabel Berita */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Memuat data berita...</div>
          ) : beritaList.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Belum ada berita. Silakan buat berita baru.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-900 font-semibold">
                  <tr>
                    <th className="py-4 px-6">Gambar</th>
                    <th className="py-4 px-6">Judul Berita</th>
                    <th className="py-4 px-6">Kategori</th>
                    <th className="py-4 px-6">Tanggal</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {beritaList.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition">
                      <td className="py-4 px-6">
                        <img
                          src={item.gambar}
                          alt={item.judul}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-900 max-w-md">
                        {item.judul}
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-md font-medium">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500">{item.tanggal}</td>
                      <td className="py-4 px-6 text-right space-x-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleHapus(item._id)}
                          className="text-red-600 hover:underline font-medium"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ============================================================
          MODAL TAMBAH BERITA
          ============================================================ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-xl my-8">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-xl font-bold text-gray-900">Publikasikan Berita Baru</h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitBerita} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Berita</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Masukkan judul berita"
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 text-sm bg-white"
                >
                  <option value="Pemerintahan">Pemerintahan</option>
                  <option value="Pertanian">Pertanian</option>
                  <option value="Ekonomi">Ekonomi</option>
                  <option value="Wisata">Wisata</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ringkasan Singkat</label>
                <textarea
                  required
                  rows={2}
                  value={ringkasan}
                  onChange={(e) => setRingkasan(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu depan"
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konten Berita Lengkap</label>
                <textarea
                  required
                  rows={5}
                  value={konten}
                  onChange={(e) => setKonten(e.target.value)}
                  placeholder="Tuliskan isi berita selengkapnya..."
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Gambar Berita</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  required
                  accept="image/*"
                  onChange={(e) => setGambarFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white rounded-lg font-semibold transition"
                >
                  {submitting ? 'Mengunggah Gambar & Menyimpan...' : 'Publikasikan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL EDIT BERITA
          ============================================================ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-xl my-8">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-xl font-bold text-gray-900">Edit Berita</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                  setEditingId(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateBerita} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Berita</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Masukkan judul berita"
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 text-sm bg-white"
                >
                  <option value="Pemerintahan">Pemerintahan</option>
                  <option value="Pertanian">Pertanian</option>
                  <option value="Ekonomi">Ekonomi</option>
                  <option value="Wisata">Wisata</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ringkasan Singkat</label>
                <textarea
                  required
                  rows={2}
                  value={ringkasan}
                  onChange={(e) => setRingkasan(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu depan"
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konten Berita Lengkap</label>
                <textarea
                  required
                  rows={5}
                  value={konten}
                  onChange={(e) => setKonten(e.target.value)}
                  placeholder="Tuliskan isi berita selengkapnya..."
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gambar Berita Saat Ini
                </label>
                {existingGambar && (
                  <div className="mb-2">
                    <img
                      src={existingGambar}
                      alt="Gambar saat ini"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                  Ganti Gambar (opsional)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setGambarFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                <p className="text-xs text-gray-400 mt-1">Kosongkan jika tidak ingin mengganti gambar.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    resetForm();
                    setEditingId(null);
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white rounded-lg font-semibold transition"
                >
                  {submitting ? 'Menyimpan Perubahan...' : 'Update Berita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}