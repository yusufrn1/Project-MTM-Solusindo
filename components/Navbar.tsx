type NavbarProps = {
  activePage?: "beranda" | "katalog" | "kontak";
};

export default function Navbar({ activePage }: NavbarProps) {
  const links = [
    { label: "Beranda", href: "/", page: "beranda" },
    { label: "Katalog", href: "/katalog", page: "katalog" },
    { label: "Kontak", href: "/kontak", page: "kontak" },
  ];

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5"
      >
        <a href="/" className="text-lg font-extrabold text-blue-950">
          MTM SOLUSINDO
        </a>

        <div className="flex gap-5 text-sm font-medium">
          {links.map((link) => (
            <a
              key={link.page}
              href={link.href}
              aria-current={activePage === link.page ? "page" : undefined}
              className={
                activePage === link.page
                  ? "text-blue-800"
                  : "transition hover:text-blue-700"
              }
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}