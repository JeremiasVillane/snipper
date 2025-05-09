import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProcessedItem {
  name: string;
  clicks: number;
  percentage: number;
}

interface DevicesTableProps {
  data: ProcessedItem[];
}

export function DevicesTable({ data }: DevicesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50%]">Name</TableHead>
          <TableHead className="text-right">Clicks</TableHead>
          <TableHead className="text-right">Percentage</TableHead>
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
          data.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="break-all font-medium">
                {item.name}
              </TableCell>
              <TableCell className="text-right">
                {item.clicks.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {item.percentage.toFixed(1)}%
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
