"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCountryName } from "@/lib/helpers";
import type { ShortLinkAnalyticsData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { useMemo } from "react";
import ReactCountryFlag from "react-country-flag";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const prepareChartData = (data: Record<string, number>, limit = 5) => {
  return Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
};

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088fe",
  "#00c49f",
  "#ffbb28",
  "#ff8042",
];

export function ClicksOverTime({
  data,
  timeRange = 7,
}: {
  data: ShortLinkAnalyticsData["clicksByDate"];
  timeRange?: number;
}) {
  const chartData = useMemo(() => {
    const now = new Date();
    let startDate = new Date();

    if (!!timeRange) {
      startDate.setDate(now.getDate() - timeRange);
    } else {
      // Use the earliest click date
      const dates = Object.keys(data).sort();
      if (dates.length > 0) {
        startDate = new Date(dates[0]);
      } else {
        startDate.setDate(now.getDate() - 30);
      }
    }

    const dateRange: string[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= now) {
      dateRange.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateRange.map((date) => ({
      date,
      clicks: data[date] || 0,
    }));
  }, [data, timeRange]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="clicks"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TopCountries({
  data,
}: {
  data: ShortLinkAnalyticsData["clicksByCountry"];
}) {
  const chartData = useMemo(() => prepareChartData(data), [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="category" dataKey="name" />
        <YAxis type="number" />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" name="Clicks" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DeviceTypes({
  data,
  withLabels = false,
}: {
  data: ShortLinkAnalyticsData["clicksByDevice"];
  withLabels?: boolean;
}) {
  const chartData = useMemo(() => prepareChartData(data), [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={withLabels ? 300 : 250}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#ffc658"
          labelLine={false}
          label={
            withLabels
              ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`
              : true
          }
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function Browsers({
  data,
  withLabels = false,
}: {
  data: ShortLinkAnalyticsData["clicksByBrowser"];
  withLabels?: boolean;
}) {
  const chartData = useMemo(() => prepareChartData(data), [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={withLabels ? 300 : 250}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          labelLine={false}
          label={
            withLabels
              ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`
              : true
          }
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function OperatingSystems({
  data,
  withLabels = false,
}: {
  data: ShortLinkAnalyticsData["clicksByOS"];
  withLabels?: boolean;
}) {
  const chartData = useMemo(() => prepareChartData(data), [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={withLabels ? 300 : 250}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#82ca9d"
          labelLine={false}
          label={
            withLabels
              ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`
              : true
          }
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TopCountriesTable({
  data,
}: {
  data: ShortLinkAnalyticsData["clicksByCountry"];
}) {
  const tableData = useMemo(() => prepareChartData(data, 10), [data]);

  if (tableData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const total = useMemo(
    () => Object.values(data).reduce((sum, value) => sum + value, 0),
    [data]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Country</TableHead>
          <TableHead>Clicks</TableHead>
          <TableHead>Percentage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((row) => {
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
              <TableCell>{((row.value / total) * 100).toFixed(1)}%</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
