import Link from "next/link";

export default function KatalogNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-3 text-4xl font-bold text-gray-900">
        404
      </h1>

      <h2 className="mb-3 text-xl font-semibold">
        Produk Tidak Ditemukan
      </h2>

      <p className="mb-6 text-gray-600">
        Maaf, produk yang kamu cari tidak tersedia di katalog kami.
      </p>

      <Link
        href="/katalog"
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
      >
        Kembali ke Katalog
      </Link>
    </div>
  );
}