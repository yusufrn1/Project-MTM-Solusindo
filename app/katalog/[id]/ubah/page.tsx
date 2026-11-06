import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { ubahProduk } from "@/app/katalog/actions";
import FormProduk from "@/components/FormProduk";
import { cariProduk } from "@/lib/data";
import { bacaSesi } from "@/lib/sesi";

export const metadata: Metadata = {
  title: "Ubah Produk | MTM Solusindo",
};

type UbahProdukPageProps = {
  params: Promise<{ id: string }>;
};

export default function UbahProdukPage({ params }: UbahProdukPageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
          <p role="status">Memuat produk...</p>
        </main>
      }
    >
      <KontenUbahProduk params={params} />
    </Suspense>
  );
}

async function KontenUbahProduk({ params }: UbahProdukPageProps) {
  await connection();
  if (!(await bacaSesi())) redirect("/masuk");

  const { id: rawId } = await params;
  if (!/^[1-9]\d*$/.test(rawId)) notFound();
  const product = await cariProduk(Number(rawId));
  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href={`/katalog/${product.id}`}
        className="text-sm font-semibold text-blue-800 hover:text-blue-950"
      >
        ← Kembali ke detail
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold">Ubah produk</h1>
      <FormProduk
        action={ubahProduk.bind(null, product.id)}
        initialValues={{
          name: product.name,
          category: product.category,
          description: product.description,
          features: product.features,
          aktif: product.aktif,
        }}
        submitLabel="Simpan perubahan"
      />
    </main>
  );
}