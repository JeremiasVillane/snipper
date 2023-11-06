import { Header } from "@/components";
import ProfileCard from "@/components/ProfileCard";
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
      <div className="relative sm:max-w-xl sm:mx-auto">
        <ProfileCard user={user} totalClicks={totalClicks} />
      </div>
    </>
  );
};

export default ProfilePage;
