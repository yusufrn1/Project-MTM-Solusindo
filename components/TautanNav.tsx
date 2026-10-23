"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tautan = [
  { href: "/", label: "Beranda" },
  { href: "/katalog", label: "Katalog" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
];

export default function TautanNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-4">
      {tautan.map((item) => {
        const aktif =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`transition-colors hover:text-blue-600 ${
              aktif ? "font-bold text-blue-600" : "text-gray-700"
            }`}
            aria-current={aktif ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}