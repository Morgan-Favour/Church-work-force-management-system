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
        className={`rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold text-card-foreground transition ${
          currentPage <= 1
            ? "pointer-events-none opacity-40"
            : "hover:bg-muted/50"
        }`}
      >
        Previous
      </Link>

      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>

      <Link
        href={`${basePath}?page=${currentPage + 1}`}
        prefetch={false}
        className={`rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold text-card-foreground transition ${
          currentPage >= totalPages
            ? "pointer-events-none opacity-40"
            : "hover:bg-muted/50"
        }`}
      >
        Next
      </Link>
    </div>
  );
}