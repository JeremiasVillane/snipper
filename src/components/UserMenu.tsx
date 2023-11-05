"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UserMenu(): JSX.Element {
  const { data: session } = useSession();
  const route = useRouter();

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
            <DropdownItem className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-regular">{session.user.name}</p>
            </DropdownItem>
            <DropdownItem onClick={() => route.push("/profile")}>
              Profile
            </DropdownItem>
            <DropdownItem onClick={() => route.push("/mylinks")}>
              My Links
            </DropdownItem>
            <DropdownItem onClick={() => route.push("/new")}>
              New Link
            </DropdownItem>
            <DropdownItem color="danger" onClick={() => signOut()}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }

  return (
    <Button color="primary" variant="flat" onClick={() => signIn()}>
      Sign In
    </Button>
  );
}
