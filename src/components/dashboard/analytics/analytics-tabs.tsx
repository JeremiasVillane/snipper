import { UTMParam } from "@prisma/client";

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
import PdfExportButton from "./pdf-export-button";
import { ReferrersTable } from "./referrers-tables";
import { TopRegionsTable } from "./top-regions-table";
import { UtmValueTable } from "./utm-value-table";

interface AnalyticsTabsProps {
  analytics: ShortLinkAnalyticsData | null;
  startDate?: Date;
  endDate?: Date;
}

export function AnalyticsTabs({
  analytics,
  startDate,
  endDate,
}: AnalyticsTabsProps) {
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
    <Tabs variant="segmented" defaultValue="overview" className="mt-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="clicks">Clicks</TabsTrigger>
        <TabsTrigger value="geography">Geography</TabsTrigger>
        <TabsTrigger value="devices">Devices & Browsers</TabsTrigger>
        <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
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
        <PdfExportButton
          reportTitle="Analytics: Clicks"
          tableHeaders={[
            "Time",
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

      <TabsContent value="geography" className="mt-6">
        <PdfExportButton
          reportTitle="Analytics: Geography"
          tableHeaders={["Country", "Clicks"]}
          data={Object.entries(analytics.clicksByCountry)}
        />

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
        <Tabs variant="underlined" defaultValue="campaigns">
          <TabsList className="mb-4 flex h-auto flex-wrap justify-start border-b-0 md:w-auto">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="mediums">Mediums</TabsTrigger>
            <TabsTrigger value="terms">Terms</TabsTrigger>
            <TabsTrigger value="contents">Contents</TabsTrigger>
            <TabsTrigger value="referrers">Referrers</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <PdfExportButton
              reportTitle="Analytics: Campaigns"
              tableHeaders={["Campaign", "Clicks"]}
              data={Object.entries(analytics.clicksByCampaign)}
            />

            <UtmValueTable
              title="Campaign Values"
              paramName="utm_campaign"
              data={analytics.clicksByCampaign}
            />
          </TabsContent>

          <TabsContent value="sources">
            <PdfExportButton
              reportTitle="Analytics: Sources"
              tableHeaders={["Source", "Clicks"]}
              data={Object.entries(analytics.clicksBySource)}
            />

            <UtmValueTable
              title="Source Values"
              paramName="utm_source"
              data={analytics.clicksBySource}
            />
          </TabsContent>

          <TabsContent value="mediums">
            <PdfExportButton
              reportTitle="Analytics: Mediums"
              tableHeaders={["Medium", "Clicks"]}
              data={Object.entries(analytics.clicksByMedium)}
            />

            <UtmValueTable
              title="Medium Values"
              paramName="utm_medium"
              data={analytics.clicksByMedium}
            />
          </TabsContent>

          <TabsContent value="terms">
            <PdfExportButton
              reportTitle="Analytics: Terms"
              tableHeaders={["Term", "Clicks"]}
              data={Object.entries(analytics.clicksByTerm)}
            />

            <UtmValueTable
              title="Term Values"
              paramName="utm_term"
              data={analytics.clicksByTerm}
            />
          </TabsContent>

          <TabsContent value="contents">
            <PdfExportButton
              reportTitle="Analytics: Contents"
              tableHeaders={["Content", "Clicks"]}
              data={Object.entries(analytics.clicksByContent)}
            />

            <UtmValueTable
              title="Content Values"
              paramName="utm_content"
              data={analytics.clicksByContent}
            />
          </TabsContent>

          <TabsContent value="referrers">
            <PdfExportButton
              reportTitle="Analytics: Referrers"
              tableHeaders={["Referrer", "Clicks"]}
              data={Object.entries(analytics.clicksByReferrer)}
            />

            <ReferrersTable referrersData={analytics.clicksByReferrer} />
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}
