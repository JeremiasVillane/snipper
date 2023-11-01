"use client";

import { getOriginalUrl } from "@/server-actions";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface RedirectorProps {
  children: ReactNode;
  code: string;
}

export default function Redirector({
  children,
  code,
}: RedirectorProps): JSX.Element {
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
    <span className="text-blue-300 cursor-pointer" onClick={handleClick}>
      {children}
    </span>
  );
}
