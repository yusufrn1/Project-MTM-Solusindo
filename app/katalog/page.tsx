import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

const products = [
  {
    id: "MTM-001",
    name: "People Counting Device",
    category: "People Counting",
    description:
      "Perangkat untuk membantu menghitung jumlah pengunjung dan memahami pola kunjungan.",
    features: [
      "Penghitungan pengunjung",
      "Mendukung analisis jumlah kunjungan",
      "Contoh penggunaan di area retail",
    ],
  },
  {
    id: "MTM-002",
    name: "RFID Reader",
    category: "RFID Solutions",
    description:
      "Perangkat pembaca RFID untuk mendukung identifikasi dan pelacakan objek.",
    features: [
      "Membaca tag RFID yang kompatibel",
      "Mendukung identifikasi objek",
      "Dapat digunakan pada sistem inventaris",
    ],
  },
  {
    id: "MTM-003",
    name: "RFID Tag",
    category: "RFID Solutions",
    description:
      "Tag RFID sebagai media identifikasi untuk objek atau barang.",
    features: [
      "Identifikasi berbasis RFID",
      "Tersedia dalam berbagai jenis",
      "Kompatibilitas bergantung pada sistem",
    ],
  },
  {
    id: "MTM-004",
    name: "Point of Sale Device",
    category: "POS Systems",
    description:
      "Perangkat pendukung proses transaksi dan operasional bisnis retail.",
    features: [
      "Mendukung proses transaksi",
      "Membantu operasional retail",
      "Konfigurasi mengikuti kebutuhan bisnis",
    ],
  },
  {
    id: "MTM-005",
    name: "Barcode Scanner",
    category: "Barcode Scanners",
    description:
      "Perangkat pemindai barcode untuk membantu identifikasi produk secara praktis.",
    features: [
      "Pemindaian barcode",
      "Mendukung identifikasi produk",
      "Jenis koneksi bergantung pada model",
    ],
  },
  {
    id: "MTM-006",
    name: "Data Collection Device",
    category: "Data Collection",
    description:
      "Perangkat pengumpulan data untuk mendukung aktivitas operasional dan inventaris.",
    features: [
      "Mendukung pengumpulan data",
      "Membantu pencatatan inventaris",
      "Spesifikasi bergantung pada model",
    ],
  },
];

export default function KatalogPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar activePage="katalog" />

      <main>
        <section className="bg-gradient-to-br from-blue-950 to-blue-800 px-6 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Katalog Produk
            </p>

            <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">
              Temukan Solusi Teknologi
            </h1>

            <p className="mt-5 max-w-2xl leading-7 text-blue-100">
              Jelajahi contoh kategori perangkat teknologi untuk mendukung
              kebutuhan operasional bisnis Anda.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Pilihan Produk</h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Data produk berikut merupakan contoh untuk prototipe akademik,
              bukan daftar SKU resmi atau konfirmasi ketersediaan produk MTM
              Solusindo.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-blue-100 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold">
              Butuh informasi lebih lanjut?
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Hubungi kami untuk menyampaikan kebutuhan perangkat atau
              menanyakan informasi produk.
            </p>

            <a
              href="/kontak"
              className="mt-5 inline-flex rounded-lg bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
            >
              Hubungi Kami →
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}