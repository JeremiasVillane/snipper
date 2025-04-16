"use client";

import { getOriginalUrl } from "@/server-actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button, LoaderAnimIcon } from "@/components";

interface Params {
  code: string;
}

export default function RedirectingPage({ params }: { params: Params }) {
  const [notFound, setNotFound] = useState<boolean>(false);
  const router = useRouter();
  const { code } = params;

  const useEffectRan = useRef(false);

  useEffect(() => {
    if (useEffectRan.current === false) {
      const redirectToUrl = async (code: string) => {
        const url = await getOriginalUrl(code);
        !url ? setNotFound(true) : router.push(url);
      };

      redirectToUrl(code);

      useEffectRan.current = true;
    }
  }, [code, router]);

  if (typeof code !== "string") return null;

  return (
    <div className="w-screen h-screen fixed inset-0 flex flex-col items-center justify-center z-[333] bg-slate-200 dark:bg-[#0f172a]">
      <Image
        src="/snipper.svg"
        alt="Snipper"
        width={111}
        height={111}
        className="dark:invert mb-8 ml-8"
        priority
      />
      {notFound ? (
        <div className="flex flex-col justify-center items-center">
          <p className="text-3xl mb-4">
            <b>404</b>: Not Found
          </p>
          <div className="flex gap-1">
            <Button color="primary" onClick={() => router.back()}>
              Go Back
            </Button>
            <Button
              className="group"
              color="transparent"
              onClick={() => router.push("/")}
            >
              Go to Home
              <span
                aria-hidden="true"
                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              >
                &nbsp;-&gt;
              </span>
            </Button>
          </div>
        </div>
      ) : (
        <LoaderAnimIcon color="rgb(59, 130, 246)" height="55" width="55" />
      )}
    </div>
  );
}
