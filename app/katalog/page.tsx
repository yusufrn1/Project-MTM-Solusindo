import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { daftarProduk } from "@/lib/data";

export default function KatalogPage() {
  const products = daftarProduk();

  return (
    <main>
        <section className="bg-gradient-to-br from-blue-950 to-blue-800 px-6 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Katalog Produk
            </p>

            <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">
              Temukan Solusi Teknologi
            </h1>

            <p className="mt-5 max-w-2xl leading-7 text-blue-100">
              Jelajahi contoh kategori perangkat teknologi untuk mendukung
              kebutuhan operasional bisnis Anda.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="text-2xl font-bold">Pilihan Produk</h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Data produk berikut merupakan contoh untuk prototipe akademik,
                bukan daftar SKU resmi atau konfirmasi ketersediaan produk MTM
                Solusindo.
              </p>
            </div>

            <Link
              href="/katalog/tambah"
              className="rounded-lg border border-blue-800 px-4 py-2 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
            >
              Kelola katalog
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-blue-100 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold">
              Butuh informasi lebih lanjut?
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Hubungi kami untuk menyampaikan kebutuhan perangkat atau
              menanyakan informasi produk.
            </p>

            <Link
              href="/kontak"
              className="mt-5 inline-flex rounded-lg bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
            >
              Hubungi Kami →
            </Link>
          </div>
        </section>
    </main>
  );
}