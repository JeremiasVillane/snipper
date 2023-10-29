import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

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
    <html lang="en">
      <body
        className={`relative h-full w-full flex justify-center items-center ${inter.className}`}
      >
        <div className="flex flex-col shadow-2xl p-4 w-[798px] mx-auto rounded-lg">
          {children}
        </div>
      </body>
    </html>
  );
}
