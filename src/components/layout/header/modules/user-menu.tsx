import Link from "next/link";
import { BarChart3, Key, LogOut, Settings, User } from "lucide-react";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  avatar: string | undefined | null;
  userName: string | undefined;
}

const iconStyle = "mr-2 h-4 w-4 group-hover:scale-105";

export default function UserMenu({ avatar, userName }: UserMenuProps) {
  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 hover:text-foreground active:text-foreground">
              <AvatarImage src={avatar ?? ""} />
              <AvatarFallback>{userName?.[0] ?? <User />}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-36 max-w-40">
          <DropdownMenuLabel className="truncate">
            {userName ?? "My Account"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="group">
              <BarChart3 className={iconStyle} />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/api-keys" className="group">
              <Key className={iconStyle} />
              API Keys
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="group">
              <Settings className={iconStyle} />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await signOut({ callbackUrl: "/" });
            }}
            className="group"
          >
            <LogOut className={iconStyle} /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
