import { Metadata } from 'next';
import { API_URL } from '@/lib/api';

// Fungsi otomatis Next.js untuk membuat meta-tag di Server
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  try {
    // Ambil data detail berita langsung dari backend Express
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

    // Gunakan gambar default jika gambar di database kosong/error
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