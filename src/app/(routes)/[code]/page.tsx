"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOriginalUrl } from "@/server-actions";

interface Params {
  code: string;
}

export default function ({ params }: { params: Params }) {
  const router = useRouter();
  const { code } = params;

  if (typeof code !== "string") return;

  const useEffectRan = useRef(false);

  useEffect(() => {
    if (useEffectRan.current === false) {
      const redirectToUrl = async (code: string) => {
        const url = await getOriginalUrl(code);
        if (!url) return;

        router.push(url);
      };

      redirectToUrl(code);

      return () => {
        useEffectRan.current = true;
      };
    }
  }, []);
}
