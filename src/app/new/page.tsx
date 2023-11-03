import { SnipForm } from "@/components";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "Snipper: New Link",
};

export default async function NewLink() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl text-slate-700 dark:text-white mt-9 mb-6 px-12 text-center">
        Paste a URL to create a short link
      </h1>
      <SnipForm userEmail={session?.user.email ? session.user.email : ""} />
    </div>
  );
}
