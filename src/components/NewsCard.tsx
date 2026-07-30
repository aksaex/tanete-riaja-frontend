'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';

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

export function NewsCard({ item, index }: { item: Berita; index: number }) {
  const [imgSrc, setImgSrc] = useState(item.gambar || '/pemandagan.png');

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      <Link href={`/berita/${item.slug}`} className="block h-full">
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
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
            Baca <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}