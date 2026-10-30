import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  id: number;
  kode: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
};

export default function ProductCard({
  id,
  kode,
  name,
  category,
  description,
  features,
  image,
  imageAlt,
}: ProductCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 hover:scale-[1.03]"
        />
        <span className="absolute bottom-3 left-3 rounded-sm bg-white/90 px-2 py-1 text-xs font-medium text-slate-700">
          Ilustrasi
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="rounded-sm bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
            {category}
          </span>

          <span className="text-xs text-slate-400">{kode}</span>
        </div>

        <h2 className="text-lg font-bold text-slate-900">{name}</h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>

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

        <Link
          href={`/katalog/${id}`}
          className="mt-auto pt-6 text-sm font-semibold text-blue-800 hover:text-blue-950"
        >
          Lihat detail produk →
        </Link>
      </div>
    </article>
  );
}