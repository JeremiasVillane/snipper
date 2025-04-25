"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ShortLinkAnalyticsData } from "@/lib/types";
import { useMemo } from "react";
import { DevicesTable } from "./devices-table";

interface AnalyticsDevicesProps {
  clicksByBrowser: ShortLinkAnalyticsData["clicksByBrowser"];
  clicksByOS: ShortLinkAnalyticsData["clicksByOS"];
  clicksByDevice: ShortLinkAnalyticsData["clicksByDevice"];
}

interface ProcessedItem {
  name: string;
  clicks: number;
  percentage: number;
}

const processAndSortData = (data: Record<string, number>): ProcessedItem[] => {
  const totalClicks = Object.values(data).reduce(
    (sum, clicks) => sum + clicks,
    0
  );
  if (totalClicks === 0) return [];

  const processedData = Object.entries(data).map(([name, clicks]) => ({
    name,
    clicks,
    percentage: (clicks / totalClicks) * 100,
  }));

  processedData.sort((a, b) => b.clicks - a.clicks);

  return processedData;
};

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
