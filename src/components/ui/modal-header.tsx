"use client";

import { X } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  onClose: () => void;
};

export function ModalHeader({
  title,
  description,
  onClose,
}: Props) {
  return (
    <div className="flex items-start justify-between border-b border-border px-6 py-5">
      <div>
        <h2 className="text-xl font-bold text-card-foreground">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-xl p-2 text-muted-foreground transition hover:bg-muted hover:text-card-foreground"
      >
        <X size={20} />
      </button>
    </div>
  );
}