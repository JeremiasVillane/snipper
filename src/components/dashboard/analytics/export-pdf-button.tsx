"use client";

import { FC, useMemo, useState } from "react";
import { FileText } from "lucide-react";

import { exportToPDF } from "@/lib/actions/dashboard";
import { getSafeActionResponse } from "@/lib/actions/safe-action-helpers";
import { getCountryName } from "@/lib/helpers";
import { ExportToPDFInput } from "@/lib/schemas";
import { cn, slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/simple-toast";

interface ExportButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  reportTitle: string;
  tableHeaders: string[];
  data: any[];
}

const downloadPdf = (data: BlobPart, reportTitle: string) => {
  const blob = new Blob([data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${slugify(reportTitle)}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const ExportPDFButton: FC<ExportButtonProps> = ({
  reportTitle,
  tableHeaders,
  data,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const generateTableRows = () => {
    if (reportTitle === "Analytics: Clicks") {
      return data.map((click) => [
        new Date(click.timestamp).toLocaleString(),
        getCountryName(click.country),
        click.city,
        click.device,
        click.browser,
        click.os,
        click.referrer ?? "Direct",
      ]);
    }
    // in case data is formatted as key/value pairs
    return data?.map(([key, value]: any[]) => [key, value]) || [];
  };

  const tableRows = useMemo(() => generateTableRows(), [data, reportTitle]);

  if (data.length === 0) return null;

  const handleExport = async () => {
    setIsLoading(true);

    const inputData: ExportToPDFInput = {
      reportTitle,
      tableHeaders,
      tableRows,
    };

    try {
      const response = await exportToPDF(inputData);
      const { data: pdfData, success, error } = getSafeActionResponse(response);

      if (success && pdfData) {
        downloadPdf(pdfData, reportTitle);
      }

      toast({
        title: success ? "Success!" : "Error",
        description: success ? "PDF exported successfully" : error,
        type: success ? "success" : "error",
      });
    } catch (e) {
      toast({
        title: "An unknown error occurred during PDF generation",
        type: "error",
      });
      console.error("Export PDF Error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleExport}
      iconLeft={<FileText />}
      iconAnimation="zoomIn"
      isLoading={isLoading}
      className={cn("mb-2.5 ml-auto flex", className)}
    >
      Export to PDF
    </Button>
  );
};
