import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { getShortLink, getShortLinkAnalytics } from "@/lib/actions/short-links";
import { formatDate, formatNumber } from "@/lib/utils";
import {
  ClicksOverTime,
  ClicksTable,
  DeviceTypes,
  TopCountries,
} from "@/components/dashboard/analytics";

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
    <main className="flex-1 container py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <a href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Link Analytics</h1>
          <p className="text-muted-foreground">
            Detailed statistics for {shortLink.shortCode}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(analytics.totalClicks)}
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
              {formatDate(shortLink.createdAt)}
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
              {shortLink.expiresAt ? formatDate(shortLink.expiresAt) : "Never"}
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
              <a
                href={shortLink.originalUrl}
                target="_blank"
                className="hover:underline"
                rel="noreferrer"
              >
                {shortLink.originalUrl}
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Short URL: {process.env.NEXT_PUBLIC_APP_URL}/{shortLink.shortCode}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs variant="segmented" defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clicks">Clicks</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Clicks Over Time</CardTitle>
              <CardDescription>Number of clicks per day</CardDescription>
            </CardHeader>
            <CardContent>
              <ClicksOverTime data={analytics.clicksByDate} />
            </CardContent>
          </Card>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
                <CardDescription>Clicks by country</CardDescription>
              </CardHeader>
              <CardContent>
                <TopCountries data={analytics.clicksByCountry} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>Clicks by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceTypes data={analytics.clicksByDevice} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="clicks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Clicks</CardTitle>
              <CardDescription>
                Detailed information about recent clicks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClicksTable clicks={analytics.recentClicks} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
