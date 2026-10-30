import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import FormProduk from "@/components/FormProduk";
import { keluar } from "@/app/masuk/actions";
import { bacaSesi } from "@/lib/sesi";

export const metadata: Metadata = {
  title: "Tambah Produk | MTM Solusindo",
};

export default function TambahProdukPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
          <p role="status">Memuat area pengelola...</p>
        </main>
      }
    >
      <IsiTambahProduk />
    </Suspense>
  );
}

async function IsiTambahProduk() {
  await connection();
  const sesi = await bacaSesi();
  if (!sesi) redirect("/masuk");

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-sm font-semibold text-blue-800">Kelola katalog</p>
          <h1 className="mt-2 text-3xl font-extrabold">Tambah produk</h1>
          <p className="mt-2 text-sm text-slate-600">
            Masuk sebagai {sesi.email}
          </p>
        </div>
        <form action={keluar}>
          <button
            type="submit"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Keluar
          </button>
        </form>
      </div>

      <FormProduk />
    </main>
  );
}