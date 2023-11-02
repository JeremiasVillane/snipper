import Providers from "@/app/providers";
import MainNavbar from "@/components/MainNavbar";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Snipper: URL shortnener",
  description: "Developed by Jeremias Villane",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        // className={`relative h-full w-full flex justify-center items-center ${inter.className}`}
        className={inter.className}
      >
        {/* <div className="flex flex-col shadow-2xl p-4 w-[798px] mx-auto rounded-lg"> */}
        <div>
          <Providers>
            <MainNavbar />
            <main className="relative h-full w-full flex justify-center items-center">
              {children}
            </main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
