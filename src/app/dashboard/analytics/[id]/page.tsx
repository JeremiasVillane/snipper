import {
  AnalyticsHeader,
  AnalyticsTabs,
  DateRangePicker,
} from "@/components/dashboard/analytics";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getSafeActionResponse } from "@/lib/actions/safe-action-helpers";
import { getShortLink, getShortLinkAnalytics } from "@/lib/actions/short-links";
import { auth } from "@/lib/auth";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

interface GenerateMetadataProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ from?: string; to?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: GenerateMetadataProps): Promise<Metadata> {
  const { id } = await params;
  const rangeParams = await searchParams;

  const fromDateStr = rangeParams?.from
    ? format(new Date(rangeParams?.from), "PP")
    : null;
  const toDateStr = rangeParams?.to
    ? format(new Date(rangeParams?.to), "PP")
    : null;

  const shortLinkResponse = await getShortLink({ id }).then((res) =>
    getSafeActionResponse(res)
  );
  const shortCode = shortLinkResponse.success
    ? shortLinkResponse.data.shortCode
    : "Link";
  const originalUrl = shortLinkResponse.success
    ? shortLinkResponse.data.originalUrl
    : "";

  let dateRangeTitlePart = "";
  let dateRangeDescPart = "";

  if (fromDateStr && toDateStr) {
    dateRangeTitlePart = ` (${fromDateStr} - ${toDateStr})`;
    dateRangeDescPart = ` from ${fromDateStr} to ${toDateStr}`;
  } else if (fromDateStr) {
    dateRangeTitlePart = ` (from ${fromDateStr})`;
    dateRangeDescPart = ` from ${fromDateStr}`;
  } else if (toDateStr) {
    dateRangeTitlePart = ` (until ${toDateStr})`;
    dateRangeDescPart = ` until ${toDateStr}`;
  }

  const pageTitle = `Analytics for ${shortCode}${dateRangeTitlePart} - Snipper`;
  const pageDescription = `View detailed statistics for short link ${shortCode}${dateRangeDescPart}. ${
    originalUrl ? `Targets ${originalUrl}.` : ""
  }`;

  return {
    title: pageTitle,
    description: pageDescription,
    robots: {
      index: false,
      follow: false,
    },
  };
}

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

  const shortLink = await getShortLink({ id }).then((res) =>
    getSafeActionResponse(res)
  );

  if (!shortLink.success) {
    console.warn(
      `Short link ${id} not found or user ${session.user.id} lacks permission.`
    );
    return (
      <main className="flex-1 container min-h-screen py-6">
        <Alert variant="destructive" styleVariant="fill" withIcon>
          {shortLink.error}
        </Alert>
      </main>
    );
  }

  const ShortLinkAnalytics = await getShortLinkAnalytics({
    id,
    startDate,
    endDate,
  }).then((res) => getSafeActionResponse(res));

  if (!ShortLinkAnalytics.success) {
    console.error(`Failed to get analytics: ${ShortLinkAnalytics.error}`);
    return (
      <main className="flex-1 container min-h-screen py-6">
        <Alert variant="destructive" styleVariant="fill" withIcon>
          {ShortLinkAnalytics.error}
        </Alert>
      </main>
    );
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
              Detailed statistics for {shortLink.data.shortCode}
            </p>
          </div>
        </section>

        <DateRangePicker className="w-full md:w-fit" />
      </div>

      <AnalyticsHeader
        analytics={ShortLinkAnalytics.data}
        shortLink={shortLink.data}
        startDate={startDate}
        endDate={endDate}
      />
      <AnalyticsTabs
        analytics={ShortLinkAnalytics.data}
        startDate={startDate}
        endDate={endDate}
      />
    </main>
  );
}
