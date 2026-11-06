import { describe, expect, it } from "vitest";
import { skemaProduk, skemaUlasan } from "../lib/skema";

const produkValid = {
  name: "RFID Gateway",
  category: "RFID Solutions",
  description: "Perangkat pembaca RFID untuk kebutuhan inventaris.",
  features: "Identifikasi barang\nDukungan inventaris",
  aktif: "on",
};

describe("validasi server skemaProduk", () => {
  it.each([
    ["nama kosong", { name: "" }],
    ["nama terlalu pendek", { name: "AB" }],
    ["nama terlalu panjang", { name: "R".repeat(81) }],
    ["kategori tidak dikirim", { category: undefined }],
    ["kategori palsu", { category: "Elektronik" }],
    ["deskripsi terlalu pendek", { description: "Singkat" }],
    ["deskripsi terlalu panjang", { description: "D".repeat(301) }],
    ["fitur kosong", { features: "   " }],
    ["fitur terlalu panjang", { features: "F".repeat(501) }],
    ["nilai checkbox palsu", { aktif: "maybe" }],
  ])("menolak %s", (_caseName, override) => {
    expect(skemaProduk.safeParse({ ...produkValid, ...override }).success).toBe(
      false,
    );
  });

  it("menerima formulir valid dan memetakan baris fitur menjadi array", () => {
    const result = skemaProduk.safeParse(produkValid);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.features).toEqual([
        "Identifikasi barang",
        "Dukungan inventaris",
      ]);
      expect(result.data.aktif).toBe(true);
    }
  });

  it("mengisi checkbox yang tidak dikirim dengan false", () => {
    const tanpaCheckbox = Object.fromEntries(
      Object.entries(produkValid).filter(([key]) => key !== "aktif"),
    );
    const result = skemaProduk.safeParse(tanpaCheckbox);

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.aktif).toBe(false);
  });
});

describe("validasi server skemaUlasan", () => {
  const ulasanValid = {
    name: "Pelanggan Uji",
    rating: "5",
    comment: "Produk bekerja dengan baik.",
  };

  it("menerima ulasan valid dan mengubah nilai menjadi angka", () => {
    const result = skemaUlasan.safeParse(ulasanValid);

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.rating).toBe(5);
  });

  it.each(["0", "6", "2.5", "bukan-angka"])(
    "menolak nilai %s di luar rentang 1–5 atau bukan bilangan bulat",
    (rating) => {
      expect(skemaUlasan.safeParse({ ...ulasanValid, rating }).success).toBe(
        false,
      );
    },
  );

  it("menolak komentar yang terlalu pendek", () => {
    expect(
      skemaUlasan.safeParse({ ...ulasanValid, comment: "ok" }).success,
    ).toBe(false);
  });
});