import "dotenv/config";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const runDatabaseTests = process.env.RUN_DB_TESTS === "1";
const databaseSuite = runDatabaseTests ? describe : describe.skip;
const suffix = crypto.randomUUID();
const productName = `Produk Uji ${suffix}`;

let prisma: PrismaClient | undefined;
let productId: number | undefined;

function client(): PrismaClient {
  if (!prisma) throw new Error("Prisma test client belum dibuat.");
  return prisma;
}

databaseSuite("Prisma PostgreSQL Product dan Review CRUD", () => {
  beforeAll(async () => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL belum diatur.");
    prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
    });
    await prisma.$connect();
  });

  afterAll(async () => {
    if (!prisma) return;
    if (productId) {
      await prisma.review.deleteMany({ where: { productId } });
      await prisma.product.deleteMany({ where: { id: productId } });
    }
    await prisma.$disconnect();
  });

  it("1. membuat produk baru", async () => {
    const product = await client().product.create({
      data: {
        name: productName,
        category: "RFID Solutions",
        description: "Produk uji integrasi database lokal.",
        features: ["Fitur pengujian"],
      },
    });
    productId = product.id;

    expect(product.name).toBe(productName);
  });

  it("2. membaca produk dari daftar", async () => {
    const products = await client().product.findMany({
      where: { id: productId },
    });

    expect(products).toHaveLength(1);
  });

  it("3. membaca produk beserta relasinya", async () => {
    const product = await client().product.findUnique({
      where: { id: productId },
      include: { reviews: true },
    });

    expect(product?.reviews).toEqual([]);
  });

  it("4. memperbarui deskripsi produk", async () => {
    const product = await client().product.update({
      where: { id: productId },
      data: { description: "Deskripsi produk yang telah diperbarui." },
    });

    expect(product.description).toBe("Deskripsi produk yang telah diperbarui.");
  });

  it("5. menolak nama produk duplikat dengan P2002", async () => {
    await expect(
      client().product.create({
        data: {
          name: productName,
          category: "RFID Solutions",
          description: "Nama ini harus ditolak karena duplikat.",
        },
      }),
    ).rejects.toMatchObject({ code: "P2002" });
  });

  it("6. menambahkan ulasan untuk produk", async () => {
    const review = await client().review.create({
      data: {
        productId: productId!,
        name: "Pelanggan Uji",
        rating: 5,
        comment: "Ulasan integrasi berhasil dibuat.",
      },
    });

    expect(review.productId).toBe(productId);
  });

  it("7. menolak ulasan duplikat dengan P2002", async () => {
    await expect(
      client().review.create({
        data: {
          productId: productId!,
          name: "Pelanggan Uji",
          rating: 4,
          comment: "Ulasan duplikat harus ditolak.",
        },
      }),
    ).rejects.toMatchObject({ code: "P2002" });
  });

  it("8. menolak foreign key produk yang tidak ada dengan P2003", async () => {
    await expect(
      client().review.create({
        data: {
          productId: productId! + 1_000_000,
          name: "Pengguna Fiktif",
          rating: 3,
          comment: "Produk tujuan tidak tersedia.",
        },
      }),
    ).rejects.toMatchObject({ code: "P2003" });
  });

  it("9. aturan RESTRICT menolak hapus langsung produk berulasan", async () => {
    await expect(
      client().product.delete({ where: { id: productId } }),
    ).rejects.toMatchObject({ code: "P2003" });
  });

  it("10. transaksi me-rollback penghapusan ulasan saat hapus produk gagal", async () => {
    await expect(
      client().$transaction([
        client().review.deleteMany({ where: { productId } }),
        client().product.delete({ where: { id: productId! + 1_000_000 } }),
      ]),
    ).rejects.toMatchObject({ code: "P2025" });

    const reviews = await client().review.count({ where: { productId } });
    expect(reviews).toBe(1);
  });

  it("11. transaksi menghapus ulasan dan produk bersama-sama", async () => {
    await client().$transaction([
      client().review.deleteMany({ where: { productId } }),
      client().product.delete({ where: { id: productId } }),
    ]);

    const product = await client().product.findUnique({
      where: { id: productId },
    });
    const reviews = await client().review.count({ where: { productId } });
    expect(product).toBeNull();
    expect(reviews).toBe(0);
    productId = undefined;
  });
});