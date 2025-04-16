import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";

const AdminPage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      This is the Admin Dashboard
      {JSON.stringify(session)}
    </div>
  );
};

export default AdminPage;
