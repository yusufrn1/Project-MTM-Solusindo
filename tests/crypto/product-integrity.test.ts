import { describe, expect, it } from "vitest";
import {
  createProductSignature,
  verifyProductSignature,
} from "../../lib/crypto/product-integrity";

const testKey = "synthetic-test-key-only-not-for-production";

const product = JSON.stringify({
  id: "PRD-001",
  name: "Produk Contoh",
  price: 150000,
});

describe("Product Integrity - HMAC-SHA-256", () => {
  it("membuat tanda tangan HMAC sepanjang 64 karakter hex", () => {
    const signature = createProductSignature(product, testKey);

    expect(signature).toMatch(/^[0-9a-f]{64}$/);
  });

  it("menerima data asli dengan tanda tangan yang benar", () => {
    const signature = createProductSignature(product, testKey);

    expect(
      verifyProductSignature(product, signature, testKey),
    ).toBe(true);
  });

  it("menolak data produk yang telah diubah", () => {
    const signature = createProductSignature(product, testKey);
    const modifiedProduct = product.replace("150000", "100000");

    expect(
      verifyProductSignature(modifiedProduct, signature, testKey),
    ).toBe(false);
  });

  it("menolak tanda tangan dengan format tidak valid", () => {
    expect(
      verifyProductSignature(product, "signature-palsu", testKey),
    ).toBe(false);
  });

  it("menolak payload kosong", () => {
    expect(() => createProductSignature("", testKey)).toThrow(
      "Payload tidak boleh kosong.",
    );
  });

  it("menolak verifikasi dengan kunci yang berbeda", () => {
    const signature = createProductSignature(product, testKey);

    expect(
      verifyProductSignature(product, signature, "wrong-test-key"),
    ).toBe(false);
  });
});
