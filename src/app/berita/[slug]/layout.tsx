// app/berita/[slug]/layout.tsx
import { Metadata } from 'next';
import { API_URL } from '@/lib/api';

type Props = {
  params: Promise<{ slug: string }>;
};

// Fungsi pembantu untuk memastikan URL selalu absolut
function getAbsoluteImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return 'https://taneteriaja.vercel.app/pemandagan.png';
  }
  // Jika URL sudah absolut (http atau https), gunakan langsung
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // Jika relatif, gabungkan dengan base URL
  return `https://taneteriaja.vercel.app${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const res = await fetch(`${API_URL}/berita/${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return {
        title: 'Berita Tidak Ditemukan | Kecamatan Tanete Riaja',
        description: 'Maaf, berita yang Anda cari tidak tersedia.',
      };
    }

    const json = await res.json();
    const berita = json?.data;

    if (!berita) {
      return {
        title: 'Berita Tidak Ditemukan | Kecamatan Tanete Riaja',
      };
    }

    // Gunakan fungsi pembantu untuk mendapatkan URL absolut
    const imageUrl = getAbsoluteImageUrl(berita.gambar);

    return {
      title: `${berita.judul} | Kecamatan Tanete Riaja`,
      description: berita.ringkasan,
      openGraph: {
        title: berita.judul,
        description: berita.ringkasan,
        url: `https://taneteriaja.vercel.app/berita/${berita.slug}`,
        siteName: 'Pemerintah Kecamatan Tanete Riaja',
        type: 'article',
        images: [
          {
            url: imageUrl, // URL sudah absolut
            width: 1200,
            height: 630,
            alt: berita.judul,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: berita.judul,
        description: berita.ringkasan,
        images: [imageUrl], // URL sudah absolut
      },
    };
  } catch (error) {
    console.error('Fatal error generateMetadata:', error);
    return {
      title: 'Berita Kecamatan Tanete Riaja',
    };
  }
}

export default function DetailBeritaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}