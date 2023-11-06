import Providers from "@/app/providers";
import MainNavbar from "@/components/MainNavbar";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  description: "Developed by Jeremias Villane",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div>
          <Providers>
            <MainNavbar />
            <div className="flex flex-col h-full w-full items-center justify-center">
              {children}
            </div>
          </Providers>
        </div>
      </body>
    </html>
  );
}
