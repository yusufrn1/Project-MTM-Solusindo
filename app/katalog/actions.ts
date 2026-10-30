"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  namaProdukSudahAda,
  tambahProduk,
} from "@/lib/data";
import { skemaProduk } from "@/lib/skema";
import { bacaSesi } from "@/lib/sesi";
import type { StatusForm } from "@/lib/status-form";

export async function simpanProduk(
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  if (!(await bacaSesi())) {
    return { pesan: "Silakan masuk terlebih dahulu." };
  }

  const mentah = Object.fromEntries(formData.entries());
  const nilai: Record<string, string> = {
    name: String(mentah.name ?? ""),
    category: String(mentah.category ?? ""),
    description: String(mentah.description ?? ""),
    features: String(mentah.features ?? ""),
    aktif: String(mentah.aktif ?? ""),
  };
  const hasil = skemaProduk.safeParse(mentah);

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  if (namaProdukSudahAda(hasil.data.name)) {
    return {
      galat: { name: ["Nama produk sudah digunakan."] },
      nilai,
    };
  }

  let id: number;
  try {
    id = tambahProduk(hasil.data).id;
  } catch (error) {
    console.error("simpanProduk gagal:", error);
    return { pesan: "Produk gagal disimpan. Coba lagi.", nilai };
  }

  revalidatePath("/katalog");
  redirect(`/katalog/${id}`);
}