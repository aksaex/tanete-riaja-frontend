// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 text-sm py-12 border-t border-gray-800" id="kontak">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">Kecamatan Tanete Riaja</h3>
          <p className="text-gray-400 leading-relaxed">
            Portal Informasi dan Layanan Resmi Kecamatan Tanete Riaja, Kabupaten Barru, Sulawesi Selatan.
          </p>
        </div>
        <div>
          <h3 className="text-white font-bold mb-3">Alamat Kantor</h3>
          <p className="text-gray-400 leading-relaxed">
            Jl. Poros Ralanru - Lompo Tengah<br />
            Kecamatan Tanete Riaja, Kabupaten Barru<br />
            Sulawesi Selatan, Indonesia
          </p>
        </div>
        <div>
          <h3 className="text-white font-bold mb-3">Jam Pelayanan</h3>
          <p className="text-gray-400 leading-relaxed">
            Senin - Jumat: 08:00 - 16:00 WITA<br />
            Sabtu - Minggu: Tutup
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Pemerintah Kecamatan Tanete Riaja. All rights reserved.
      </div>
    </footer>
  );
}