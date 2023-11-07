"use client";

import { signOut } from "next-auth/react";
import { Button } from "..";

export default function SignOutButton(): JSX.Element {
  return (
    <Button
      size="sm"
      height="2.5"
      width="5.5"
      className="bg-red-400"
      onClick={() => signOut()}
    >
      Sign Out
    </Button>
  );
}
