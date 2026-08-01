// app/berita/[slug]/layout.tsx
import { Metadata } from 'next';
import { API_URL } from '@/lib/api';

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Mendapatkan URL absolut gambar
 */
function getAbsoluteImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return 'https://taneteriaja.vercel.app/pemandagan.png';
  }
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  return `https://taneteriaja.vercel.app${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;

    console.log(`🔍 [generateMetadata] Fetching berita for slug: ${slug}`);
    console.log(`📡 [generateMetadata] API_URL: ${API_URL}`);

    // Fetch data berita
    const res = await fetch(`${API_URL}/berita/${slug}`, {
      cache: 'no-store',
    });

    console.log(`📡 [generateMetadata] Response status: ${res.status}`);

    // Jika response tidak OK (termasuk 404), kita TIDAK panggil notFound()
    // Tapi kita tetap berikan metadata default agar halaman tetap bisa diakses
    if (!res.ok) {
      console.warn(`⚠️ [generateMetadata] Berita dengan slug "${slug}" tidak ditemukan (status ${res.status})`);
      return {
        title: 'Berita Tidak Ditemukan | Kecamatan Tanete Riaja',
        description: 'Maaf, artikel yang Anda cari tidak tersedia saat ini.',
        openGraph: {
          title: 'Berita Tidak Ditemukan',
          description: 'Artikel tidak tersedia',
          images: [
            {
              url: 'https://taneteriaja.vercel.app/pemandagan.png',
              width: 1200,
              height: 630,
              alt: 'Gambar default',
            },
          ],
        },
      };
    }

    const json = await res.json();
    const berita = json?.data;

    // Jika data berita null, juga berikan metadata default
    if (!berita) {
      console.warn(`⚠️ [generateMetadata] Data berita null untuk slug: ${slug}`);
      return {
        title: 'Berita Tidak Ditemukan | Kecamatan Tanete Riaja',
        description: 'Maaf, artikel yang Anda cari tidak tersedia saat ini.',
        openGraph: {
          title: 'Berita Tidak Ditemukan',
          description: 'Artikel tidak tersedia',
          images: [
            {
              url: 'https://taneteriaja.vercel.app/pemandagan.png',
              width: 1200,
              height: 630,
              alt: 'Gambar default',
            },
          ],
        },
      };
    }

    console.log(`✅ [generateMetadata] Berita ditemukan: ${berita.judul}`);

    // Metadata lengkap dengan data berita
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
    console.error('❌ [generateMetadata] Error:', error);
    return {
      title: 'Berita Kecamatan Tanete Riaja',
      description: 'Portal berita resmi Kecamatan Tanete Riaja.',
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