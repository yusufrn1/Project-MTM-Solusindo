"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { z } from "zod";
import { gambarUntukKategori } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { skemaProduk, type MasukanProduk } from "@/lib/skema";
import { bacaSesi } from "@/lib/sesi";
import type { StatusForm } from "@/lib/status-form";

function nilaiForm(formData: FormData): Record<string, string> {
  const entries = Object.fromEntries(formData.entries());
  return {
    name: String(entries.name ?? ""),
    category: String(entries.category ?? ""),
    description: String(entries.description ?? ""),
    features: String(entries.features ?? ""),
    aktif: String(entries.aktif ?? ""),
  };
}

function dataProduk(masukan: MasukanProduk) {
  return {
    name: masukan.name,
    category: masukan.category,
    description: masukan.description,
    features: masukan.features,
    active: masukan.aktif,
    ...gambarUntukKategori(masukan.category),
  };
}

function galatDikenal(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

export async function simpanProduk(
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  if (!(await bacaSesi())) {
    return { pesan: "Silakan masuk terlebih dahulu." };
  }

  const nilai = nilaiForm(formData);
  const hasil = skemaProduk.safeParse(Object.fromEntries(formData.entries()));

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  let productId: number;
  try {
    const product = await prisma.product.create({
      data: dataProduk(hasil.data),
    });
    productId = product.id;
  } catch (error) {
    if (galatDikenal(error) && error.code === "P2002") {
      return { galat: { name: ["Nama produk sudah digunakan."] }, nilai };
    }
    console.error("simpanProduk gagal:", error);
    return { pesan: "Produk gagal disimpan. Coba lagi.", nilai };
  }

  revalidatePath("/katalog");
  redirect(`/katalog/${productId}`);
}

export async function ubahProduk(
  id: number,
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  if (!(await bacaSesi())) {
    return { pesan: "Silakan masuk terlebih dahulu." };
  }

  const nilai = nilaiForm(formData);
  const hasil = skemaProduk.safeParse(Object.fromEntries(formData.entries()));
  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  try {
    await prisma.product.update({ where: { id }, data: dataProduk(hasil.data) });
  } catch (error) {
    if (galatDikenal(error)) {
      if (error.code === "P2002") {
        return { galat: { name: ["Nama produk sudah digunakan."] }, nilai };
      }
      if (error.code === "P2025") {
        return { pesan: "Produk tidak ditemukan atau sudah dihapus.", nilai };
      }
    }
    console.error("ubahProduk gagal:", error);
    return { pesan: "Produk gagal diperbarui. Coba lagi.", nilai };
  }

  revalidatePath("/katalog");
  revalidatePath(`/katalog/${id}`);
  return { pesan: "Perubahan produk disimpan." };
}

export async function hapusProduk(id: number) {
  if (!(await bacaSesi())) redirect("/masuk");

  let tidakDitemukan = false;
  try {
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);
  } catch (error) {
    if (galatDikenal(error) && error.code === "P2025") {
      tidakDitemukan = true;
    } else {
      throw error;
    }
  }

  if (tidakDitemukan) redirect("/katalog");
  revalidatePath("/katalog");
  redirect("/katalog");
}