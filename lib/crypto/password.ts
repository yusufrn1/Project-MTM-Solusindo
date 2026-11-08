import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const PANJANG_KUNCI = 64;
const SALT_BYTES = 16;
const OPSI_SCRYPT = { N: 1 << 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

function turunkanKunci(kataSandi: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(kataSandi, salt, PANJANG_KUNCI, OPSI_SCRYPT, (error, kunci) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(kunci);
    });
  });
}

export async function hashPassword(kataSandi: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const kunci = await turunkanKunci(kataSandi, salt);
  return `scrypt$${salt.toString("hex")}$${kunci.toString("hex")}`;
}

export async function verifyPassword(
  kataSandi: string,
  encoded: string | undefined,
): Promise<boolean> {
  if (!encoded) return false;

  const [algoritma, saltHex, kunciHex, ...sisa] = encoded.split("$");
  if (
    algoritma !== "scrypt" ||
    sisa.length !== 0 ||
    !saltHex ||
    !/^[a-f0-9]{32}$/i.test(saltHex) ||
    !kunciHex ||
    !/^[a-f0-9]{128}$/i.test(kunciHex)
  ) {
    return false;
  }

  const expected = Buffer.from(kunciHex, "hex");
  const actual = await turunkanKunci(kataSandi, Buffer.from(saltHex, "hex"));
  return timingSafeEqual(actual, expected);
}