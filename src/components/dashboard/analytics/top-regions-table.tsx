"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCountryName } from "@/lib/helpers";
import type { ShortLinkAnalyticsData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { useMemo } from "react";
import ReactCountryFlag from "react-country-flag";
import { prepareChartData } from "./analytics-charts";

interface TopRegionsTable {
  countryData: ShortLinkAnalyticsData["clicksByCountry"];
  cityData: ShortLinkAnalyticsData["clicksByCity"];
}

export function TopRegionsTable({ countryData, cityData }: TopRegionsTable) {
  const countryTableData = useMemo(
    () => prepareChartData(countryData, 10),
    [countryData]
  );
  const countryTotal = useMemo(
    () => Object.values(countryData).reduce((sum, value) => sum + value, 0),
    [countryData]
  );

  const cityTableData = useMemo(
    () => prepareChartData(cityData, 10),
    [cityData]
  );
  const cityTotal = useMemo(
    () => Object.values(cityData).reduce((sum, value) => sum + value, 0),
    [cityData]
  );

  if (countryTableData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <Tabs variant="underlined" defaultValue="countries">
      <TabsList>
        <TabsTrigger value="countries">Countries</TabsTrigger>
        <TabsTrigger value="cities">Cities</TabsTrigger>
      </TabsList>

      <TabsContent value="countries">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countryTableData.map((row) => {
              const countryCode = row.name === "Unknown" ? null : row.name;
              const countryName = !!countryCode
                ? getCountryName(countryCode)
                : null;

              return (
                <TableRow key={row.name}>
                  <TableCell>
                    {!!countryCode ? (
                      <div className="flex items-end gap-2">
                        <ReactCountryFlag
                          countryCode={countryCode}
                          svg
                          style={{
                            width: "1.5em",
                            height: "1.5em",
                            lineHeight: "1.5em",
                          }}
                          aria-label={countryName!}
                          title={countryName!}
                        />
                        <span>
                          {countryName} ({countryCode})
                        </span>
                      </div>
                    ) : (
                      row.name
                    )}
                  </TableCell>
                  <TableCell>{formatNumber(row.value)}</TableCell>
                  <TableCell>
                    {((row.value / countryTotal) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="cities">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>City</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cityTableData.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{formatNumber(row.value)}</TableCell>
                <TableCell>
                  {((row.value / cityTotal) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}
