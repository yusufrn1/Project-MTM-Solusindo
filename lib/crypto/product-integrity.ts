import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Membuat HMAC-SHA-256 untuk memeriksa integritas data produk.
 * Gunakan hanya di sisi server. Jangan kirim kunci rahasia ke browser.
 */
export function createProductSignature(
  payload: string,
  secretKey: string,
): string {
  if (!payload.trim()) {
    throw new Error("Payload tidak boleh kosong.");
  }

  if (!secretKey) {
    throw new Error("Kunci rahasia tidak boleh kosong.");
  }

  return createHmac("sha256", secretKey)
    .update(payload, "utf8")
    .digest("hex");
}

/**
 * Memverifikasi HMAC secara aman terhadap perbedaan waktu perbandingan.
 */
export function verifyProductSignature(
  payload: string,
  signature: string,
  secretKey: string,
): boolean {
  if (!payload.trim() || !secretKey) {
    return false;
  }

  if (!/^[0-9a-f]{64}$/i.test(signature)) {
    return false;
  }

  const expected = createProductSignature(payload, secretKey);
  const actualBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}
