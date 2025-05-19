import { z } from "zod";

export const exportFormatSchema = z.enum(["pdf", "xlsx", "csv"], {
  errorMap: (issue, { defaultError }) => {
    if (issue.code === z.ZodIssueCode.invalid_enum_value) {
      return {
        message: `Invalid export format. Expected 'pdf', 'xlsx', or 'csv'.`,
      };
    }
    return { message: defaultError };
  },
});

const tableObjectRowSchema = z.record(z.string(), z.any());

export const exportDataSchema = z.object({
  reportTitle: z
    .string()
    .min(3, "Report title must be between 3 and 66 characters")
    .max(66, "Report title must be between 3 and 66 characters"),
  tableHeaders: z.array(z.string()).min(1, "Table headers are required"),
  data: z
    .array(tableObjectRowSchema)
    .min(0, "Data array must be present (can be empty)"),
  format: exportFormatSchema,
});

export type ExportDataInput = z.infer<typeof exportDataSchema>;
export type ExportFormat = z.infer<typeof exportFormatSchema>;
