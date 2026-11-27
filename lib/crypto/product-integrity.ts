import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const PESAN_KUNCI_TIDAK_VALID =
  "Kunci rahasia harus berupa Base64 kanonis dengan panjang 32 byte.";

export type ProductIntegrityPayload = {
  name: string;
  category: string;
  description: string;
  features: string[];
  active: boolean;
  image: string | null;
  imageAlt: string | null;
};

export function generateProductIntegrityKey(): string {
  return randomBytes(32).toString("base64");
}

function validasiKunci(secretKey: string): boolean {
  if (typeof secretKey !== "string") return false;

  const decoded = Buffer.from(secretKey, "base64");

  return decoded.length === 32 && decoded.toString("base64") === secretKey;
}

export function serializeProductIntegrityPayload(
  product: ProductIntegrityPayload,
): string {
  return JSON.stringify({
    name: product.name,
    category: product.category,
    description: product.description,
    features: product.features,
    active: product.active,
    image: product.image,
    imageAlt: product.imageAlt,
  });
}

export function createProductSignature(
  payload: string,
  secretKey: string,
): string {
  if (!payload.trim()) {
    throw new Error("Payload tidak boleh kosong.");
  }

  if (!validasiKunci(secretKey)) {
    throw new Error(PESAN_KUNCI_TIDAK_VALID);
  }

  return createHmac("sha256", Buffer.from(secretKey, "base64"))
    .update(payload, "utf8")
    .digest("hex");
}

export function verifyProductSignature(
  payload: string,
  signature: string,
  secretKey: string,
): boolean {
  if (
    typeof payload !== "string" ||
    !payload.trim() ||
    typeof signature !== "string" ||
    !/^[0-9a-f]{64}$/i.test(signature) ||
    !validasiKunci(secretKey)
  ) {
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
export function getProductIntegrityKey(): string {
  const secretKey = process.env.PRODUCT_INTEGRITY_KEY;

  if (!secretKey) {
    throw new Error("PRODUCT_INTEGRITY_KEY belum diatur.");
  }

  // Validasi format dan panjang key.
  createProductSignature("validasi-kunci", secretKey);

  return secretKey;
}
