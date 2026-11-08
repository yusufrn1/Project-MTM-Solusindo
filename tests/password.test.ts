import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../lib/crypto/password";

describe("hash password demo dengan scrypt", () => {
  it("membuat hash salted dan hanya memverifikasi kata sandi yang cocok", async () => {
    const hash = await hashPassword("kata-sandi-sintetis-uji");

    expect(hash).toMatch(/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
    expect(await verifyPassword("kata-sandi-sintetis-uji", hash)).toBe(true);
    expect(await verifyPassword("kata-sandi-salah", hash)).toBe(false);
  });

  it.each([undefined, "", "sha256$abc", "scrypt$aa$bb"])(
    "menolak hash yang tidak valid: %s",
    async (hash) => {
      expect(await verifyPassword("kata-sandi-sintetis-uji", hash)).toBe(false);
    },
  );
});