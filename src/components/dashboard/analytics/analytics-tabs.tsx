import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShortLinkAnalyticsData } from "@/lib/types";
import {
  Browsers,
  ClicksOverTime,
  DeviceTypes,
  OperatingSystems,
  TopCountries,
} from "./analytics-charts";
import { AnalyticsDevices } from "./analytics-devices";
import { ClicksTable } from "./clicks-table";
import { CountryMap } from "./country-map";
import { TopRegionsTable } from "./top-regions-table";
import { ReferrersTable } from "./referrers-tables";

interface AnalyticsTabsProps {
  analytics: ShortLinkAnalyticsData;
}

export function AnalyticsTabs({ analytics }: AnalyticsTabsProps) {
  return (
    <Tabs variant="segmented" defaultValue="overview" className="mt-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="clicks">Clicks</TabsTrigger>
        <TabsTrigger value="geography">Geography</TabsTrigger>
        <TabsTrigger value="devices">Devices & Browsers</TabsTrigger>
        <TabsTrigger value="referrers">Referrers</TabsTrigger>
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
              <DeviceTypes data={analytics.clicksByDevice} withLabels />
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

      <TabsContent value="geography" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Geography</CardTitle>
            <CardDescription>
              Detailed information about geographic location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CountryMap data={analytics.clicksByCountryWithCities} />
            <TopRegionsTable
              countryData={analytics.clicksByCountry}
              cityData={analytics.clicksByCity}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="devices" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Devices & Browsers</CardTitle>
            <CardDescription>Clicks by device, OS and browser</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full pt-6">
              <div>
                <h4 className="text-sm font-medium mb-2 text-center">
                  Browsers
                </h4>
                <Browsers data={analytics.clicksByBrowser} />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 text-center">
                  Operating Systems
                </h4>
                <OperatingSystems data={analytics.clicksByOS} />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 text-center">
                  Devices
                </h4>
                <DeviceTypes data={analytics.clicksByDevice} />
              </div>
            </div>

            <AnalyticsDevices
              clicksByBrowser={analytics.clicksByBrowser}
              clicksByDevice={analytics.clicksByDevice}
              clicksByOS={analytics.clicksByOS}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="referrers" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Referrers</CardTitle>
            <CardDescription>Tracking referrers</CardDescription>
          </CardHeader>
          <CardContent>
            <ReferrersTable referrersData={analytics.clicksByReferrer} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
