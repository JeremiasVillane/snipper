import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { getSafeActionResponse } from "@/lib/actions/safe-action-helpers";
import { getUserShortLinks } from "@/lib/actions/short-links";
import { auth } from "@/lib/auth";
import { usersRepository } from "@/lib/db/repositories";
import { cn } from "@/lib/utils";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LinkDialog, LinkList } from "@/components/dashboard";
import { Tour } from "@/components/dashboard/tour";

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
    getSafeActionResponse(res),
  );

  const dbUser = await usersRepository.findById(session.user.id);

  const isPremiumOrDemoUser = Boolean(
    dbUser?.subscriptions
      .filter((sub) => ["ACTIVE", "TRIALING"].includes(sub.status))
      .map((s) => s.plan)
      .some((p) => p.type === "PAID") || dbUser?.role === "DEMO",
  );

  if (!success) {
    return (
      <main className="container min-h-screen flex-1 py-6">
        <Alert variant="destructive" styleVariant="fill" withIcon>
          {error}
        </Alert>
      </main>
    );
  }

  return (
    <main className="container min-h-screen flex-1 py-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center md:gap-0">
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
              "hidden h-9 md:flex md:h-10",
              data.length > 0 ? "flex" : "",
            )}
          >
            Create Link
          </Button>
        </LinkDialog>
      </div>

      <LinkList links={data} isPremiumOrDemoUser={isPremiumOrDemoUser} />
      <Tour />
    </main>
  );
}
