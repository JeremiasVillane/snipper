"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "..";

export default function SignOutButton(): React.JSX.Element {
  return (
    <Button
      size="sm"
      height="2.5"
      width="5.5"
      color="danger"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign Out
    </Button>
  );
}
