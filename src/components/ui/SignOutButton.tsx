"use client";

import { Button } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import React from "react";

export default function SignOutButton() {
  return (
    <Button
      className="bg-red-500 text-white transform hover:bg-red-400 duration-200 select-none"
      onClick={() => signOut()}
    >
      Logout
    </Button>
  );
}
