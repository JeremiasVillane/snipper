import { Header, SnipForm } from "@/components";
import { authOptions } from "@/libs/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "New Link | Snipper",
};

export default async function NewLink() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Header title="Paste a URL to create a short link" />
      <SnipForm userEmail={session?.user.email ? session.user.email : ""} />
    </>
  );
}
