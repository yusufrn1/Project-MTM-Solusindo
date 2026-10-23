import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main>
        <section className="bg-gradient-to-br from-blue-950 to-blue-800 px-6 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Tentang Kami
            </p>

            <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">
              Mengenal MTM Solusindo
            </h1>

            <p className="mt-5 max-w-2xl leading-7 text-blue-100">
              Halaman pengenalan untuk memberikan gambaran mengenai situs
              katalog teknologi dan contoh solusi perangkat untuk kebutuhan
              operasional bisnis.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Tujuan Situs</h2>

            <p className="mt-4 leading-7 text-slate-600">
              Situs ini dikembangkan sebagai prototipe akademik untuk
              menampilkan katalog contoh perangkat teknologi, menjelaskan
              kategori dan fitur produk, serta menyediakan akses ke halaman
              kontak.
            </p>

            <h2 className="mt-8 text-2xl font-bold">Informasi Produk</h2>

            <p className="mt-4 leading-7 text-slate-600">
              Informasi yang ditampilkan merupakan data contoh untuk
              kebutuhan pengembangan antarmuka. Informasi tersebut bukan
              konfirmasi resmi mengenai produk, spesifikasi, atau
              ketersediaan dari MTM Solusindo.
            </p>

            <Link
              href="/katalog"
              className="mt-6 inline-flex rounded-lg bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
            >
              Jelajahi Katalog →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
