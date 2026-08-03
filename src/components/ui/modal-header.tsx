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
    <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <X size={20} />
      </button>
    </div>
  );
}