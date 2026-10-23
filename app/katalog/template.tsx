import KolomCatatan from "@/components/KolomCatatan";

export default function KatalogTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <aside className="mb-6 max-w-md" aria-label="Catatan template">
        <KolomCatatan label="Catatan di template" />
      </aside>
      {children}
    </div>
  );
}