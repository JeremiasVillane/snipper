"use client";

import { useMemo } from "react";

import type { ShortLinkAnalyticsData } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { processAndSortData } from "./analytics-helpers";
import { DevicesTable } from "./devices-table";
import PdfExportButton from "./pdf-export-button";

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
  const browserData = useMemo(
    () => processAndSortData(clicksByBrowser),
    [clicksByBrowser],
  );
  const osData = useMemo(() => processAndSortData(clicksByOS), [clicksByOS]);
  const deviceData = useMemo(
    () => processAndSortData(clicksByDevice),
    [clicksByDevice],
  );

  return (
    <Tabs variant="underlined" defaultValue="browser">
      <TabsList className="mb-4 grid w-full grid-cols-3">
        <TabsTrigger value="browser">By Browser</TabsTrigger>
        <TabsTrigger value="os">By OS</TabsTrigger>
        <TabsTrigger value="device">By Device</TabsTrigger>
      </TabsList>

      <TabsContent value="browser">
        <PdfExportButton
          reportTitle="Analytics: Clicks by Browser"
          tableHeaders={["Browser", "Clicks"]}
          data={Object.entries(clicksByBrowser)}
        />
        <DevicesTable data={browserData} />
      </TabsContent>
      <TabsContent value="os">
        <PdfExportButton
          reportTitle="Analytics: Clicks by OS"
          tableHeaders={["OS", "Clicks"]}
          data={Object.entries(clicksByOS)}
        />
        <DevicesTable data={osData} />
      </TabsContent>
      <TabsContent value="device">
        <PdfExportButton
          reportTitle="Analytics: Clicks by Device"
          tableHeaders={["Device", "Clicks"]}
          data={Object.entries(clicksByDevice)}
        />
        <DevicesTable data={deviceData} />
      </TabsContent>
    </Tabs>
  );
}
