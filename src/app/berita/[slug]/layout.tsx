import { Metadata } from 'next';
import { API_URL } from '@/lib/api';

// 1. Tipe params di Next.js 15 harus berupa Promise
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 2. Wajib di-await terlebih dahulu sebelum mengambil slug
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    const res = await fetch(`${API_URL}/berita/${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return {
        title: 'Berita Tidak Ditemukan | Kecamatan Tanete Riaja',
      };
    }

    const json = await res.json();
    const berita = json.data;

    if (!berita) {
      return {
        title: 'Berita Tidak Ditemukan | Kecamatan Tanete Riaja',
      };
    }

    const imageUrl = berita.gambar || 'https://taneteriaja.vercel.app/pemandagan.png';

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
            url: imageUrl,
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
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error('Gagal generate metadata berita:', error);
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