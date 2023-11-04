// import { BoxesContainer } from "@/components";
import { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import SnipperLogo from "public/snipper.png";

export const metadata: Metadata = {
  title: "Snipper: URL shortnener",
};

const nunito = Nunito_Sans({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <div
      style={{ height: "calc(100vh - 64px)" }}
      className="relative w-full overflow-hidden  flex flex-col items-center justify-center rounded-lg select-none"
    >
      {/* <div className="absolute inset-0 w-full h-full bg-slate-200 dark:bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" /> */}
      {/* <BoxesContainer /> */}
      <Image
        src={SnipperLogo}
        alt="Snipper"
        width={99}
        height={99}
        className="dark:invert mt-[-64px]"
      />
      <h1
        className={twMerge(
          "text-6xl text-black dark:text-white relative z-20 !p-0 !m-0",
          nunito.className
        )}
      >
        Snipper
      </h1>
      <p className="text-2xl text-center mt-2 text-slate-900 dark:text-neutral-300 relative z-20">
        A simple URL shortnener
      </p>
    </div>
  );
}
