// src/data/mockBerita.ts

export interface Berita {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  gambar: string;
  tanggal: string;
  kategori: string;
  penulis?: string;
}

export const mockBerita: Berita[] = [
  {
    id: "1",
    slug: "musrenbang-2026-kecamatan-tanete-riaja",
    judul: "Musrenbang Tahun 2026 Tingkat Kecamatan Tanete Riaja Sukses Digelar",
    ringkasan: "Pembahasan rencana pembangunan daerah fokus pada perbaikan infrastruktur jalan desa dan peningkatan saluran irigasi pertanian untuk mendukung swasembada pangan.",
    gambar: "https://images.unsplash.com/photo-1541888946425-d0ebb18086f6?q=80&w=800&auto=format&fit=crop",
    tanggal: "28 Juli 2026",
    kategori: "Pemerintahan",
    penulis: "Admin Kecamatan"
  },
  {
    id: "2",
    slug: "panen-raya-padi-desa-kading",
    judul: "Panen Raya Padi di Desa Kading, Hasil Pertanian Meningkat 20%",
    ringkasan: "Dukungan pupuk subsidi dan kondisi cuaca yang kondusif membuat hasil panen gabah kering panen musim ini mengalami peningkatan signifikan.",
    gambar: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop",
    tanggal: "25 Juli 2026",
    kategori: "Pertanian",
    penulis: "Admin Kecamatan"
  },
  {
    id: "3",
    slug: "pembinaan-umkm-khas-barru",
    judul: "Kecamatan Tanete Riaja Gelar Pelatihan Digital Marketing untuk UMKM",
    ringkasan: "Puluhan pelaku usaha mikro, kecil, dan menengah diberikan pembinaan cara memasarkan produk unggulan daerah secara online melalui e-commerce.",
    gambar: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop",
    tanggal: "20 Juli 2026",
    kategori: "Ekonomi",
    penulis: "Admin Kecamatan"
  }
];