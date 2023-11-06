"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";


export default function ThemeToggle(): JSX.Element {
  const { theme, setTheme } = useTheme();

  const handleChange = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <button
      type="button"
      className="relative rounded-full p-1 text-gray-600 dark:text-gray-400 hover:text-gray-400 dark:hover:text-white"
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
