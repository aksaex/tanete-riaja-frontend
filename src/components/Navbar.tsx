'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Home, Info, Newspaper, MapPin, Phone } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('/');
  const pathname = usePathname();

  // Nav links dengan ID untuk intersection observer
  const navLinks = [
    { href: '/', label: 'Beranda', icon: Home, sectionId: 'hero' },
    { href: '/#profil', label: 'Profil', icon: Info, sectionId: 'profil' },
    { href: '/#berita', label: 'Berita', icon: Newspaper, sectionId: 'berita' },
    { href: '/#lokasi', label: 'Peta', icon: MapPin, sectionId: 'lokasi' },
    { href: '/#kontak', label: 'Kontak', icon: Phone, sectionId: 'kontak' },
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer untuk deteksi section aktif
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Cari section yang paling terlihat
        let maxRatio = 0;
        let activeId = '/';

        entries.forEach((entry) => {
          const id = entry.target.id;
          // Cari link yang sesuai dengan section ID
          const link = navLinks.find((l) => l.sectionId === id);
          if (!link) return;

          // Jika entry beririsan, dan ratio lebih tinggi dari sebelumnya
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeId = link.href;
          }
        });

        // Jika tidak ada yang aktif, cek apakah kita di hero (default)
        if (maxRatio === 0) {
          const hero = document.getElementById('hero');
          if (hero && window.scrollY < 100) {
            activeId = '/';
          }
        }

        setActiveSection(activeId);
      },
      {
        root: null,
        rootMargin: '-10% 0px -30% 0px', // Biar lebih presisi
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [navLinks]);

  // Cek apakah link aktif berdasarkan section yang terlihat
  const isActive = (href: string) => {
    // Untuk halaman detail berita, tetap gunakan pathname
    if (pathname.startsWith('/berita/')) {
      return href === '/#berita';
    }
    return activeSection === href;
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${
          scrolled
            ? 'bg-white/85 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] border-b border-slate-200/20'
            : 'bg-gradient-to-b from-black/40 via-black/20 to-transparent backdrop-blur-sm border-b border-white/5'
        }
      `}
    >
      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] md:h-[80px]">

          {/* ===== LOGO & BRAND ===== */}
          <Link
            href="/"
            className="flex items-center gap-3 group relative"
            aria-label="Kembali ke Beranda"
          >
            <div className="relative w-11 h-11 md:w-14 md:h-14 flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl group-hover:blur-2xl transition-all duration-700 opacity-0 group-hover:opacity-100" />
              <Image
                src="/logobarru.png"
                alt="Logo Kabupaten Barru"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>

            {/* Brand text - ALL CAPS */}
            <div className="hidden sm:block leading-none">
              <h1
                className={`
                  font-black tracking-tight transition-colors duration-500
                  ${scrolled ? 'text-slate-900' : 'text-white'}
                  text-lg md:text-xl lg:text-2xl
                `}
              >
                TANETE RIAJA
              </h1>
              <p
                className={`
                  text-[10px] md:text-xs font-semibold tracking-[0.2em] transition-colors duration-500
                  ${scrolled ? 'text-slate-500' : 'text-white/60'}
                `}
              >
                KABUPATEN BARRU
              </p>
            </div>
          </Link>

          {/* ===== DESKTOP NAVIGATION ===== */}
          <nav
            className="hidden lg:flex items-center gap-0.5"
            aria-label="Navigasi utama"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative group px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                    flex items-center gap-2
                    ${
                      active
                        ? 'text-emerald-700 bg-emerald-50/80 shadow-sm shadow-emerald-500/5'
                        : scrolled
                        ? 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/40'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>{link.label}</span>

                  {/* Active indicator */}
                  {active && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                      transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                    />
                  )}

                  {/* Hover glow */}
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </Link>
              );
            })}

            {/* Admin button */}
            <Link
              href="/admin/login"
              className={`
                ml-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
                flex items-center gap-2 border
                ${
                  scrolled
                    ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 shadow-sm'
                    : 'border-white/20 text-white hover:bg-white/10 hover:border-white/40'
                }
              `}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* ===== MOBILE TOGGLE ===== */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              lg:hidden p-2.5 rounded-full transition-all duration-300
              ${scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'}
              focus:outline-none focus:ring-2 focus:ring-emerald-400/50
            `}
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isOpen}
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`
              lg:hidden overflow-hidden relative
              ${scrolled ? 'bg-white/95 backdrop-blur-2xl' : 'bg-slate-900/90 backdrop-blur-2xl'}
            `}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link, index) => {
                const active = isActive(link.href);
                const Icon = link.icon;

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-4 px-5 py-3.5 rounded-xl text-base font-medium transition-all duration-200
                        ${
                          active
                            ? 'text-emerald-700 bg-emerald-50/80'
                            : scrolled
                            ? 'text-slate-700 hover:bg-slate-50'
                            : 'text-white/90 hover:bg-white/10'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 opacity-70" />
                      <span>{link.label}</span>
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="my-3 h-px bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" />

              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.06, duration: 0.3 }}
              >
                <Link
                  href="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-4 px-5 py-3.5 rounded-xl text-base font-medium transition-all duration-200
                    ${
                      scrolled
                        ? 'text-emerald-700 hover:bg-emerald-50'
                        : 'text-emerald-300 hover:bg-white/10'
                    }
                  `}
                >
                  <Shield className="w-5 h-5" />
                  <span>Admin Panel</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}