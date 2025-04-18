"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { ClickEvent } from "@/lib/types";

interface ClicksTableProps {
  clicks: ClickEvent[];
}

export function ClicksTable({ clicks }: ClicksTableProps) {
  if (clicks.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No click data available</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date & Time</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Device</TableHead>
          <TableHead>Browser</TableHead>
          <TableHead>OS</TableHead>
          <TableHead>Referrer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clicks.map((click) => (
          <TableRow key={click.id}>
            <TableCell>
              {formatDate(click.timestamp)}
              <div className="text-xs text-muted-foreground">
                {new Date(click.timestamp).toLocaleTimeString()}
              </div>
            </TableCell>
            <TableCell>{click.country || "Unknown"}</TableCell>
            <TableCell>{click.city || "Unknown"}</TableCell>
            <TableCell>{click.device || "Unknown"}</TableCell>
            <TableCell>{click.browser || "Unknown"}</TableCell>
            <TableCell>{click.os || "Unknown"}</TableCell>
            <TableCell className="max-w-[150px] truncate">
              {click.referrer || "Direct"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
