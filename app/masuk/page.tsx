import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import FormMasuk from "@/components/FormMasuk";
import { bacaSesi } from "@/lib/sesi";

export const metadata: Metadata = { title: "Masuk | MTM Solusindo" };

export default function MasukPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16">
          <p role="status">Memeriksa sesi...</p>
        </main>
      }
    >
      <KontenMasuk />
    </Suspense>
  );
}

async function KontenMasuk() {
  await connection();
  if (await bacaSesi()) redirect("/katalog/tambah");

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16">
      <p className="text-sm font-semibold text-blue-800">Area pengelola</p>
      <h1 className="mt-2 text-3xl font-extrabold">Masuk</h1>
      <p className="mt-3 leading-7 text-slate-600">
        Masuk untuk mengelola produk katalog.
      </p>
      <FormMasuk />
    </main>
  );
}