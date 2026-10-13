import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import Button from "@/components/Button";

const categories = [
  {
    number: "01",
    title: "People Counting",
    description:
      "Solusi penghitungan pengunjung untuk membantu analisis kepadatan dan aktivitas pengunjung.",
    icon: "👥",
  },
  {
    number: "02",
    title: "RFID Solutions",
    description:
      "Teknologi identifikasi dan pelacakan barang menggunakan radio frequency identification.",
    icon: "📡",
  },
  {
    number: "03",
    title: "POS Systems",
    description:
      "Perangkat pendukung transaksi dan operasional bisnis retail.",
    icon: "🖥️",
  },
  {
    number: "04",
    title: "Barcode Scanners",
    description:
      "Perangkat pemindai barcode untuk membantu proses identifikasi produk.",
    icon: "▦",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar activePage="beranda" />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Technology Solutions for Business
              </p>

              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Teknologi Tepat untuk{" "}
                <span className="text-cyan-300">Bisnis Lebih Baik</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-blue-100 sm:text-lg">
                Jelajahi solusi teknologi untuk mendukung kebutuhan
                identifikasi, pengelolaan data, dan operasional bisnis.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                 href="/katalog"
  className="inline-flex items-center justify-center rounded-lg bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
                >
                  Jelajahi Katalog
                </a>

                <a
                  href="/kontak"
                  className="inline-flex items-center justify-center rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Hubungi Kami
                </a>
              </div>
            </div>

            <div
              className="flex min-h-64 items-center justify-center rounded-3xl border border-white/15 bg-white/5 p-8 sm:min-h-80"
              aria-label="Ilustrasi teknologi MTM Solusindo"
              role="img"
            >
              <div className="text-center">
                <div className="text-6xl font-black tracking-tight sm:text-8xl">
                  MTM
                </div>
                <div className="mt-3 text-sm font-semibold tracking-[0.3em] text-cyan-300 sm:text-base">
                  SOLUSINDO
                </div>
                <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-cyan-300" />
                <p className="mt-5 text-sm text-blue-100">
                  Smart Technology · Business Solutions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-slate-50 px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-800">
                Solusi Kami
              </p>

              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Jelajahi Kategori Teknologi
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Temukan kategori perangkat yang dapat disesuaikan dengan
                kebutuhan operasional bisnis Anda.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <CategoryCard key={category.number} {...category} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <a
                href="/katalog"
                className="font-semibold text-blue-800 hover:text-blue-950"
              >
                Lihat seluruh katalog →
              </a>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 md:grid-cols-3">
              <article>
                <div className="text-3xl" aria-hidden="true">
                  🎯
                </div>
                <h2 className="mt-4 text-xl font-bold">
                  Solusi Sesuai Kebutuhan
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  Jelajahi pilihan kategori teknologi berdasarkan kebutuhan
                  operasional bisnis.
                </p>
              </article>

              <article>
                <div className="text-3xl" aria-hidden="true">
                  🔎
                </div>
                <h2 className="mt-4 text-xl font-bold">
                  Informasi Produk
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  Pelajari gambaran awal fungsi dan penggunaan perangkat
                  melalui katalog.
                </p>
              </article>

              <article>
                <div className="text-3xl" aria-hidden="true">
                  💬
                </div>
                <h2 className="mt-4 text-xl font-bold">
                  Konsultasi Kebutuhan
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  Sampaikan kebutuhan bisnis melalui halaman kontak.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-50 px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-extrabold">
              Sedang Mencari Solusi Teknologi?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              Mulai dengan menjelajahi katalog atau sampaikan kebutuhan
              perangkat yang ingin Anda cari.
            </p>

            <a
              href="/kontak"
              className="mt-7 inline-flex rounded-lg bg-blue-800 px-6 py-3 font-semibold text-white transition hover:bg-blue-900"
            >
              Diskusikan Kebutuhan Anda
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}