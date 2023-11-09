import React, { SVGProps } from "react";

interface MySvg extends SVGProps<SVGSVGElement> {
  title?: string;
}

export const ShareIcon: React.FC<MySvg> = (props) => (
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
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <g id="Communication / Share_Android">
        <title>{props.title ?? ""}</title>
        <path
          id="Vector"
          d="M9 13.5L15 16.5M15 7.5L9 10.5M18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18C21 19.6569 19.6569 21 18 21ZM6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12C9 13.6569 7.65685 15 6 15ZM18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6C21 7.65685 19.6569 9 18 9Z"
          stroke={props.color ?? "#000000"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
    </g>
  </svg>
);
