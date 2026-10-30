import "server-only";

export type Produk = {
  id: number;
  kode: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  aktif: boolean;
  image: string;
  imageAlt: string;
};

const initialProducts: Produk[] = [
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
    aktif: true,
    image: "/images/people-counting-context.jpg",
    imageAlt:
      "Interior toko ritel sebagai ilustrasi area penggunaan people counting, bukan foto perangkat MTM.",
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
    aktif: true,
    image: "/images/rfid-reader-context.jpg",
    imageAlt:
      "Detail papan sirkuit sebagai ilustrasi teknologi RFID, bukan foto model reader MTM.",
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
    aktif: true,
    image: "/images/rfid-tag-example.png",
    imageAlt:
      "Contoh tag RFID pada label kain, bukan SKU atau model produk MTM.",
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
    aktif: true,
    image: "/images/pos-checkout-context.jpg",
    imageAlt:
      "Interaksi pembayaran di kasir sebagai ilustrasi POS, bukan foto perangkat MTM.",
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
    aktif: true,
    image: "/images/barcode-qr-scan.jpg",
    imageAlt:
      "Kode QR pada layar ponsel sebagai ilustrasi alur pemindaian, bukan foto scanner MTM.",
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
    aktif: true,
    image: "/images/data-collection-context.jpg",
    imageAlt:
      "Workstation komputer sebagai ilustrasi penggunaan perangkat pengumpulan data.",
  },
];

const visualKategori: Record<string, Pick<Produk, "image" | "imageAlt">> = {
  "People Counting": {
    image: "/images/people-counting-context.jpg",
    imageAlt: "Interior toko ritel sebagai ilustrasi kategori people counting.",
  },
  "RFID Solutions": {
    image: "/images/rfid-reader-context.jpg",
    imageAlt: "Detail papan sirkuit sebagai ilustrasi kategori RFID.",
  },
  "POS Systems": {
    image: "/images/pos-checkout-context.jpg",
    imageAlt: "Interaksi pembayaran kasir sebagai ilustrasi kategori POS.",
  },
  "Barcode Scanners": {
    image: "/images/barcode-qr-scan.jpg",
    imageAlt: "Kode QR pada layar ponsel sebagai ilustrasi pemindaian barcode.",
  },
  "Data Collection": {
    image: "/images/data-collection-context.jpg",
    imageAlt: "Workstation komputer sebagai ilustrasi pengumpulan data.",
  },
};

const globalProduk = globalThis as typeof globalThis & {
  mtmProduk?: Produk[];
};
const products = (globalProduk.mtmProduk ??= initialProducts);

for (const product of products) {
  if (!product.image || !product.imageAlt) {
    Object.assign(
      product,
      product.name === "RFID Tag"
        ? {
            image: "/images/rfid-tag-example.png",
            imageAlt:
              "Contoh tag RFID pada label kain, bukan SKU atau model produk MTM.",
          }
        : visualKategori[product.category],
    );
  }
}

export function daftarProduk(): Produk[] {
  return products.filter((produk) => produk.aktif);
}

export function cariProduk(id: number): Produk | undefined {
  return products.find((produk) => produk.id === id && produk.aktif);
}

export function namaProdukSudahAda(name: string): boolean {
  const normalizedName = name.trim().toLocaleLowerCase("id");
  return products.some(
    (produk) => produk.name.toLocaleLowerCase("id") === normalizedName,
  );
}

export function tambahProduk(
  data: Omit<Produk, "id" | "kode" | "image" | "imageAlt">,
): Produk {
  const id = Math.max(0, ...products.map((produk) => produk.id)) + 1;
  const product: Produk = {
    id,
    kode: `MTM-${String(id).padStart(3, "0")}`,
    ...data,
    ...visualKategori[data.category],
  };
  products.push(product);
  return product;
}