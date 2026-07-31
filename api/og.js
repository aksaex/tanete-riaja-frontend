export default async function handler(req, res) {
  const { slug } = req.query;

  try {
    // 1. Ambil data berita dari API backend
    const response = await fetch(`https://tanete-riaja-backend.vercel.app/api/berita/${slug}`);
    const result = await response.json();
    const berita = result.data;

    if (!berita) {
      return res.status(404).send('Berita tidak ditemukan');
    }

    // 2. Kirim HTML khusus yang berisi meta tag Open Graph untuk bot WhatsApp
    const html = `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="utf-8" />
          <title>${berita.judul}</title>
          <meta property="og:title" content="${berita.judul}" />
          <meta property="og:description" content="${berita.ringkasan}" />
          <meta property="og:image" content="${berita.gambar}" />
          <meta property="og:url" content="https://taneteriaja.vercel.app/berita/${slug}" />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="${berita.gambar}" />
          <!-- Redirect pengguna asli ke aplikasi React -->
          <meta http-equiv="refresh" content="0;url=/berita/${slug}" />
        </head>
        <body>
          <p>Mengarahkan ke berita...</p>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send('Error generating preview');
  }
}