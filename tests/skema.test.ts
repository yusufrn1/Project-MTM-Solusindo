import { describe, expect, it } from "vitest";
import { skemaKontak } from "../lib/skema";

const dataKontakValid = {
  nama: "Siti Nurhaliza",
  email: "siti@example.com",
  perusahaan: "Contoh Nusantara",
  kategori: "People Counting",
  pesan: "Saya ingin konsultasi solusi RFID.",
};

describe("skemaKontak", () => {
  it("menerima data kontak yang valid", () => {
    expect(skemaKontak.safeParse(dataKontakValid).success).toBe(true);
  });

  it("menolak nama yang mengandung angka", () => {
    const result = skemaKontak.safeParse({
      ...dataKontakValid,
      nama: "Siti123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("Nama hanya boleh");
    }
  });

  it("menolak email tanpa format email yang valid", () => {
    const result = skemaKontak.safeParse({
      ...dataKontakValid,
      email: "siti.example.com",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Masukkan alamat email yang valid.",
      );
    }
  });

  it("menerima nama dengan karakter non-ASCII dan tanda hubung", () => {
    expect(
      skemaKontak.safeParse({
        ...dataKontakValid,
        nama: "Dewi Ayu-Putri Çelik",
      }).success,
    ).toBe(true);
  });
});