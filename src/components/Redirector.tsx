"use client";

import React from "react";
import { getOriginalUrl } from "@/server-actions";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { AnchorIcon } from ".";

interface RedirectorProps {
  children: ReactNode;
  code: string;
}

export default function Redirector({
  children,
  code,
}: RedirectorProps): React.JSX.Element {
  const router = useRouter();

  const redirectToUrl = async (code: string) => {
    const url = await getOriginalUrl(code);
    if (!url) return;

    window.open(url, "_blank");
    router.refresh();
  };

  const handleClick = () => {
    redirectToUrl(code);
  };

  return (
    <span
      className="flex items-center text-blue-500 cursor-pointer"
      onClick={handleClick}
    >
      {children} <AnchorIcon width="20" height="20" color="rgb(59 130 246)" />
    </span>
  );
}
