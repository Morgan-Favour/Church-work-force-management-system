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
    <div className="mx-auto mt-16 max-w-xl rounded-2xl border border-border bg-card p-8 shadow-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-card-foreground">
          {title}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}