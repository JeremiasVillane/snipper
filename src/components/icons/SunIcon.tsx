import React, { SVGProps } from "react";

export const SunIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={props.height ?? "24"}
    width={props.width ?? "24"}
    role="presentation"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="none"
      stroke={props.color ?? "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0a3.75 3.75 0 0 1 7.5 0Z"
    />
  </svg>
);
