interface ProcessedItem {
  name: string;
  clicks: number;
  percentage: number;
}

export const processAndSortData = (
  data: Record<string, number>,
  limit?: number
): ProcessedItem[] => {
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

  return !!limit ? processedData.slice(0, limit) : processedData;
};

export const prepareChartData = (data: Record<string, number>, limit = 5) => {
  return Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
};
