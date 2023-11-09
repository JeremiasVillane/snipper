import React, { SVGProps } from "react";

export const MenuIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    aria-hidden="false"
    focusable="true"
    height={props.height ?? "24"}
    width={props.width ?? "24"}
    role="presentation"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="none"
      stroke={props.color ?? "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);
