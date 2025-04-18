"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link2, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Separator } from "../../ui/separator";
import { AuthButtons, ThemeToggle } from "./modules";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

// const DASHBOARD_LINKS = [
//   { href: "/dashboard", label: "Dashboard" },
//   { href: "/dashboard/api-keys", label: "API Keys" },
//   { href: "/dashboard/settings", label: "Settings" },
// ];

export function SiteHeader() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const [open, setOpen] = useState(false);

  const renderNavLinks = (isMobile = false) =>
    NAV_LINKS.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={
          isMobile
            ? "flex items-center gap-2 p-2 hover:bg-secondary rounded-md"
            : "text-sm font-medium hover:text-primary transition-colors"
        }
        onClick={isMobile ? () => setOpen(false) : undefined}
      >
        {link.label}
      </Link>
    ));

  // const dashboardLinks = (isMobile = false) =>
  //   isAuthenticated
  //     ? DASHBOARD_LINKS.map((link) => (
  //         <Link
  //           key={link.href}
  //           href={link.href}
  //           className={
  //             isMobile
  //               ? "flex items-center gap-2 p-2 hover:bg-secondary rounded-md"
  //               : "text-sm font-medium hover:text-primary transition-colors"
  //           }
  //           onClick={isMobile ? () => setOpen(false) : undefined}
  //         >
  //           {link.label}
  //         </Link>
  //       ))
  //     : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex justify-between items-center h-16">
        <Link href="/" className="flex items-center space-x-2">
          <Link2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Snipper</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            {renderNavLinks()}
            {/* {dashboardLinks()} */}
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
            <nav className="flex flex-col gap-4 mt-8">
              {renderNavLinks(true)}
              {/* {dashboardLinks(true)} */}

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
