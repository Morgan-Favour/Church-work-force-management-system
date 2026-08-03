"use client";

import { SessionProvider } from "next-auth/react";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider
    refetchInterval={0}          // disable automatic polling
    refetchOnWindowFocus={false} // stop refetch when you switch tabs
  >
    {children}
  </SessionProvider>;
}