"use client";

import { buttonColors } from "@/constants";
import { createRipple } from "@/libs";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  height?: string;
  width?: string;
  color?: "primary" | "secondary" | "danger";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      size = "md",
      color = "primary",
      height,
      width,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event);

      if (onClick) {
        onClick(event);
      }
    };

    return (
      <button
        style={{ height: `${height}rem`, width: `${width}rem` }}
        className={`${className} relative overflow-hidden items-center justify-center rounded-xl px-3 py-2 outline-none border-0 shadow-md cursor-pointer select-none hover:brightness-125 active:brightness-150 active:scale-95 transition-filter duration-300 ease-in-out text-white disabled:bg-blue-300 disabled:dark:bg-blue-950 disabled:text-blue-200 disabled:dark:text-blue-900 disabled:shadow-sm disabled:cursor-not-allowed text-${size} ${buttonColors[color]}`}
        onClick={handleButtonClick}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
