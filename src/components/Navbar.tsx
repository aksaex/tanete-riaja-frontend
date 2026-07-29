'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/#profil', label: 'Profil' },
    { href: '/#berita', label: 'Berita' },
    { href: '/#lokasi', label: 'Peta' },
    { href: '/#kontak', label: 'Kontak' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return false;
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-200/50'
          : 'bg-white/30 backdrop-blur-md border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3">
            {/* Perbaikan: gunakan width dan height eksplisit */}
            <Image
              src="/logobarru.png"
              alt="Logo Kabupaten Barru"
              width={48}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
            <div>
              <h1 className={`font-black leading-none text-lg sm:text-xl transition-colors duration-300 ${
                scrolled ? 'text-slate-900' : 'text-white'
              }`}>
                TANETE RIAJA
              </h1>
              <p className={`text-xs font-medium tracking-[0.15em] transition-colors duration-300 ${
                scrolled ? 'text-emerald-600' : 'text-emerald-200'
              }`}>
                KABUPATEN BARRU
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive(link.href)
                    ? 'text-emerald-600 bg-emerald-50'
                    : `hover:text-emerald-600 hover:bg-emerald-50/50 ${
                        scrolled ? 'text-slate-600' : 'text-white/90'
                      }`
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-white/10 transition"
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
          >
            <svg className={`w-6 h-6 transition-colors duration-300 ${
              scrolled ? 'text-slate-700' : 'text-white'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden py-4 border-t border-white/20"
          >
            <nav className="flex flex-col gap-1 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl transition ${
                    isActive(link.href)
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-white/90 hover:text-emerald-200 hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}