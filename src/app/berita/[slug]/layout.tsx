import { Metadata } from 'next';
import { API_URL } from '@/lib/api';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // 1. Await params untuk kompatibilitas Next.js 15
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // 2. Fetch ke backend dengan proteksi error
    const res = await fetch(`${API_URL}/berita/${slug}`, {
      cache: 'no-store',
    }).catch((err) => {
      console.error('Fetch error di server:', err);
      return null;
    });

    // Jika API gagal/error, JANGAN render 404, tetap tampilkan judul fallback
    if (!res || !res.ok) {
      return {
        title: 'Berita Kecamatan Tanete Riaja',
        description: 'Portal Berita Resmi Kecamatan Tanete Riaja, Kabupaten Barru.',
      };
    }

    const json = await res.json();
    const berita = json?.data;

    if (!berita) {
      return {
        title: 'Berita Kecamatan Tanete Riaja',
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