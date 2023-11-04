"use client";

import { getOriginalUrl } from "@/server-actions";
import { Button, Spinner } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SnipperLogo from "../../../public/snipper.png";

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
        src={SnipperLogo}
        alt="Snipper"
        width={99}
        height={99}
        className="dark:invert mb-8"
      />
      {notFound ? (
        <div className="flex flex-col justify-center items-center">
          <p className="text-3xl mb-4">
            <b>404</b>: Not Found
          </p>
          <Button
            color="primary"
            onPress={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      ) : (
        <Spinner size="lg" />
      )}
    </div>
  );
}
