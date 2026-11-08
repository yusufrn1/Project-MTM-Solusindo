"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { bacaSesi } from "@/lib/sesi";
import { skemaUlasan } from "@/lib/skema";
import type { StatusForm } from "@/lib/status-form";

function bacaMasukanUlasan(formData: FormData) {
  const masukan = {
    name: formData.get("name"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  };

  return {
    masukan,
    nilai: {
      name: typeof masukan.name === "string" ? masukan.name : "",
      rating: typeof masukan.rating === "string" ? masukan.rating : "",
      comment: typeof masukan.comment === "string" ? masukan.comment : "",
    },
  };
}

export async function simpanUlasan(
  productId: number,
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  const { masukan, nilai } = bacaMasukanUlasan(formData);
  const hasil = skemaUlasan.safeParse(masukan);
  if (!hasil.success) {
    return { galat: z.flattenError(hasil.error).fieldErrors, nilai };
  }

  try {
    await prisma.review.create({
      data: { ...hasil.data, productId },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          galat: { name: ["Nama ini sudah mengulas produk ini."] },
          nilai,
        };
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

export async function ubahUlasan(
  reviewId: number,
  productId: number,
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  if (!(await bacaSesi())) {
    return { pesan: "Silakan masuk terlebih dahulu." };
  }

  if (
    !Number.isSafeInteger(reviewId) ||
    reviewId < 1 ||
    !Number.isSafeInteger(productId) ||
    productId < 1
  ) {
    return { pesan: "Ulasan tidak ditemukan." };
  }

  const { masukan, nilai } = bacaMasukanUlasan(formData);
  const hasil = skemaUlasan.safeParse(masukan);
  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      nilai,
      pesan: "Periksa kembali isian ulasan.",
    };
  }

  try {
    const updated = await prisma.review.updateMany({
      where: { id: reviewId, productId },
      data: hasil.data,
    });
    if (updated.count === 0) {
      return { pesan: "Ulasan tidak ditemukan atau sudah dihapus.", nilai };
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          galat: { name: ["Nama ini sudah mengulas produk ini."] },
          nilai,
        };
      }
      if (error.code === "P2003") {
        return { pesan: "Produk tidak ditemukan.", nilai };
      }
    }
    throw error;
  }

  revalidatePath(`/katalog/${productId}`);
  return { pesan: "Perubahan ulasan disimpan." };
}

export async function hapusUlasan(reviewId: number, productId: number) {
  if (!(await bacaSesi())) redirect("/masuk");

  await prisma.review.deleteMany({ where: { id: reviewId, productId } });
  revalidatePath(`/katalog/${productId}`);
}