"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { skemaMasuk } from "@/lib/skema";
import { buatSesi, hapusSesi } from "@/lib/sesi";
import type { StatusForm } from "@/lib/status-form";

export async function masuk(
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  const mentah = Object.fromEntries(formData.entries());
  const hasil = skemaMasuk.safeParse(mentah);
  if (!hasil.success) {
    return { galat: z.flattenError(hasil.error).fieldErrors };
  }

  if (
    hasil.data.email !== process.env.DEMO_EMAIL ||
    hasil.data.kataSandi !== process.env.DEMO_KATA_SANDI
  ) {
    return { pesan: "Email atau kata sandi salah." };
  }

  await buatSesi(hasil.data.email);
  redirect("/katalog/tambah");
}

export async function keluar() {
  await hapusSesi();
  redirect("/");
}