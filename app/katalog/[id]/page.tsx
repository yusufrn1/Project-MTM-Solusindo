import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cariProduk, daftarProduk } from "@/lib/data";

type DetailProdukPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return daftarProduk().map((produk) => ({
    id: String(produk.id),
  }));
}

export default function DetailProdukPage({ params }: DetailProdukPageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-4xl px-6 py-16">
          <p role="status">Memuat detail produk...</p>
        </main>
      }
    >
      <DetailProduk params={params} />
    </Suspense>
  );
}

async function DetailProduk({
  params,
}: DetailProdukPageProps) {
  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  const productId = Number(id);

  const product = cariProduk(productId);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/katalog"
          className="text-sm font-semibold text-blue-800 hover:text-blue-950"
        >
          ← Kembali ke katalog
        </Link>

        <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-lg bg-slate-100">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
            <span className="absolute bottom-3 left-3 rounded-sm bg-white/90 px-2 py-1 text-xs font-medium text-slate-700">
              Ilustrasi kategori, bukan foto model produk
            </span>
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-800">
            {product.category}
          </p>

          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Kode produk: {product.kode}
          </p>

          <p className="mt-6 leading-7 text-slate-600">
            {product.description}
          </p>

          <h2 className="mt-8 text-xl font-bold">Fitur Produk</h2>

          <ul className="mt-4 space-y-3">
            {product.features.map((feature) => (
              <li key={feature} className="flex gap-3 text-slate-600">
                <span className="text-blue-700" aria-hidden="true">
                  ✓
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 rounded-lg bg-blue-50 p-4 text-sm leading-6 text-blue-900">
            Informasi ini merupakan contoh data untuk prototipe akademik,
            bukan konfirmasi spesifikasi atau ketersediaan produk.
          </p>

          <Link
            href={`/kontak?kategori=${encodeURIComponent(product.category)}`}
            className="mt-6 inline-flex rounded-lg bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            Hubungi Kami →
          </Link>
        </article>
    </main>
  );
}
