import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

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
