"use server";

import { createPDF } from "@/lib/pdf";
import { exportToPDFSchema } from "@/lib/schemas";

import { authActionClient } from "../safe-action";

export const exportToPDF = authActionClient({
  roles: ["USER"],
  plans: ["Business"],
})
  .metadata({
    name: "export-analytics-to-pdf",
    limiter: {
      refillRate: 5,
      interval: 10,
      capacity: 15,
      requested: 1,
    },
  })
  .schema(exportToPDFSchema)
  .action(async ({ parsedInput }) => {
    const { reportTitle, tableHeaders, tableRows } = parsedInput;
    return await createPDF(reportTitle, tableHeaders, tableRows);
  });
