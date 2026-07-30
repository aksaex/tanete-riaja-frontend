'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      href: '#',
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
      href: '#',
    },
    {
      name: 'YouTube',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      href: '#',
    },
    {
      name: 'Twitter / X',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: '#',
    },
  ];

  const quickLinks = [
    { label: 'Layanan Publik', href: '#' },
    { label: 'Pengaduan Masyarakat', href: '#' },
    { label: 'PPID', href: '#' },
    { label: 'Informasi Geospasial', href: '#' },
  ];

  const footerLinks = [
    { label: 'Kebijakan Privasi', href: '#' },
    { label: 'Syarat & Ketentuan', href: '#' },
    { label: 'Hubungi Kami', href: '#' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand & Deskripsi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <h3 className="text-white font-bold text-2xl tracking-tight">
              Tanete Riaja
            </h3>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-xs">
              Portal informasi dan layanan publik resmi Kecamatan Tanete Riaja, Kabupaten Barru, Sulawesi Selatan.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="text-slate-500 hover:text-emerald-400 transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Alamat & Kontak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Alamat Kantor
            </h4>
            <address className="not-italic text-sm text-slate-400 leading-relaxed">
              Jl. Poros Ralanru - Lompo Tengah<br />
              Kecamatan Tanete Riaja<br />
              Kabupaten Barru, Sulawesi Selatan<br />
              Indonesia
            </address>
            <div className="mt-4">
              <p className="text-sm text-slate-400">
                <span className="text-slate-300 font-medium">Email:</span>{' '}
                <a href="mailto:info@taneteriaja.go.id" className="hover:text-emerald-400 transition-colors">
                  info@taneteriaja.go.id
                </a>
              </p>
              <p className="text-sm text-slate-400 mt-1">
                <span className="text-slate-300 font-medium">Telepon:</span>{' '}
                <a href="tel:+62412345678" className="hover:text-emerald-400 transition-colors">
                  (0421) 123-4567
                </a>
              </p>
            </div>
          </motion.div>

          {/* Jam Pelayanan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Jam Pelayanan
            </h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex justify-between">
                <span>Senin - Kamis</span>
                <span className="text-slate-300">08:00 - 15:30 WITA</span>
              </div>
              <div className="flex justify-between">
                <span>Jumat</span>
                <span className="text-slate-300">08:00 - 15:00 WITA</span>
              </div>
              <div className="flex justify-between">
                <span>Sabtu - Minggu</span>
                <span className="text-slate-500">Tutup</span>
              </div>
              <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-500">
                Istirahat: 12:00 - 13:00 WITA
              </div>
            </div>
          </motion.div>

          {/* Tautan Cepat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Tautan Cepat
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-400 transition-colors duration-200 inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            &copy; {currentYear} Pemerintah Kecamatan Tanete Riaja. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-slate-300 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}