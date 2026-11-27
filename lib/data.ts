import "server-only";
import { prisma } from "@/lib/prisma";

import {
  getProductIntegrityKey,
  serializeProductIntegrityPayload,
  verifyProductSignature,
} from "@/lib/crypto/product-integrity";

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
  reviews?: UlasanProduk[];
};

export type UlasanProduk = {
  id: number;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

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

function verifikasiIntegritasProduk(product: {
  name: string;
  category: string;
  description: string;
  features: string[];
  active: boolean;
  image: string | null;
  imageAlt: string | null;
  integrityTag: string | null;
}) {
  const valid =
    product.integrityTag !== null &&
    verifyProductSignature(
      serializeProductIntegrityPayload({
        name: product.name,
        category: product.category,
        description: product.description,
        features: product.features,
        active: product.active,
        image: product.image,
        imageAlt: product.imageAlt,
      }),
      product.integrityTag,
      getProductIntegrityKey(),
    );

  if (!valid) {
  throw new Error("Integritas data produk gagal diverifikasi.");
}
}

function mapProduk(product: {
  id: number;
  name: string;
  category: string;
  description: string;
  features: string[];
  active: boolean;
  image: string | null;
  imageAlt: string | null;
  reviews?: UlasanProduk[];
  integrityTag: string | null;

}): Produk {
  const visual = visualKategori[product.category] ?? {
    image: "/images/data-collection-context.jpg",
    imageAlt: "Ilustrasi kategori produk teknologi.",
  };
  return {
    id: product.id,
    kode: `MTM-${String(product.id).padStart(3, "0")}`,
    name: product.name,
    category: product.category,
    description: product.description,
    features: product.features,
    aktif: product.active,
    image: product.image ?? visual.image,
    imageAlt: product.imageAlt ?? visual.imageAlt,
    ...(product.reviews ? { reviews: product.reviews } : {}),
  };
}

export async function daftarProduk(): Promise<Produk[]> {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  for (const product of products) {
    verifikasiIntegritasProduk(product);
  }

  return products.map(mapProduk);
}

export async function cariProduk(id: number): Promise<Produk | null> {
  const product = await prisma.product.findFirst({
    where: { id, active: true },
    include: { reviews: { orderBy: { createdAt: "desc" } } },
  });

  if (!product) return null;

  verifikasiIntegritasProduk(product);

  return mapProduk(product);
}

export function gambarUntukKategori(category: string) {
  return visualKategori[category] ?? {
    image: "/images/data-collection-context.jpg",
    imageAlt: "Ilustrasi kategori produk teknologi.",
  };
}
