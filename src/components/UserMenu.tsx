"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link as NextUILink,
} from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function UserMenu() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex items-center gap-4">
        <Dropdown placement="bottom-end" className="select-none">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              src={session.user.image ?? ""}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="session" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-regular">{session.user.name}</p>
            </DropdownItem>
            <DropdownItem key="profile">
              <Link href="/profile">Profile</Link>
            </DropdownItem>
            <DropdownItem key="mylinks">My Links</DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
  return (
    <Button
      as={NextUILink}
      color="primary"
      href="#"
      variant="flat"
      onClick={() => signIn()}
    >
      Sign In
    </Button>
  );
}
