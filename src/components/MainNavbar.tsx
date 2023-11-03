"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link as NextUILink,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle, UserMenu } from ".";
import SnipperLogo from "../../public/snipper.png";

export default function MainNavbar(): JSX.Element {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="z-50 select-none">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <Link href={"/"}>
          <NavbarBrand>
            <Image
              src={SnipperLogo}
              alt="Snipper"
              width={33}
              height={33}
              className="dark:invert mx-4"
            />
            <p className="font-bold text-inherit hidden sm:flex">SNIPPER</p>
          </NavbarBrand>
        </Link>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {session && session.user ? (
          <NavbarItem>
            <Link href="/new" aria-current="page">
              New link
            </Link>
          </NavbarItem>
        ) : null}
        <NavbarItem isActive>
          <Link color="foreground" href="/about">
            About
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>
        <NavbarItem>
          <UserMenu />
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {session && session.user ? (
          <>
            <NavbarMenuItem>
              <NextUILink className="w-full" href="/new" size="lg">
                New link
              </NextUILink>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <NextUILink className="w-full" href="/mylinks" size="lg">
                My Links
              </NextUILink>
            </NavbarMenuItem>
          </>
        ) : null}
        <NavbarMenuItem>
          <NextUILink className="w-full" href="/about" size="lg">
            About
          </NextUILink>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
