"use server";

import writeXlsxFile from "write-excel-file/node";

import { createPDF } from "@/lib/pdf";
import { exportDataSchema } from "@/lib/schemas";

import { authActionClient } from "../safe-action";

const prepareExcelData = (
  data: Array<{ [key: string]: any }>,
  headers: string[],
): Array<Array<{ value: any; fontWeight?: "bold"; type?: any }>> => {
  if (!data || data.length === 0) return [];

  const headerRow: Array<{ value: string; fontWeight: "bold" }> = headers.map(
    (header) => ({
      value: header,
      fontWeight: "bold",
    }),
  );

  const dataRows: Array<Array<{ value: any }>> = data.map((item) => {
    return headers.map((header) => {
      const cellValue = item[header];
      return {
        value: cellValue ?? null,
      };
    });
  });

  return [headerRow, ...dataRows];
};

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

          const csvConfig = {
            columns: tableHeaders,
            skipEmptyLines: true,
          };

          const finalCsvString = Papa.unparse(data, csvConfig);

          const csvBuffer = Buffer.from(finalCsvString, "utf-8");
          fileBuffer = csvBuffer.buffer.slice(
            csvBuffer.byteOffset,
            csvBuffer.byteOffset + csvBuffer.byteLength,
          );
          break;

        case "xlsx":
          const excelData = prepareExcelData(data, tableHeaders);
          if (excelData.length <= 1) {
            throw new Error(
              "No data to format for Excel (after preparing headers)",
            );
          }

          const sheetName = reportTitle
            .substring(0, 31)
            .replace(/[\\/:?*[\]]/g, "_");

          const excelStream = await writeXlsxFile(excelData, {
            sheet: sheetName,
          });
          const chunks: Buffer[] = [];
          for await (const chunk of excelStream) {
            chunks.push(Buffer.from(chunk));
          }
          const buffer = Buffer.concat(chunks);
          fileBuffer = buffer.buffer.slice(
            buffer.byteOffset,
            buffer.byteOffset + buffer.byteLength,
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
