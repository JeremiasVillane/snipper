"use client";

import { getOriginalUrl } from "@/server-actions";
import { Spinner } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import SnipperLogo from "../../../public/snipper.png";

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

  return (
    <div className="w-screen h-screen fixed inset-0 flex flex-col items-center justify-center z-[333] bg-slate-200 dark:bg-[#0f172a]">
      <Image
        src={SnipperLogo}
        alt="Snipper"
        width={99}
        height={99}
        className="dark:invert mb-8"
      />
      <Spinner size="lg" />
    </div>
  );
}
