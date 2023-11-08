import { Header, ProfileCard } from "@/components";
import { getCurrentUser } from "@/server-actions";
import { Metadata } from "next";
import { currentUser } from "next-auth";

export const metadata: Metadata = {
  title: "Profile | Snipper",
};

const ProfilePage = async () => {
  const { user, totalClicks }: { user: currentUser; totalClicks: number } =
    await getCurrentUser();

  return (
    <>
      <Header title="Profile" />
      <ProfileCard user={user} totalClicks={totalClicks} />
    </>
  );
};

export default ProfilePage;
