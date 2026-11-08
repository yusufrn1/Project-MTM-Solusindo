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

  let reviewId: number | undefined;

  it("1. membuat produk", async () => {
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

  it("2. membaca produk", async () => {
    const products = await client().product.findMany({
      where: { id: productId },
    });

    expect(products).toHaveLength(1);
  });

  it("3. memperbarui produk", async () => {
    const product = await client().product.update({
      where: { id: productId },
      data: { description: "Deskripsi produk yang telah diperbarui." },
    });

    expect(product.description).toBe("Deskripsi produk yang telah diperbarui.");
  });

  it("4. membuat ulasan untuk produk", async () => {
    const review = await client().review.create({
      data: {
        productId: productId!,
        name: "Pelanggan Uji",
        rating: 5,
        comment: "Ulasan integrasi berhasil dibuat.",
      },
    });
    reviewId = review.id;

    expect(review.productId).toBe(productId);
  });

  it("5. membaca ulasan melalui relasi produk", async () => {
    const product = await client().product.findUnique({
      where: { id: productId },
      include: { reviews: true },
    });

    expect(product?.reviews).toHaveLength(1);
    expect(product?.reviews[0]?.id).toBe(reviewId);
  });

  it("6. memperbarui ulasan", async () => {
    const review = await client().review.update({
      where: { id: reviewId },
      data: { rating: 4, comment: "Ulasan yang telah diperbarui." },
    });

    expect(review.rating).toBe(4);
    expect(review.comment).toBe("Ulasan yang telah diperbarui.");
  });

  it("7. menghapus ulasan", async () => {
    await client().review.delete({ where: { id: reviewId } });

    expect(
      await client().review.findUnique({ where: { id: reviewId } }),
    ).toBeNull();
    reviewId = undefined;
  });

  it("8. menolak ulasan dengan foreign key produk yang tidak ada", async () => {
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

  it("9. menolak penghapusan produk yang masih memiliki ulasan", async () => {
    const review = await client().review.create({
      data: {
        productId: productId!,
        name: "Pengulas Relasi",
        rating: 5,
        comment: "Ulasan untuk menguji batasan relasi.",
      },
    });
    reviewId = review.id;

    await expect(
      client().product.delete({ where: { id: productId } }),
    ).rejects.toMatchObject({ code: "P2003" });
  });

  it("10. rollback mempertahankan relasi saat penghapusan produk gagal", async () => {
    await expect(
      client().$transaction([
        client().review.deleteMany({ where: { productId } }),
        client().product.delete({ where: { id: productId! + 1_000_000 } }),
      ]),
    ).rejects.toMatchObject({ code: "P2025" });

    const reviews = await client().review.count({ where: { productId } });
    expect(reviews).toBe(1);
  });

  it("11. menghapus produk beserta ulasan dalam satu transaksi", async () => {
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