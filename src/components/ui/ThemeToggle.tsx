"use client";


import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "..";

export default function ThemeToggle(): JSX.Element | null {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  if (!mounted) return null;

  return (
    <button
      type="button"
      className="relative rounded-full p-1 text-gray-600 dark:text-white hover:text-gray-400 dark:hover:text-gray-400"
      onClick={handleChange}
    >
      <span className="absolute -inset-1.5" />
      <span className="sr-only">Theme</span>
      {theme === "light" ? (
        <SunIcon className="h-6 w-6" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-6 w-6" aria-hidden="true" />
      )}
    </button>
  );
}
