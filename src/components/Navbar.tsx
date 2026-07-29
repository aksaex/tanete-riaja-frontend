// src/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Nama Kecamatan */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
              TR
            </div>
            <div>
              <h1 className="font-bold text-gray-900 leading-none">TANETE RIAJA</h1>
              <p className="text-xs text-emerald-700 font-medium tracking-wider mt-1">KABUPATEN BARRU</p>
            </div>
          </Link>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-emerald-700 transition">Beranda</Link>
            <Link href="#profil" className="hover:text-emerald-700 transition">Profil Wilayah</Link>
            <Link href="#berita" className="hover:text-emerald-700 transition">Berita</Link>
            <Link href="#kontak" className="hover:text-emerald-700 transition">Kontak</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}