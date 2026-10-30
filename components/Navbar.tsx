import Link from "next/link";
import TautanNav from "./TautanNav";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <Link href="/" className="text-lg font-extrabold text-blue-950">
          MTM SOLUSINDO
        </Link>

        <div className="text-sm font-medium">
          <TautanNav />
        </div>
      </nav>
    </header>
  );
}