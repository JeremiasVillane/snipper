import {
  AnalyticsHeader,
  AnalyticsTabs,
} from "@/components/dashboard/analytics";
import { Button } from "@/components/ui/button";
import { getShortLink, getShortLinkAnalytics } from "@/lib/actions/short-links";
import { auth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface AnalyticsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const shortLink = await getShortLink(id);
  const analytics = await getShortLinkAnalytics(id);

  return (
    <main className="flex-1 container min-h-screen py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Link Analytics</h1>
          <p className="text-muted-foreground">
            Detailed statistics for {shortLink.shortCode}
          </p>
        </div>
      </div>

      <AnalyticsHeader {...{ analytics, shortLink }} />
      <AnalyticsTabs {...{ analytics }} />
    </main>
  );
}
