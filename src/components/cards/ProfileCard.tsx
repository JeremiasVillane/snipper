import { Avatar } from "@nextui-org/react";
import { currentUser } from "next-auth";
import NextLink from "next/link";
import { SignOutButton } from "..";

export default async function ProfileCard({
  user,
  totalClicks,
}: {
  user: currentUser;
  totalClicks: number;
}) {
  return (
    <section
      className="auth-card"
    >
      <div className="flex justify-between w-64">
        <Avatar
          className="h-20 w-20 select-none"
          isBordered
          src={user.image ?? ""}
        />
      </div>

      <div id="user-info">
        <p className="text-lg font-semibold">{user.name}</p>
        <p className="text-gray-400 text-xs">{user.email}</p>
      </div>

      <div id="analytics" className="flex space-x-10 text-gray-400 select-none">
        <NextLink href="/mylinks">
          <p className="text-blue-400 font-bold">
            {user.urls ? user.urls.length : "0"}
          </p>
          <p className="text-xs">Links</p>
        </NextLink>
        <div>
          <p className="text-green-500 font-bold">{totalClicks}</p>
          <p className="text-xs">Visits</p>
        </div>
      </div>

      <div className="flex space-x-5 items-center">
        <SignOutButton />
      </div>
    </section>
  );
}
