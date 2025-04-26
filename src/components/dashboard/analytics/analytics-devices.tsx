"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ShortLinkAnalyticsData } from "@/lib/types";
import { useMemo } from "react";
import { processAndSortData } from "./analytics-helpers";
import { DevicesTable } from "./devices-table";

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
    [clicksByBrowser]
  );
  const osData = useMemo(() => processAndSortData(clicksByOS), [clicksByOS]);
  const deviceData = useMemo(
    () => processAndSortData(clicksByDevice),
    [clicksByDevice]
  );

  return (
    <Tabs variant="underlined" defaultValue="browser">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="browser">By Browser</TabsTrigger>
        <TabsTrigger value="os">By OS</TabsTrigger>
        <TabsTrigger value="device">By Device</TabsTrigger>
      </TabsList>

      <TabsContent value="browser">
        <DevicesTable data={browserData} />
      </TabsContent>
      <TabsContent value="os">
        <DevicesTable data={osData} />
      </TabsContent>
      <TabsContent value="device">
        <DevicesTable data={deviceData} />
      </TabsContent>
    </Tabs>
  );
}
