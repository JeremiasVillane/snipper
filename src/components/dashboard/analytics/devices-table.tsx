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
  percentage: string;
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
          <TableHead className="text-center">Clicks</TableHead>
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
              <TableCell className="text-center">
                {item.clicks.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">{item.percentage}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
