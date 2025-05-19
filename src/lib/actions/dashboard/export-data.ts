"use server";

import * as XLSX from "xlsx";

import { createPDF } from "@/lib/pdf";
import { exportDataSchema } from "@/lib/schemas";

import { authActionClient } from "../safe-action";

const objectDataToPdfRows = (
  data: Array<{ [key: string]: any }>,
  headers: string[],
): string[][] => {
  if (!data || data.length === 0) return [];
  return data.map((item) => {
    const row: string[] = [];
    headers.forEach((header) => {
      row.push(String(item[header] ?? ""));
    });
    return row;
  });
};

export const exportData = authActionClient({
  roles: ["USER"],
  plans: ["Business"],
})
  .metadata({
    name: "export-report",
    track: {
      event: "export_report",
      channel: "analytics",
    },
    limiter: {
      refillRate: 5,
      interval: 10,
      capacity: 15,
      requested: 1,
    },
  })
  .schema(exportDataSchema)
  .action(async ({ parsedInput }): Promise<ArrayBuffer> => {
    const { reportTitle, tableHeaders, data, format } = parsedInput;

    if (data.length === 0) {
      throw new Error("No data to export");
    }

    try {
      let fileBuffer: ArrayBuffer;

      switch (format) {
        case "pdf":
          const pdfRows = objectDataToPdfRows(data, tableHeaders);
          if (pdfRows.length === 0)
            throw new Error("Failed to convert data for PDF");
          const pdfArrayBuffer = await createPDF(
            reportTitle,
            tableHeaders,
            pdfRows,
          );
          fileBuffer = pdfArrayBuffer;
          break;

        case "csv":
          const Papa = require("papaparse");
          const finalCsvString = Papa.unparse(data, {
            header: true,
            skipEmptyLines: true,
          });
          const csvBuffer = Buffer.from(finalCsvString, "utf-8");
          fileBuffer = csvBuffer.buffer.slice(
            csvBuffer.byteOffset,
            csvBuffer.byteOffset + csvBuffer.byteLength,
          );
          break;

        case "xlsx":
          const worksheet = XLSX.utils.json_to_sheet(data);
          const workbook = XLSX.utils.book_new();
          const sheetName = reportTitle
            .substring(0, 31)
            .replace(/[\\/:?*[\]]/g, "_");
          XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

          const xlsxBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "buffer",
          });
          fileBuffer = xlsxBuffer.buffer.slice(
            xlsxBuffer.byteOffset,
            xlsxBuffer.byteOffset + xlsxBuffer.byteLength,
          );
          break;

        default:
          throw new Error("Unsupported export format");
      }

      if (!fileBuffer) {
        throw new Error(`Failed to generate ${format.toUpperCase()} file`);
      }

      return fileBuffer;
    } catch (error: any) {
      console.error(`Server Export Error (${format}):`, error);
      throw new Error(
        `Failed to export data: ${error.message || String(error)}`,
      );
    }
  });
