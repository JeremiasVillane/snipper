"use client";

import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { MoonIcon } from "./MoonIcon";
import { SunIcon } from "./SunIcon";

export default function ThemeToggle(): JSX.Element {
  const useEffectRan = useRef<boolean>(false);
  const { theme, setTheme } = useTheme();
  const [isSelected, setIsSelected] = useState<boolean | undefined>();

  useEffect(() => {
    if (useEffectRan.current === false) {
      setIsSelected(theme === "light" ? true : false);

      return () => {
        useEffectRan.current = true;
      };
    }
  }, []);

  const handleChange = () => {
    if (theme === "dark") {
      setTheme("light");
      setIsSelected(true);
    } else {
      setTheme("dark");
      setIsSelected(false);
    }
  };

  return (
    <Switch
      isSelected={isSelected}
      onChange={handleChange}
      size="lg"
      startContent={<SunIcon />}
      endContent={<MoonIcon />}
      className={isSelected === undefined ? `hidden` : ""}
    />
  );
}
