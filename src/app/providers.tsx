"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <SessionProvider>{children}</SessionProvider>
      </NextThemesProvider>

  );
}
