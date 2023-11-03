import { getCurrentUser } from "@/server-actions";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  // Link,
  Image,
} from "@nextui-org/react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Snipper: Profile",
};

const ProfilePage = async () => {
  const user = await getCurrentUser();

  return (
    <div>
      <Card className="max-w-[600px] px-12 py-6 m-9">
        <CardHeader className="flex gap-3">
          <Image
            alt={user.name ?? "User"}
            src={user.image ?? ""}
            height={40}
            width={40}
            radius="sm"
            className="select-none"
          />
          <div className="flex flex-col">
            <p className="text-md">{user.name}</p>
            <p className="text-small text-default-500">{user.email}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="gap-3">
          <p>
            <b>Role:</b> <i>{user.role}</i>
          </p>
          <Link href="/mylinks">
            <b>URLs:</b> {user.urls ? user.urls.length : <i>No urls</i>}
          </Link>
        </CardBody>
        {/* <Divider />
        <CardFooter>
        <Link
          isExternal
          showAnchorIcon
          href="https://github.com/nextui-org/nextui"
        >
          Visit source code on GitHub.
        </Link>
      </CardFooter> */}
      </Card>
    </div>
    // <div className="flex items-center justify-center">
    //   <div className="bg-sky-700 text-slate-100 p-2 rounded shadow grid grid-cols-2 mt-9">
    //     <p>Name:</p>
    //     <p>{session?.user.name}</p>
    //     <p>Email:</p>
    //     <p>{session?.user.email}</p>
    //     <p>URLs:</p>
    //     {session?.user.urls
    //       ? session?.user.urls.map((url: string) => <p key={url}>{url}</p>)
    //       : "No urls"}
    //   </div>
    // </div>
  );
};

export default ProfilePage;
