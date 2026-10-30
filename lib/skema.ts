import { z } from "zod";

export const kategoriKontak = [
  "People Counting",
  "RFID Solutions",
  "POS Systems",
  "Barcode Scanners",
  "Data Collection",
  "Lainnya",
] as const;

export const kategoriProduk = [
  "People Counting",
  "RFID Solutions",
  "POS Systems",
  "Barcode Scanners",
  "Data Collection",
] as const;

export const skemaKontak = z.object({
  nama: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi.")
    .regex(
      /^[\p{L}\p{M}\s.'’-]+$/u,
      "Nama hanya boleh berisi huruf, spasi, tanda hubung, apostrof, atau titik.",
    ),
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi.")
    .pipe(z.email("Masukkan alamat email yang valid.")),
  perusahaan: z.string().trim().min(1, "Nama perusahaan wajib diisi."),
  kategori: z.enum(kategoriKontak, {
    error: "Pilih kategori kebutuhan Anda.",
  }),
  pesan: z
    .string()
    .trim()
    .min(1, "Pesan wajib diisi.")
    .pipe(z.string().min(10, "Pesan minimal 10 karakter.")),
});

export const skemaProduk = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nama produk minimal 3 karakter.")
    .max(80, "Nama produk maksimal 80 karakter."),
  category: z.enum(kategoriProduk, {
    error: "Pilih kategori produk yang tersedia.",
  }),
  description: z
    .string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter.")
    .max(300, "Deskripsi maksimal 300 karakter."),
  features: z
    .string()
    .trim()
    .min(3, "Isi minimal satu fitur produk.")
    .max(500, "Daftar fitur maksimal 500 karakter.")
    .transform((value) =>
      value
        .split("\n")
        .map((feature) => feature.trim())
        .filter(Boolean),
    ),
  aktif: z.stringbool().default(false),
});

export type MasukanProduk = z.infer<typeof skemaProduk>;

export const skemaMasuk = z.object({
  email: z.email("Format email tidak valid."),
  kataSandi: z.string().min(8, "Kata sandi minimal 8 karakter."),
});