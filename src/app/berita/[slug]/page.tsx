// src/app/berita/[slug]/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockBerita } from '@/data/mockBerita';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DetailBerita({ params }: Props) {
  // Await params di Next.js terbaru
  const { slug } = await params;

  // Cari berita yang cocok dengan URL slug
  const berita = mockBerita.find((item) => item.slug === slug);

  // Jika berita tidak ditemukan, tampilkan halaman 404
  if (!berita) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Berita */}
          <div className="p-8 sm:p-12 border-b border-gray-100">
            <div className="flex items-center gap-3 text-sm mb-4">
              <span className="bg-emerald-700 text-white font-semibold px-3 py-1 rounded-full text-xs">
                {berita.kategori}
              </span>
              <span className="text-gray-400">&bull;</span>
              <span className="text-gray-500 font-medium">{berita.tanggal}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              {berita.judul}
            </h1>
          </div>

          {/* Gambar Berita */}
          <div className="h-96 w-full bg-gray-200 overflow-hidden">
            <img 
              src={berita.gambar} 
              alt={berita.judul} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Konten Berita */}
          <div className="p-8 sm:p-12 prose prose-emerald max-w-none text-gray-700 leading-relaxed text-lg">
            <p className="font-semibold text-gray-900 mb-4">
              {berita.ringkasan}
            </p>
            <p>
              Pemerintah Kecamatan Tanete Riaja terus berupaya mengoptimalkan seluruh potensi wilayah dan pelayanan publik. Kegiatan ini merupakan bagian dari komitmen nyata untuk kesejahteraan masyarakat di Kabupaten Barru.
            </p>
            <p className="mt-4">
              (Konten selengkapnya akan diubah dan diisi melalui Admin Panel secara dinamis oleh petugas kecamatan setelah database terhubung).
            </p>
          </div>

          {/* Footer Artikel & Tombol Kembali */}
          <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <Link
              href="/#berita"
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-2"
            >
              &larr; Kembali ke Beranda
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}