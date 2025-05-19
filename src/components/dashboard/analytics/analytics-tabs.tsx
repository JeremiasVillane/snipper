"use client";

import { parseAsString, useQueryState } from "nuqs";

import { ShortLinkAnalyticsData } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
import { ExportButton } from "./export-button";
import { TopRegionsTable } from "./top-regions-table";
import { TrafficSources } from "./traffic-sources";

interface AnalyticsTabsProps {
  analytics: ShortLinkAnalyticsData | null;
  startDate?: Date;
  endDate?: Date;
  isPremiumOrDemoUser: boolean;
}

export function AnalyticsTabs({
  analytics,
  startDate,
  endDate,
  isPremiumOrDemoUser,
}: AnalyticsTabsProps) {
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsString.withDefault("overview"),
  );

  if (!analytics) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Analytics not available</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            The analytics data could not be loaded.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs
      variant="segmented"
      defaultValue="overview"
      value={activeTab}
      onValueChange={setActiveTab}
      className="mt-6"
    >
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="clicks">Clicks</TabsTrigger>
        {isPremiumOrDemoUser && (
          <>
            <TabsTrigger value="geography">Geography</TabsTrigger>
            <TabsTrigger value="devices">Devices & Browsers</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          </>
        )}
      </TabsList>

      <TabsContent value="overview" className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Clicks Over Time</CardTitle>
            <CardDescription>
              Number of clicks{" "}
              {!!startDate && !!endDate
                ? `from ${formatDate(startDate)} to ${formatDate(endDate)}`
                : "per day"}
            </CardDescription>
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
        <ExportButton
          reportTitle="Analytics: Clicks"
          tableHeaders={[
            "Timestamp",
            "Country",
            "City",
            "Device",
            "Browser",
            "OS",
            "Referrer",
          ]}
          data={analytics.recentClicks}
        />

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

      {isPremiumOrDemoUser && (
        <>
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
                <CardDescription>
                  Clicks by device, OS and browser
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid h-full grid-cols-1 gap-4 pt-6 md:grid-cols-3">
                  <div>
                    <h4 className="mb-2 text-center text-sm font-medium">
                      Browsers
                    </h4>
                    <Browsers data={analytics.clicksByBrowser} />
                  </div>

                  <div>
                    <h4 className="mb-2 text-center text-sm font-medium">
                      Operating Systems
                    </h4>
                    <OperatingSystems data={analytics.clicksByOS} />
                  </div>

                  <div>
                    <h4 className="mb-2 text-center text-sm font-medium">
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

          <TabsContent value="traffic" className="mt-6">
            <TrafficSources
              clicksByCampaign={analytics.clicksByCampaign}
              clicksBySource={analytics.clicksBySource}
              clicksByMedium={analytics.clicksByMedium}
              clicksByTerm={analytics.clicksByTerm}
              clicksByContent={analytics.clicksByContent}
              clicksByReferrer={analytics.clicksByReferrer}
            />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
}
