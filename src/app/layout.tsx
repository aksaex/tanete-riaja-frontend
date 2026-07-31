// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// ============================================================
// 1. FONT LOADING (dengan variable yang sudah benar)
// ============================================================
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Menghindari FOIT (Flash of Invisible Text)
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ============================================================
// 2. VIEWPORT (terpisah dari metadata di Next.js 14+)
// ============================================================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10B981" }, // Emerald 500
    { media: "(prefers-color-scheme: dark)", color: "#059669" },  // Emerald 600
  ],
};

// ============================================================
// 3. METADATA LENGKAP (SEO & OpenGraph)
// ============================================================
export const metadata: Metadata = {
  // Domain dasar untuk URL absolut di OpenGraph & Twitter
  metadataBase: new URL("https://taneteriaja.go.id"),

  // Informasi dasar
  title: {
    default: "Kecamatan Tanete Riaja – Portal Resmi Pemerintahan",
    template: "%s | Kecamatan Tanete Riaja",
  },
  description:
    "Portal informasi dan layanan publik Kecamatan Tanete Riaja, Kabupaten Barru, Sulawesi Selatan. Temukan berita, profil wilayah, dan potensi pertanian unggul.",

  // Keywords
  keywords: [
    "Kecamatan Tanete Riaja",
    "Kabupaten Barru",
    "Sulawesi Selatan",
    "Portal Pemerintahan",
    "Berita Kecamatan",
    "Pertanian",
    "Wisata",
    "Pelayanan Publik",
    "PPID",
  ],

  // Penulis & Publisher
  authors: [{ name: "Pemerintah Kecamatan Tanete Riaja" }],
  creator: "Pemerintah Kecamatan Tanete Riaja",
  publisher: "Kecamatan Tanete Riaja",
  category: "Government",

  // Canonical URL (mencegah duplikasi konten)
  alternates: {
    canonical: "https://taneteriaja.vercel.app",
  },

  // OpenGraph (Facebook, LinkedIn, WhatsApp, dll)
  openGraph: {
    title: "Kecamatan Tanete Riaja – Portal Resmi Pemerintahan",
    description:
      "Portal informasi dan layanan publik Kecamatan Tanete Riaja, Kabupaten Barru, Sulawesi Selatan.",
    type: "website",
    locale: "id_ID",
    url: "https://taneteriaja.vercel.app",
    siteName: "Kecamatan Tanete Riaja",
    images: [
      {
        url: "/logobarru.png",
        width: 1200,
        height: 630,
        alt: "Logo Kabupaten Barru - Kecamatan Tanete Riaja",
        type: "image/png",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Kecamatan Tanete Riaja – Portal Resmi Pemerintahan",
    description:
      "Portal informasi dan layanan publik Kecamatan Tanete Riaja, Kabupaten Barru, Sulawesi Selatan.",
    images: ["/logobarru.png"],
    creator: "@taneteriaja", // Ganti dengan akun Twitter/X resmi jika ada
  },

  // Robots (SEO)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Ikon (favicon)
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png", // Jika ada
  },

  // Verifikasi (Google Search Console, dll) – kosongkan jika belum punya
  verification: {
    google: "", // Tambahkan kode verifikasi Google nanti
    // other: { "yandex": "...", "facebook-domain-verification": "..." }
  },
};

// ============================================================
// 4. STRUCTURED DATA (JSON-LD) untuk mesin pencari
// ============================================================
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  name: "Kecamatan Tanete Riaja",
  alternateName: "Kecamatan Tanete Riaja Kabupaten Barru",
  description:
    "Portal informasi dan layanan publik Kecamatan Tanete Riaja, Kabupaten Barru, Sulawesi Selatan.",
  url: "https://taneteriaja.vercel.app",
  logo: "https://taneteriaja.vercel.app/logobarru.png",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kecamatan Tanete Riaja",
    addressRegion: "Sulawesi Selatan",
    postalCode: "90763",
    addressCountry: "ID",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Layanan Publik",
    availableLanguage: ["Indonesian"],
  },
};

// ============================================================
// 5. ROOT LAYOUT
// ============================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning // Mencegah warning jika ada perbedaan antara server & client
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
        {/* ========== JSON-LD Structured Data ========== */}
        <Script
          id="json-ld-government"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* ========== KONTEN UTAMA ========== */}
        {children}
      </body>
    </html>
  );
}