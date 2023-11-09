import React, { SVGProps } from "react";

export const MoonIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
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
      d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75A9.75 9.75 0 0 1 8.25 6c0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25A9.75 9.75 0 0 0 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
    />
  </svg>
);
