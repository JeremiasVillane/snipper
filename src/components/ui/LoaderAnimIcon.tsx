import React, { SVGProps } from "react";

export const LoaderAnimIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    style={{
      backgroundColor: "transparent",
      display: "block",
      flexShrink: "0",
      shapeRendering: "auto",
    }}
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    height={props.height ?? "24"}
    width={props.width ?? "24"}
    role="presentation"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    {...props}
  >
    <circle
      cx="50"
      cy="50"
      fill="none"
      stroke={props.color ?? "#fff"}
      strokeWidth="10"
      r="35"
      strokeDasharray="164.93361431346415 56.97787143782138"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        repeatCount="indefinite"
        dur="1s"
        values="0 50 50;360 50 50"
        keyTimes="0;1"
      ></animateTransform>
    </circle>
  </svg>
);
