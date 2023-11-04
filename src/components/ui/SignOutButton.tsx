"use client";

import { signOut } from "next-auth/react";
import React from "react";

export default function SignOutButton() {
  return (
    <button
      className="rounded-lg bg-red-400 text-red-50 text-sm p-2 px-6 transform hover:scale-105 duration-300 select-none"
      onClick={() => signOut()}
    >
      Logout
    </button>
  );
}
