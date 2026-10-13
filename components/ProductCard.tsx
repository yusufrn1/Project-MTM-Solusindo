type ProductCardProps = {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
};

export default function ProductCard({
  id,
  name,
  category,
  description,
  features,
}: ProductCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
          {category}
        </span>

        <span className="text-xs text-slate-400">{id}</span>
      </div>

      <h2 className="text-lg font-bold text-slate-900">{name}</h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2">
            <span className="text-blue-700" aria-hidden="true">
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={`/kontak?kategori=${encodeURIComponent(category)}`}
        className="mt-auto pt-6 text-sm font-semibold text-blue-800 hover:text-blue-950"
      >
        Hubungi kami untuk informasi produk →
      </a>
    </article>
  );
}