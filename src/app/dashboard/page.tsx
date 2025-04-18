import { CreateLinkDialog, LinkTable } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { getUserShortLinks } from "@/lib/actions/short-links";
import { auth } from "@/lib/auth";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const shortLinks = await getUserShortLinks();

  return (
    <main className="flex-1 container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track your shortened links
          </p>
        </div>
        <CreateLinkDialog>
          <Button
            iconLeft={<Plus className="size-4" />}
            iconAnimation="zoomIn"
            className="hidden md:flex"
          >
            Create Link
          </Button>
        </CreateLinkDialog>
      </div>

      <div className="space-y-6">
        <LinkTable links={shortLinks} />
      </div>
    </main>
  );
}
