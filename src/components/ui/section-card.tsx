type SectionCardProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  description,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      {(title || description) && (
        <div className="mb-5">
          {title && (
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
        </div>
      )}

      {children}
    </section>
  );
}