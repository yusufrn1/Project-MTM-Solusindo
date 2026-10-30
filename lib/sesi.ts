import "server-only";
import { cookies } from "next/headers";
import {
  bacaRekamanSesi,
  buatRekamanSesi,
  hapusRekamanSesi,
} from "@/lib/session-store";

const DELAPAN_JAM = 60 * 60 * 8;

export async function buatSesi(email: string) {
  const id = buatRekamanSesi(email);
  (await cookies()).set("sesi", id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DELAPAN_JAM,
  });
}

export async function bacaSesi() {
  const id = (await cookies()).get("sesi")?.value;
  return bacaRekamanSesi(id);
}

export async function hapusSesi() {
  const cookieStore = await cookies();
  hapusRekamanSesi(cookieStore.get("sesi")?.value);
  cookieStore.delete("sesi");
}