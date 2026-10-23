import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-3xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-slate-600">
        Alamat yang Anda buka tidak tersedia.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex font-semibold text-blue-800 hover:text-blue-950"
      >
        Kembali ke beranda
      </Link>
    </main>
  );
}