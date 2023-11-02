"use client";

import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle(): JSX.Element {
  const { systemTheme, theme, setTheme } = useTheme();

  return (
    <span
      className="cursor-pointer mx-7"
      onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
    >
      {theme === "dark" ? <FaMoon size={19} /> : <FaSun size={19} />}
    </span>
  );
}
