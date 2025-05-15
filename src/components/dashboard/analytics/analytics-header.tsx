import Link from "next/link";

import { buildShortUrl } from "@/lib/helpers";
import { ShortLinkAnalyticsData, ShortLinkFromRepository } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HyperText } from "@/components/ui/hyper-text";
import { NumberTicker } from "@/components/ui/number-ticker";

interface AnalyticsHeaderProps {
  analytics: ShortLinkAnalyticsData;
  shortLink: ShortLinkFromRepository;
  startDate?: Date;
  endDate?: Date;
}

export function AnalyticsHeader({
  analytics,
  shortLink,
  startDate,
  endDate,
}: AnalyticsHeaderProps) {
  const dateRangeText = () => {
    if (startDate && endDate) {
      return `From ${formatDate(startDate)} to ${formatDate(endDate)}`;
    }
    return `Since ${formatDate(shortLink.createdAt)}`;
  };

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <NumberTicker value={Number(formatNumber(analytics.totalClicks))} />
          </div>
          <p className="text-xs text-muted-foreground">{dateRangeText()}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Created</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <HyperText>{formatDate(shortLink.createdAt)}</HyperText>
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(shortLink.createdAt).toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Expires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <HyperText>
              {shortLink.expiresAt ? formatDate(shortLink.expiresAt) : "Never"}
            </HyperText>
          </div>
          <p className="text-xs text-muted-foreground">
            {shortLink.expiresAt
              ? new Date(shortLink.expiresAt).toLocaleTimeString()
              : "No expiration date"}
          </p>
        </CardContent>
      </Card>
      <Card className="min-w-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Original URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-w-0 text-sm font-medium">
            <Link
              href={shortLink.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate hover:underline"
            >
              {shortLink.originalUrl}
            </Link>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Short URL:{" "}
            {buildShortUrl(shortLink.shortCode, shortLink.customDomain?.domain)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
