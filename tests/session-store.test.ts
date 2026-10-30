import { describe, expect, it } from "vitest";
import {
  bacaRekamanSesi,
  buatRekamanSesi,
  hapusRekamanSesi,
} from "../lib/session-store";

describe("penyimpanan sesi demo", () => {
  it("menolak sesi tanpa pengenal", () => {
    expect(bacaRekamanSesi(undefined)).toBeNull();
  });

  it("menolak pengenal cookie palsu", () => {
    expect(bacaRekamanSesi("id-palsu")).toBeNull();
  });

  it("menerima sesi yang masih berlaku", () => {
    const sekarang = 1_800_000_000_000;
    const id = buatRekamanSesi("admin@mtm.local", sekarang);

    expect(bacaRekamanSesi(id, sekarang)?.email).toBe("admin@mtm.local");
  });

  it("menolak sesi yang sudah kedaluwarsa", () => {
    const sekarang = 1_800_000_000_000;
    const id = buatRekamanSesi("admin@mtm.local", sekarang);

    expect(bacaRekamanSesi(id, sekarang + 8 * 60 * 60 * 1000 + 1)).toBeNull();
  });

  it("menolak pemakaian ulang pengenal setelah logout", () => {
    const id = buatRekamanSesi("admin@mtm.local");
    hapusRekamanSesi(id);

    expect(bacaRekamanSesi(id)).toBeNull();
  });
});