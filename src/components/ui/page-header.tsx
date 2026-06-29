type PageHeaderProps = {
  label?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({
  label,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {label && (
          <p className="text-xs font-semibold uppercase tracking-wide text-[#0e2d33] sm:text-sm">
            {label}
          </p>
        )}

        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </section>
  );
}