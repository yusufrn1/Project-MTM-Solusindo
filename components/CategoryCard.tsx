type CategoryCardProps = {
  number: string;
  title: string;
  description: string;
  icon: string;
};

export default function CategoryCard({
  number,
  title,
  description,
  icon,
}: CategoryCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-3xl" aria-hidden="true">
          {icon}
        </span>

        <span className="text-sm font-semibold text-slate-400">
          {number}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </article>
  );
}