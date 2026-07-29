// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kecamatan Tanete Riaja – Portal Resmi Pemerintahan",
  description:
    "Portal informasi dan layanan publik Kecamatan Tanete Riaja, Kabupaten Barru, Sulawesi Selatan. Temukan berita, profil wilayah, dan potensi pertanian unggul.",
  keywords: [
    "Kecamatan Tanete Riaja",
    "Kabupaten Barru",
    "Sulawesi Selatan",
    "Portal Pemerintahan",
    "Berita Kecamatan",
    "Pertanian",
    "Wisata",
  ],
  openGraph: {
    title: "Kecamatan Tanete Riaja – Portal Resmi Pemerintahan",
    description:
      "Portal informasi dan layanan publik Kecamatan Tanete Riaja, Kabupaten Barru, Sulawesi Selatan.",
    type: "website",
    locale: "id_ID",
    url: "https://taneteriaja.go.id", // Ganti dengan domain asli
    siteName: "Kecamatan Tanete Riaja",
    images: [
      {
        url: "/logobarru.png", // Gunakan logo sebagai gambar OG
        width: 1200,
        height: 630,
        alt: "Logo Kabupaten Barru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kecamatan Tanete Riaja – Portal Resmi Pemerintahan",
    description:
      "Portal informasi dan layanan publik Kecamatan Tanete Riaja, Kabupaten Barru, Sulawesi Selatan.",
    images: ["/logobarru.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id" // Ubah dari "en" menjadi "id" karena website berbahasa Indonesia
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}