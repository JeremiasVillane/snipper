import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);
  return (
    <div className="flex items-center justify-center">
      <div className="bg-sky-700 text-slate-100 p-2 rounded shadow grid grid-cols-2 mt-9">
        <p>Name:</p>
        <p>{session?.user.name}</p>
        <p>Email:</p>
        <p>{session?.user.email}</p>
        <p>URLs:</p>
        {session?.user.urls
          ? session?.user.urls.map((url: string) => <p key={url}>{url}</p>)
          : "No urls"}
      </div>
    </div>
  );
};

export default ProfilePage;
