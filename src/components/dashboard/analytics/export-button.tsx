"use client";

import { FC, useState } from "react";
import { saveAs } from "file-saver";
import { FileDown } from "lucide-react";

import { exportData } from "@/lib/actions/dashboard";
import { getSafeActionResponse } from "@/lib/actions/safe-action-helpers";
import { getCountryName } from "@/lib/helpers";
import { ExportDataInput, ExportFormat } from "@/lib/schemas";
import { cn, slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/simple-toast";

interface ExportButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  reportTitle: string;
  tableHeaders: string[];
  data: any[];
}

export const ExportButton: FC<ExportButtonProps> = ({
  reportTitle,
  tableHeaders,
  data,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const generateObjectData = () => {
    if (reportTitle === "Analytics: Clicks") {
      return data.map((click) => ({
        Timestamp: new Date(click.timestamp).toLocaleString(),
        Country: getCountryName(click.country),
        City: click.city,
        Device: click.device,
        Browser: click.browser,
        OS: click.os,
        Referrer: click.referrer ?? "Direct",
      }));
    }
    if (!data || data.length === 0) return [];

    if (data[0] && typeof data[0] === "object" && !Array.isArray(data[0])) {
      return data.map((item) => {
        const obj: { [key: string]: any } = {};
        tableHeaders.forEach((header) => {
          obj[header] = item.hasOwnProperty(header) ? item[header] : null;
        });
        return obj;
      });
    }

    if (data[0] && Array.isArray(data[0])) {
      return data.map((row) => {
        const obj: { [key: string]: any } = {};
        tableHeaders.forEach((header, index) => {
          obj[header] = row.length > index ? row[index] : null;
        });
        return obj;
      });
    }

    return data.map((item: any) => {
      if (Array.isArray(item) && item.length === tableHeaders.length) {
        const obj: { [key: string]: any } = {};
        tableHeaders.forEach((header, index) => {
          obj[header] = item[index];
        });
        return obj;
      }
      if (Array.isArray(item) && item.length === 2) {
        return { Key: item[0], Value: item[1] };
      }

      console.warn(
        "ExportButton: Handling generic data structure as is for object export to server.",
        { reportTitle, data: item },
      );
      return item;
    });
  };

  const handleExport = async (format: ExportFormat) => {
    if (data.length === 0) {
      toast({
        title: "No data to export",
        type: "info",
      });
      return;
    }

    setIsLoading(true);
    let success = false;
    let message = "";

    try {
      const objectData = generateObjectData();

      if (objectData.length === 0) {
        toast({
          title: `No data to export for ${format.toUpperCase()}`,
          type: "info",
        });
        setIsLoading(false);
        return;
      }

      const inputData: ExportDataInput = {
        reportTitle,
        tableHeaders,
        data: objectData,
        format,
      };

      const {
        data: arrayBufferData,
        success: actionSuccess,
        error: actionError,
      } = await exportData(inputData).then((res) => getSafeActionResponse(res));

      if (actionSuccess && arrayBufferData) {
        let mimeType: string = "";
        let fileExtension: string = "";

        switch (format) {
          case "pdf":
            mimeType = "application/pdf";
            fileExtension = "pdf";
            break;
          case "csv":
            mimeType = "text/csv";
            fileExtension = "csv";
            break;
          case "xlsx":
            mimeType =
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            fileExtension = "xlsx";
            break;
        }

        const filename = `${slugify(reportTitle)}-export-${new Date().toISOString().split("T")[0]}.${fileExtension}`;

        const blob = new Blob([arrayBufferData], { type: mimeType });
        saveAs(blob, filename);

        success = true;
        message = `${format.toUpperCase()} exported successfully`;
      } else {
        success = false;
        message =
          actionError ||
          `An error occurred during ${format.toUpperCase()} generation`;
      }

      toast({
        title: success ? "Success!" : "Error",
        description: message,
        type: success ? "success" : "error",
      });
    } catch (e) {
      console.error(`Export Error (${format}):`, e);
      toast({
        title: "An unknown error occurred during export",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (data.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          isLoading={isLoading}
          iconLeft={<FileDown />}
          iconAnimation="zoomIn"
          className={cn("mb-2.5 ml-auto flex", className)}
        >
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          Export to PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("xlsx")}>
          Export to XLSX
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          Export to CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
