"use client";

import { Button } from "@/components/ui/button";
import { useIsMounted } from "@/hooks";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface ThemeToggleProps {
  isMobile?: boolean;
}

export function ThemeToggle({ isMobile = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!isMounted) {
    return isMobile ? (
      <Button
        variant="ghost"
        onClick={handleToggleTheme}
        className="flex items-center gap-2 w-full justify-start p-2 hover:bg-secondary rounded-md"
      >
        <Sun className="h-4 w-4" />
        <span>Toggle Theme</span>
      </Button>
    ) : (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  if (isMobile) {
    return (
      <Button
        variant="ghost"
        onClick={handleToggleTheme}
        className="flex items-center gap-2 w-full justify-start p-2 hover:bg-secondary rounded-md text-base hover:text-foreground"
      >
        {theme === "light" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
        <span>Switch to {theme === "light" ? "Dark" : "Light"} Theme</span>
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleToggleTheme}>
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      ) : (
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
