"use client";

import React from "react";
import { LoaderAnimIcon } from "..";

const buttonColors = {
  primary: "rgb(59, 130, 246)",
  secondary: "rgb(107, 114, 128)",
  danger: "rgb(248, 113, 113)",
  transparent: "transparent",
};

const buttonRadius = {
  none: "0px",
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  height?: string;
  width?: string;
  color?: "primary" | "secondary" | "danger" | "transparent";
  isLoading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      size = "md",
      radius = "xl",
      color = "primary",
      height = "100%",
      width = "100%",
      isLoading = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleButtonClick = (
      event: MouseEvent & React.MouseEvent<HTMLButtonElement>
    ) => {
      if (onClick) {
        onClick(event);
      }
    };

    const buttonStyles = {
      height: `${height}rem`,
      width: `${width}rem`,
      backgroundColor: props.disabled ? "gray" : buttonColors[color],
      borderRadius: buttonRadius[radius],
    };

    return (
      <button
        type={props.type ?? "button"}
        style={buttonStyles}
        className={`relative overflow-hidden whitespace-nowrap items-center justify-center px-3 py-2 outline-none border-0 ${
          color === "transparent" ? "shadow-none" : "shadow-md"
        } cursor-pointer select-none hover:brightness-125 active:brightness-150 active:scale-95 transition-filter duration-300 ease-in-out ${
          color === "transparent"
            ? "text-gray-900 dark:text-white"
            : "text-white"
        } disabled:text-gray-300 disabled:shadow-sm disabled:cursor-default disabled:pointer-events-none text-${size} ${className}`}
        onClick={handleButtonClick}
        ref={ref}
        {...props}
      >
        <span className="flex items-center justify-center">
          {isLoading ? <LoaderAnimIcon className="pr-0.5" /> : <></>}
          {children}
        </span>
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
