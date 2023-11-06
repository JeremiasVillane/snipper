import { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import SnipperLogo from "public/snipper.svg";

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
      <div className="absolute inset-0 w-full h-full invert dark:invert-0 grayscale dark:grayscale-0 pointer-events-none" style={{backgroundImage: "url(/bg.png)"}} />
      <Image
        src={SnipperLogo}
        alt="Snipper"
        width={99}
        height={99}
        className="dark:invert mt-[-64px] z-10"
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
