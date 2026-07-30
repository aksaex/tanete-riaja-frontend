'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react'; // atau gunakan SVG manual

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 20);
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

  // Cek apakah link aktif (hanya untuk '/' saja, atau bisa diperluas)
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    // Untuk hash link, kita tidak bisa mendeteksi secara langsung, jadi kita abaikan
    return false;
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] border-b border-slate-200/30'
            : 'bg-transparent backdrop-blur-none border-b border-white/10'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo dan Nama */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Kembali ke Beranda"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
              <Image
                src="/logobarru.png"
                alt="Logo Kabupaten Barru"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <h1
                className={`
                  font-black text-lg sm:text-xl transition-colors duration-300
                  ${scrolled ? 'text-slate-900' : 'text-white'}
                `}
              >
                TANETE RIAJA
              </h1>
              <p
                className={`
                  text-[10px] sm:text-xs font-semibold tracking-[0.2em] transition-colors duration-300
                  ${scrolled ? 'text-emerald-600' : 'text-emerald-200/80'}
                `}
              >
                KABUPATEN BARRU
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi utama">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${
                      active
                        ? 'text-emerald-700 bg-emerald-50/80'
                        : scrolled
                        ? 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald-500 rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              md:hidden p-2 rounded-xl transition-colors duration-300
              ${scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'}
            `}
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - AnimatePresence for smooth exit */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`
              md:hidden overflow-hidden
              ${scrolled ? 'bg-white/95 backdrop-blur-xl' : 'bg-slate-900/80 backdrop-blur-xl'}
            `}
          >
            <div className="px-4 py-4 space-y-1 border-t border-slate-200/20">
              {navLinks.map((link, index) => {
                const active = isActive(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200
                        ${
                          active
                            ? 'text-emerald-700 bg-emerald-50/80'
                            : scrolled
                            ? 'text-slate-700 hover:bg-slate-50'
                            : 'text-white/90 hover:bg-white/10'
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}