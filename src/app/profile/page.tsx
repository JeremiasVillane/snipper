import ProfileCard from "@/components/ProfileCard";
import { getCurrentUser } from "@/server-actions";
import { Metadata } from "next";
import { currentUser } from "next-auth";

export const metadata: Metadata = {
  title: "Profile | Snipper",
};

const ProfilePage = async () => {
  const { user }: { user: currentUser } = await getCurrentUser();

  return (
    <div className="relative py-12 sm:max-w-xl sm:mx-auto">
      <ProfileCard user={user} />
    </div>
  );
};

export default ProfilePage;
