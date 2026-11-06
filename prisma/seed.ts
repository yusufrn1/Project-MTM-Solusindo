import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { dataAwal } from "./data-awal";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL belum diatur pada environment lokal.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  for (const data of dataAwal) {
    const product = await prisma.product.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });

    await prisma.review.upsert({
      where: {
        productId_name: { productId: product.id, name: "Pengguna Uji" },
      },
      update: {},
      create: {
        productId: product.id,
        name: "Pengguna Uji",
        rating: 4,
        comment: "Ulasan sintetis untuk pengujian modul.",
      },
    });
  }

  const [products, reviews] = await Promise.all([
    prisma.product.count(),
    prisma.review.count(),
  ]);
  console.log(`Seed selesai: ${products} produk, ${reviews} ulasan`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());