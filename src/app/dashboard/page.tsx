import { LinkDialog, LinkList } from "@/components/dashboard";
import { Tour } from "@/components/dashboard/tour";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getSafeActionResponse } from "@/lib/actions/safe-action-helpers";
import { getUserShortLinks } from "@/lib/actions/short-links";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Snipper Dashboard | Manage Your Links & Analytics",
  description: "Access your personal Snipper dashboard...",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Snipper Dashboard",
  },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { data, success, error } = await getUserShortLinks().then((res) =>
    getSafeActionResponse(res)
  );

  if (!success) {
    return (
      <main className="flex-1 container min-h-screen py-6">
        <Alert variant="destructive" styleVariant="fill" withIcon>
          {error}
        </Alert>
      </main>
    );
  }

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
              data.length > 0 ? "flex" : ""
            )}
          >
            Create Link
          </Button>
        </LinkDialog>
      </div>

      <LinkList links={data} />
      <Tour />
    </main>
  );
}
