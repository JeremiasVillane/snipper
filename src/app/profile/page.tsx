import SignOutButton from "@/components/SignOutButton";
import { getCurrentUser } from "@/server-actions";
import { Avatar } from "@nextui-org/react";
import { Metadata } from "next";
import NextLink from "next/link";

export const metadata: Metadata = {
  title: "Profile | Snipper",
};

const ProfilePage = async () => {
  const user = await getCurrentUser();

  return (
    <div className="relative py-12 sm:max-w-xl sm:mx-auto">
      <div
        className="rounded-2xl flex p-6 flex-col space-y-5 bg-gradient-to-br from-white to-slate-300/[0.2] dark:from-slate-800 dark:to-slate-800/[0.2] border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
        id="widget"
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

        <div
          id="analytics"
          className="flex space-x-10 text-gray-400 select-none"
        >
          <NextLink href="/mylinks">
            <p className="text-blue-400 font-bold">
              {user.urls ? user.urls.length : "0"}
            </p>
            <p className="text-xs">Links</p>
          </NextLink>
          <div>
            <p className="text-green-500 font-bold">468</p>
            <p className="text-xs">Visits</p>
          </div>
        </div>

        <div className="flex space-x-5 items-center">
          <SignOutButton />
        </div>
      </div>
    </div>
    // <div>
    //   <Card className="max-w-[600px] px-12 py-6 m-9">
    //     <CardHeader className="flex gap-3">
    //       <Image
    //         alt={user.name ?? "User"}
    //         src={user.image ?? ""}
    //         height={40}
    //         width={40}
    //         radius="sm"
    //         className="select-none"
    //       />
    //       <div className="flex flex-col">
    //         <p className="text-md">{user.name}</p>
    //         <p className="text-small text-default-500">{user.email}</p>
    //       </div>
    //     </CardHeader>
    //     <Divider />
    //     <CardBody className="gap-3">
    //       <p>
    //         <b>Role:</b> <i>{user.role}</i>
    //       </p>
    //       <NextLink href="/mylinks">
    //         <b>URLs:</b> {user.urls ? user.urls.length : <i>No urls</i>}
    //       </NextLink>
    //     </CardBody>
    //     <Divider />
    //     <CardFooter>
    //       <Link
    //         isExternal
    //         showAnchorIcon
    //         href="https://github.com/JeremiasVillane/snipper"
    //         as={NextLink}
    //       >
    //         Visit source code on GitHub.
    //       </Link>
    //     </CardFooter>
    //   </Card>
    // </div>
  );
};

export default ProfilePage;
