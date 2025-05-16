"use client";

import { useMemo } from "react";
import { parseAsString, useQueryState } from "nuqs";

import type { ShortLinkAnalyticsData } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { processAndSortData } from "./analytics-helpers";
import { DevicesTable } from "./devices-table";
import { ExportPDFButton } from "./export-pdf-button";

interface AnalyticsDevicesProps {
  clicksByBrowser: ShortLinkAnalyticsData["clicksByBrowser"];
  clicksByOS: ShortLinkAnalyticsData["clicksByOS"];
  clicksByDevice: ShortLinkAnalyticsData["clicksByDevice"];
}

export function AnalyticsDevices({
  clicksByBrowser,
  clicksByOS,
  clicksByDevice,
}: AnalyticsDevicesProps) {
  const [activeTab, setActiveTab] = useQueryState(
    "by",
    parseAsString.withDefault("browser"),
  );

  const browserData = useMemo(
    () => processAndSortData(clicksByBrowser),
    [clicksByBrowser],
  );
  const osData = useMemo(() => processAndSortData(clicksByOS), [clicksByOS]);
  const deviceData = useMemo(
    () => processAndSortData(clicksByDevice),
    [clicksByDevice],
  );

  if (deviceData.length === 0) {
    return (
      <div className="my-4 flex h-[300px] items-center justify-center rounded-md bg-muted/20">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <Tabs
      variant="underlined"
      defaultValue="browser"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList className="mb-4 grid w-full grid-cols-3">
        <TabsTrigger value="browser">By Browser</TabsTrigger>
        <TabsTrigger value="os">By OS</TabsTrigger>
        <TabsTrigger value="device">By Device</TabsTrigger>
      </TabsList>

      <TabsContent value="browser">
        <ExportPDFButton
          reportTitle="Analytics: Clicks by Browser"
          tableHeaders={["Browser", "Clicks"]}
          data={Object.entries(clicksByBrowser)}
        />
        <DevicesTable data={browserData} />
      </TabsContent>
      <TabsContent value="os">
        <ExportPDFButton
          reportTitle="Analytics: Clicks by OS"
          tableHeaders={["OS", "Clicks"]}
          data={Object.entries(clicksByOS)}
        />
        <DevicesTable data={osData} />
      </TabsContent>
      <TabsContent value="device">
        <ExportPDFButton
          reportTitle="Analytics: Clicks by Device"
          tableHeaders={["Device", "Clicks"]}
          data={Object.entries(clicksByDevice)}
        />
        <DevicesTable data={deviceData} />
      </TabsContent>
    </Tabs>
  );
}
