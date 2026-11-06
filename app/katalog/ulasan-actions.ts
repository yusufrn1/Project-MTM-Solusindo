"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { bacaSesi } from "@/lib/sesi";
import { skemaUlasan } from "@/lib/skema";
import type { StatusForm } from "@/lib/status-form";

export async function simpanUlasan(
  productId: number,
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  const nilai = Object.fromEntries(formData.entries());
  const hasil = skemaUlasan.safeParse(nilai);
  if (!hasil.success) {
    return { galat: z.flattenError(hasil.error).fieldErrors };
  }

  try {
    await prisma.review.create({
      data: { ...hasil.data, productId },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { galat: { name: ["Nama ini sudah mengulas produk ini."] } };
      }
      if (error.code === "P2003") {
        return { pesan: "Produk tidak ditemukan." };
      }
    }
    throw error;
  }

  revalidatePath(`/katalog/${productId}`);
  return { pesan: "Ulasan berhasil disimpan." };
}

export async function hapusUlasan(reviewId: number, productId: number) {
  if (!(await bacaSesi())) redirect("/masuk");

  await prisma.review.deleteMany({ where: { id: reviewId, productId } });
  revalidatePath(`/katalog/${productId}`);
}