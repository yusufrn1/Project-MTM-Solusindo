import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createProductSignature,
  generateProductIntegrityKey,
  serializeProductIntegrityPayload,
} from "@/lib/crypto/product-integrity";

vi.mock("server-only", () => ({}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
}));

vi.mock("@/lib/sesi", () => ({
  bacaSesi: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    review: {
      create: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import { revalidatePath } from "next/cache";
import { hapusProduk, simpanProduk, ubahProduk } from "@/app/katalog/actions";
import {
  hapusUlasan,
  simpanUlasan,
  ubahUlasan,
} from "@/app/katalog/ulasan-actions";
import { prisma } from "@/lib/prisma";
import { bacaSesi } from "@/lib/sesi";
import { cariProduk, daftarProduk } from "@/lib/data";

const productIntegrityKey = generateProductIntegrityKey();
const productIntegrityTag = createProductSignature(
  serializeProductIntegrityPayload({
    name: "Produk Sintetis Uji",
    category: "RFID Solutions",
    description: "Produk sintetis untuk pengujian akses server.",
    features: ["Fitur sintetis"],
    active: true,
    image: null,
    imageAlt: null,
  }),
  productIntegrityKey,
);

const produkUji = {
  name: "Produk Sintetis Uji",
  category: "RFID Solutions",
  description: "Produk sintetis untuk pengujian akses server.",
  features: "Fitur sintetis",
  aktif: "on",
};

const ulasanUji = {
  name: "Pengunjung Uji",
  rating: "5",
  comment: "Ulasan sintetis untuk pengujian akses.",
};

function buatForm(data: Record<string, string>) {
  const formData = new FormData();
  for (const [kunci, nilai] of Object.entries(data)) {
    formData.set(kunci, nilai);
  }
  return formData;
}

function formProduk() {
  return buatForm(produkUji);
}

function formUlasan() {
  return buatForm(ulasanUji);
}

function sesiPengelola() {
  vi.mocked(bacaSesi).mockResolvedValue({
    email: "admin@uji.invalid",
    kedaluwarsa: Date.now() + 60_000,
  });
}

describe("kontrol akses Produk dan Ulasan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("PRODUCT_INTEGRITY_KEY", productIntegrityKey);
    vi.mocked(bacaSesi).mockResolvedValue(null);
  });

  describe("akses yang diizinkan", () => {
    it("1. publik membaca katalog dan ulasan produk", async () => {
      const produk = {
        id: 7,
        name: produkUji.name,
        category: produkUji.category,
        description: produkUji.description,
        features: ["Fitur sintetis"],
        active: true,
        image: null,
        imageAlt: null,
        integrityTag: productIntegrityTag,
      };
      vi.mocked(prisma.product.findMany).mockResolvedValue([produk] as never);
      vi.mocked(prisma.product.findFirst).mockResolvedValue({
        ...produk,
        reviews: [
          {
            id: 12,
            name: ulasanUji.name,
            rating: 5,
            comment: ulasanUji.comment,
            createdAt: new Date(),
            productId: 7,
          },
        ],
      } as never);

      expect(await daftarProduk()).toHaveLength(1);
      expect((await cariProduk(7))?.reviews).toHaveLength(1);
    });

    it("2. publik mengirim ulasan", async () => {
      vi.mocked(prisma.review.create).mockResolvedValue({ id: 12 } as never);

      const hasil = await simpanUlasan(7, {}, formUlasan());

      expect(hasil.pesan).toBe("Ulasan berhasil disimpan.");
      expect(prisma.review.create).toHaveBeenCalledOnce();
    });

    it("3. pengelola membuat produk", async () => {
      sesiPengelola();
      vi.mocked(prisma.product.create).mockResolvedValue({ id: 7 } as never);

      await expect(simpanProduk({}, formProduk())).rejects.toThrow(
        "NEXT_REDIRECT:/katalog/7",
      );
      expect(prisma.product.create).toHaveBeenCalledOnce();
    });

    it("4. pengelola memperbarui produk dan ulasan", async () => {
      sesiPengelola();
      vi.mocked(prisma.product.update).mockResolvedValue({ id: 7 } as never);
      vi.mocked(prisma.review.updateMany).mockResolvedValue({ count: 1 });

      const hasilProduk = await ubahProduk(7, {}, formProduk());
      const hasilUlasan = await ubahUlasan(12, 7, {}, formUlasan());

      expect(hasilProduk.pesan).toBe("Perubahan produk disimpan.");
      expect(hasilUlasan.pesan).toBe("Perubahan ulasan disimpan.");
      expect(prisma.product.update).toHaveBeenCalledOnce();
      expect(prisma.review.updateMany).toHaveBeenCalledOnce();
    });

    it("5. pengelola menghapus produk dan ulasan", async () => {
      sesiPengelola();
      vi.mocked(prisma.$transaction).mockResolvedValue([] as never);
      vi.mocked(prisma.review.deleteMany).mockResolvedValue({ count: 1 });

      await expect(hapusProduk(7)).rejects.toThrow("NEXT_REDIRECT:/katalog");
      await hapusUlasan(12, 7);

      expect(prisma.$transaction).toHaveBeenCalledOnce();
      expect(prisma.review.deleteMany).toHaveBeenCalledTimes(2);
      expect(revalidatePath).toHaveBeenCalledWith("/katalog/7");
    });
  });

  describe("akses yang harus ditolak", () => {
    it("1. publik tidak dapat membuat produk", async () => {
      const hasil = await simpanProduk({}, formProduk());

      expect(hasil.pesan).toBe("Silakan masuk terlebih dahulu.");
      expect(prisma.product.create).not.toHaveBeenCalled();
    });

    it("2. publik tidak dapat memperbarui produk", async () => {
      const hasil = await ubahProduk(7, {}, formProduk());

      expect(hasil.pesan).toBe("Silakan masuk terlebih dahulu.");
      expect(prisma.product.update).not.toHaveBeenCalled();
    });

    it("3. publik tidak dapat menghapus produk", async () => {
      await expect(hapusProduk(7)).rejects.toThrow("NEXT_REDIRECT:/masuk");

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it("4. publik tidak dapat memperbarui ulasan", async () => {
      const hasil = await ubahUlasan(12, 7, {}, formUlasan());

      expect(hasil.pesan).toBe("Silakan masuk terlebih dahulu.");
      expect(prisma.review.updateMany).not.toHaveBeenCalled();
    });

    it("5. publik tidak dapat menghapus ulasan", async () => {
      await expect(hapusUlasan(12, 7)).rejects.toThrow("NEXT_REDIRECT:/masuk");

      expect(prisma.review.deleteMany).not.toHaveBeenCalled();
    });
  });

  describe("integritas data produk", () => {
    it("menolak record katalog dengan tag yang telah diubah", async () => {
      vi.mocked(prisma.product.findMany).mockResolvedValue(
        [
          {
            id: 7,
            name: produkUji.name,
            category: produkUji.category,
            description: produkUji.description,
            features: ["Fitur sintetis"],
            active: true,
            image: null,
            imageAlt: null,
            integrityTag: "0".repeat(64),
          },
        ] as never,
      );

      await expect(daftarProduk()).rejects.toThrow(
        "Integritas data produk gagal diverifikasi.",
      );
    });
  });
});