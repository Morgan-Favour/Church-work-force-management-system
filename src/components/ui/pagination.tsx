import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      <Link
        href={`${basePath}?page=${currentPage - 1}`}
        prefetch={false}
        className={`rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 ${
          currentPage <= 1
            ? "pointer-events-none opacity-40"
            : "hover:bg-slate-50"
        }`}
      >
        Previous
      </Link>

      <p className="text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </p>

      <Link
        href={`${basePath}?page=${currentPage + 1}`}
        prefetch={false}
        className={`rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 ${
          currentPage >= totalPages
            ? "pointer-events-none opacity-40"
            : "hover:bg-slate-50"
        }`}
      >
        Next
      </Link>
    </div>
  );
}