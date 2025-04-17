import { auth } from "@/lib/auth";

const AdminPage = async () => {
  const session = await auth();

  return (
    <div>
      This is the Admin Dashboard
      {JSON.stringify(session)}
    </div>
  );
};

export default AdminPage;
