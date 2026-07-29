// src/app/admin/dashboard/page.tsx
import Link from 'next/link';
import { mockBerita } from '@/data/mockBerita';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Admin */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">
              TR
            </div>
            <span className="font-bold text-gray-900">Admin Panel Tanete Riaja</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              Super Admin
            </span>
            <Link
              href="/admin/login"
              className="text-sm font-medium text-red-600 hover:text-red-700 transition"
            >
              Keluar
            </Link>
          </div>
        </div>
      </header>

      {/* Konten Dashboard */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Quick Stats & Action */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Berita</h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola, edit, atau tambahkan publikasi baru untuk Kecamatan Tanete Riaja.
            </p>
          </div>
          <button
            type="button"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition shadow-sm flex items-center gap-2"
          >
            <span>+</span> Buat Berita Baru
          </button>
        </div>

        {/* Tabel Berita */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-900 font-semibold">
                <tr>
                  <th className="py-4 px-6">Judul Berita</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Tanggal</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockBerita.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {item.judul}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-medium">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500">{item.tanggal}</td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <button className="text-emerald-700 hover:underline font-medium">
                        Edit
                      </button>
                      <button className="text-red-600 hover:underline font-medium">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}