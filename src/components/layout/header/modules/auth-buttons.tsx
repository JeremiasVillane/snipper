"use client";

import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, UserPlus } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

interface AuthButtonsProps {
  isMobile?: boolean;
  setOpen: (open: boolean) => void;
}

export function AuthButtons({ isMobile = false, setOpen }: AuthButtonsProps) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return !isAuthenticated ? (
    <>
      <Link
        href="/login"
        className={
          isMobile
            ? "flex items-center gap-2 p-2 hover:bg-secondary rounded-md"
            : undefined
        }
        onClick={isMobile ? () => setOpen(false) : undefined}
      >
        {isMobile && <LogIn className="h-4 w-4" />}
        {isMobile ? (
          "Sign In"
        ) : (
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        )}
      </Link>
      <Link
        href="/register"
        className={
          isMobile
            ? "flex items-center gap-2 p-2 hover:bg-secondary rounded-md"
            : undefined
        }
        onClick={isMobile ? () => setOpen(false) : undefined}
      >
        {isMobile && <UserPlus className="h-4 w-4" />}
        {isMobile ? "Sign Up" : <Button size="sm">Sign Up</Button>}
      </Link>
    </>
  ) : isMobile ? (
    <>
      <div className="flex items-center gap-2 p-2">
        <User className="h-4 w-4" />
        <span>{session?.user?.name}</span>
      </div>
      <button
        className="flex items-center gap-2 p-2 w-full text-left hover:bg-secondary rounded-md"
        onClick={() => {
          handleLogout();
          setOpen(false);
        }}
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </>
  ) : (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">{session?.user?.name}</span>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-1" /> Sign Out
      </Button>
    </div>
  );
}
