"use client";

import type { ShortLinkAnalyticsData } from "@/lib/types";
import { useMemo } from "react";
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
import { prepareChartData } from "./analytics-helpers";

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
        <Tooltip labelClassName="text-gray-500" />
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
        <Tooltip labelClassName="text-gray-500" />
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
