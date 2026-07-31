import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  children: ReactNode;
};

export function InviteRegistrationLayout({
  title,
  description,
  children,
}: Props) {
  return (
    <div className="mx-auto mt-16 max-w-xl rounded-2xl border bg-white p-8 shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0e2d33]">
          {title}
        </h1>

        <p className="mt-2 text-gray-500">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}