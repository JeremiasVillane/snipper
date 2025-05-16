"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";

import { appName } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { AppLogo } from "../../../../public/app-logo";
import { AuthButtons, ThemeToggle } from "./modules";

type DataLink = {
  href: string;
  label: string;
};

const NAV_LINKS: DataLink[] = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

const DASHBOARD_LINKS: DataLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/api-keys", label: "API Keys" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function SiteHeader() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const renderNavLinks = (dataLinks: DataLink[], isMobile = false) =>
    dataLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={
          isMobile
            ? "flex items-center gap-2 rounded-md p-2 hover:bg-secondary"
            : "text-sm font-medium transition-colors hover:text-primary"
        }
        onClick={isMobile ? () => setOpen(false) : undefined}
      >
        {link.label}
      </Link>
    ));

  return (
    <header className="fixed top-0 z-50 h-16 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-1.5">
          <AppLogo className="size-5 text-primary" />
          <span className="text-xl font-bold">{appName}</span>
        </Link>

        <div className="hidden items-center space-x-6 md:flex">
          <nav className="flex items-center space-x-6">
            {renderNavLinks(NAV_LINKS)}
          </nav>

          <div className="flex items-center space-x-2">
            <AuthButtons avatar={session?.user.image} setOpen={setOpen} />
            <ThemeToggle />
          </div>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTitle className="sr-only">Mobile navigation menu</SheetTitle>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="mt-8 flex flex-col gap-4">
              {renderNavLinks(NAV_LINKS, true)}
              {renderNavLinks(DASHBOARD_LINKS, true)}

              <Separator className="my-1" />

              <div>
                <ThemeToggle isMobile />
                <Separator className="my-4" />
                <AuthButtons
                  avatar={session?.user.image}
                  setOpen={setOpen}
                  isMobile
                />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
