"use client";

import { useMemo } from "react";

import { ShortLinkAnalyticsData } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { processAndSortData } from "./analytics-helpers";

interface ReferrersTable {
  referrersData: ShortLinkAnalyticsData["clicksByReferrer"];
}

export function ReferrersTable({ referrersData }: ReferrersTable) {
  const data = useMemo(
    () => processAndSortData(referrersData, 10),
    [referrersData],
  );

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Top Referrers</CardTitle>
        <CardDescription>
          Websites and sources referring traffic
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referrer</TableHead>
              <TableHead className="w-[100px] text-center">Clicks</TableHead>
              <TableHead className="w-[100px] text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">{item.clicks}</TableCell>
                  <TableCell className="text-right">
                    {item.percentage}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
