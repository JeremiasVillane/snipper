import {
  AnalyticsHeader,
  AnalyticsTabs,
  DateRangePicker,
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
  searchParams?: Promise<{
    from?: string;
    to?: string;
  }>;
}

export default async function AnalyticsPage({
  params,
  searchParams,
}: AnalyticsPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const rangeParams = await searchParams;

  const startDate = rangeParams?.from ? new Date(rangeParams.from) : undefined;
  const endDate = rangeParams?.to ? new Date(rangeParams.to) : undefined;

  const shortLink = await getShortLink(id);
  const analytics = await getShortLinkAnalytics({ id, startDate, endDate });

  if (!shortLink) {
    redirect("/dashboard");
  }

  return (
    <main className="flex-1 container min-h-screen py-6">
      <div className="flex flex-col md:flex-row gap-3 md:gap-0 items-start justify-between mb-6">
        <section className="flex items-start gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Link Analytics
            </h1>
            <p className="text-muted-foreground">
              Detailed statistics for {shortLink.shortCode}
            </p>
          </div>
        </section>

        <DateRangePicker className="w-full md:w-fit" />
      </div>

      <AnalyticsHeader {...{ analytics, shortLink, startDate, endDate }} />
      <AnalyticsTabs {...{ analytics, startDate, endDate }} />
    </main>
  );
}
