import { useMemo } from "react";

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

interface UtmValueTableProps {
  title: string;
  paramName: string;
  data: Record<string, number> | null | undefined;
}

type SortedUtmValue = {
  value: string;
  clicks: number;
};

export function UtmValueTable({ title, paramName, data }: UtmValueTableProps) {
  const sortedData = useMemo(() => processAndSortData(data), [data]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {sortedData.length > 0
            ? `Unique values captured for the '${paramName}' parameter, sorted by click count.`
            : `No clicks were recorded with a defined '${paramName}' parameter for this link in the selected period.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Value</TableHead>
              <TableHead className="w-[100px] text-center">Clicks</TableHead>
              <TableHead className="w-[100px] text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="break-words font-medium">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-center">{item.clicks}</TableCell>
                  <TableCell className="text-right">
                    {item.percentage.toFixed(1)} %
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
