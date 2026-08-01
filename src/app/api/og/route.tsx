// app/api/og/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  // Ambil data berita berdasarkan slug dari database atau API
  // const berita = await getBeritaBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={{ fontSize: 40, color: '#059669' }}>Kecamatan Tanete Riaja</div>
        <div style={{ fontSize: 70, fontWeight: 'bold', marginTop: 20 }}>
          {/* {berita?.judul || 'Judul Berita'} */}
          Judul Berita
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}