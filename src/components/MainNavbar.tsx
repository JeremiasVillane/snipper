"use client";

import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import SnipperLogo from "public/snipper.png";
import { useState } from "react";
import { ThemeToggle, UserMenu } from ".";

export default function MainNavbar(): JSX.Element {
  const currentPath = usePathname();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="z-50 select-none">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <Link href={"/"} color="foreground" as={NextLink}>
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
          <>
            <NavbarItem isActive={currentPath === "/new"}>
              <Link
                color={currentPath === "/new" ? "primary" : "foreground"}
                href="/new"
                as={NextLink}
              >
                New link
              </Link>
            </NavbarItem>
            <NavbarItem isActive={currentPath === "/mylinks"}>
              <Link
                color={currentPath === "/mylinks" ? "primary" : "foreground"}
                href="/mylinks"
                as={NextLink}
              >
                My links
              </Link>
            </NavbarItem>
          </>
        ) : null}
        <NavbarItem isActive={currentPath === "/about"}>
          <Link
            color={currentPath === "/about" ? "primary" : "foreground"}
            href="/about"
            as={NextLink}
          >
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
              <Link
                className="w-full"
                href="/new"
                size="lg"
                color={currentPath === "/new" ? "primary" : "foreground"}
                as={NextLink}
              >
                New link
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                className="w-full"
                href="/mylinks"
                size="lg"
                color={currentPath === "/mylinks" ? "primary" : "foreground"}
                as={NextLink}
              >
                My Links
              </Link>
            </NavbarMenuItem>
          </>
        ) : null}
        <NavbarMenuItem>
          <Link
            className="w-full"
            href="/about"
            size="lg"
            color={currentPath === "/about" ? "primary" : "foreground"}
            as={NextLink}
          >
            About
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
