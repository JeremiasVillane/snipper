"use client";

import { useCallback, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable, { applyPlugin } from "jspdf-autotable";
import { FileText } from "lucide-react";

import { getCountryName } from "@/lib/helpers";
import { cn, slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PdfExportButtonProps {
  reportTitle: string;
  tableHeaders: string[];
  data: any[];
}

const PdfExportButton: React.FC<
  PdfExportButtonProps & React.ComponentPropsWithoutRef<"button">
> = ({ reportTitle, tableHeaders, data, className }) => {
  const tableRows = useMemo(() => {
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
    return data?.map(([key, value]) => [key, value]) || [];
  }, [data, reportTitle]);

  const handleExport = useCallback(() => {
    applyPlugin(jsPDF);
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(reportTitle, 14, 22);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [87, 67, 188] },
    });

    doc.save(`${slugify(reportTitle)}.pdf`);
  }, [reportTitle, tableHeaders, tableRows]);

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleExport}
      iconLeft={<FileText />}
      iconAnimation="zoomIn"
      className={cn("mb-2.5 ml-auto flex", className)}
    >
      Export PDF
    </Button>
  );
};

export default PdfExportButton;
