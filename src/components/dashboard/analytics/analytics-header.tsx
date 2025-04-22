import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HyperText } from "@/components/ui/hyper-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ShortLinkAnalyticsData, ShortLinkFromRepository } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/utils";
import Link from "next/link";

interface AnalyticsHeaderProps {
  analytics: ShortLinkAnalyticsData;
  shortLink: ShortLinkFromRepository;
}

export function AnalyticsHeader({
  analytics,
  shortLink,
}: AnalyticsHeaderProps) {
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
          <p className="text-xs text-muted-foreground">
            Since {formatDate(shortLink.createdAt)}
          </p>
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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Original URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium truncate">
            <Link
              href={shortLink.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {shortLink.originalUrl}
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Short URL: {process.env.NEXT_PUBLIC_APP_URL}/{shortLink.shortCode}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
