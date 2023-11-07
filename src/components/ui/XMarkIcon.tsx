import React, { SVGProps } from "react";

interface MySvg extends SVGProps<SVGSVGElement> {
  title?: string;
}

export const XMarkIcon: React.FC<MySvg> = (props) => (
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
    <title>{props.title ?? ""}</title>
    <path
      fill="none"
      stroke={props.color ?? "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props.stroke ?? "1.5"}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
