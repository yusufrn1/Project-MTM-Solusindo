import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 px-6 py-8 text-sm text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-white">MTM SOLUSINDO</p>
          <p className="mt-1 text-slate-400">
            Technology Solutions for Business
          </p>
        </div>

        <nav aria-label="Navigasi footer" className="flex flex-wrap gap-5">
          <Link href="/" className="hover:text-cyan-300">
            Beranda
          </Link>
          <Link href="/katalog" className="hover:text-cyan-300">
            Katalog
          </Link>
          <Link href="/kontak" className="hover:text-cyan-300">
            Kontak
          </Link>
        </nav>
      </div>

      <div className="mx-auto mt-7 max-w-7xl border-t border-white/10 pt-5 text-xs leading-6 text-slate-500">
        © 2026 MTM Solusindo. Prototipe antarmuka katalog teknologi.
      </div>
    </footer>
  );
}