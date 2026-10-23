import type { ReactNode } from "react";
import KolomCatatan from "@/components/KolomCatatan";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type KatalogLayoutProps = {
  children: ReactNode;
};

export default function KatalogLayout({
  children,
}: KatalogLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-6">
        <aside className="mb-6 max-w-md" aria-label="Catatan katalog">
          <KolomCatatan label="Catatan di layout" />
        </aside>
        {children}
      </div>
      <Footer />
    </div>
  );
}
