import "server-only";

export type Produk = {
  id: number;
  kode: string;
  name: string;
  category: string;
  description: string;
  features: string[];
};

const products: Produk[] = [
  {
    id: 1,
    kode: "MTM-001",
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
    id: 2,
    kode: "MTM-002",
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
    id: 3,
    kode: "MTM-003",
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
    id: 4,
    kode: "MTM-004",
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
    id: 5,
    kode: "MTM-005",
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
    id: 6,
    kode: "MTM-006",
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

export function daftarProduk(): Produk[] {
  return products;
}

export function cariProduk(id: number): Produk | undefined {
  return products.find((produk) => produk.id === id);
}