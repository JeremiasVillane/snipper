import { SnipCards } from "@/components";
import { getCurrentUser } from "@/server-actions";
import { Metadata } from "next";
import { currentUser } from "next-auth";

export const metadata: Metadata = {
  title: "My Links | Snipper",
};

export default async function MyLinks() {
  const { user }: { user: currentUser } = await getCurrentUser();

  return (
    <div className="max-w-5xl mx-auto px-8">
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 py-10">
        <SnipCards urls={user.urls} />
      </div>
    </div>
  );
}
