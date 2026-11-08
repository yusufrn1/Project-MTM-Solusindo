import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { hashPassword } from "../lib/crypto/password";

async function main() {
  const prompt = createInterface({ input: stdin, output: stdout });
  const password = await prompt.question(
    "Kata sandi sintetis akun demo (minimal 8 karakter): ",
  );
  prompt.close();

  if (password.length < 8) {
    throw new Error("Kata sandi demo minimal 8 karakter.");
  }

  console.log(await hashPassword(password));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Gagal membuat hash.");
  process.exitCode = 1;
});