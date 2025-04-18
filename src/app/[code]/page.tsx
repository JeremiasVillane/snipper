import { Button } from "@/components";
import { getOriginalUrl } from "@/server-actions";
import Image from "next/image";
import { redirect } from "next/navigation";

interface RedirectingPageParams {
  params: Promise<{ code: string }>;
}

export default async function RedirectingPage({
  params,
}: RedirectingPageParams) {
  const { code } = await params;

  if (typeof code !== "string") return null;

  const url = await getOriginalUrl(code);

  if (!url) {
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
        <div className="flex flex-col justify-center items-center">
          <p className="text-3xl mb-4">
            <b>404</b>: Not Found
          </p>
          <div className="flex gap-1">
            <Button
              color="primary"
              onClick={() => {
                window.history.back();
              }}
            >
              Go Back
            </Button>
            <Button
              className="group"
              color="transparent"
              onClick={() => {
                window.location.href = "/";
              }}
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
      </div>
    );
  }

  redirect(url);
}
