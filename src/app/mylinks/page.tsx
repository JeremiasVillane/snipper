import { SnipCards } from "@/components";
import { getCurrentUser } from "@/server-actions";
import { Url } from "@prisma/client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Links | Snipper",
};

export default async function MyLinks() {
  const { urls }: { urls: [Url] } = await getCurrentUser();

  return (
    <div className="max-w-5xl mx-auto px-8">
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 py-10">
        <SnipCards urls={urls} />
      </div>
    </div>
  );
}
