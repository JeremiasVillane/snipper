import { LinkDialog, LinkList } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { getUserShortLinks } from "@/lib/actions/short-links";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const shortLinks = await getUserShortLinks();

  return (
    <main className="flex-1 min-h-screen container py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3 md:gap-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track your shortened links
          </p>
        </div>
        <LinkDialog>
          <Button
            iconLeft={<Plus className="size-4" />}
            iconAnimation="zoomIn"
            className={cn(
              "hidden md:flex h-9 md:h-10",
              shortLinks.length > 0 ? "flex" : ""
            )}
          >
            Create Link
          </Button>
        </LinkDialog>
      </div>

      <LinkList links={shortLinks} />
    </main>
  );
}
