import { SnipForm } from "@/components";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function NewLink() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-4xl text-slate-700 dark:text-white mt-9 mb-6 text-center">
        Paste a URL to create a short link
      </h1>
      <SnipForm userEmail={session?.user.email ? session.user.email : ""} />
    </div>
  );
}
