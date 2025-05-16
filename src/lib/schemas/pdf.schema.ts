import { z } from "zod";

export const exportToPDFSchema = z.object({
  reportTitle: z
    .string()
    .min(3, "Report title must be between 3 and 66 characters")
    .max(66, "Report title must be between 3 and 66 characters"),
  tableHeaders: z.array(z.string()).min(1, "Table headers are required"),
  tableRows: z.array(z.array(z.string())).min(1, "Table rows are required"),
});

export type ExportToPDFInput = z.infer<typeof exportToPDFSchema>;
