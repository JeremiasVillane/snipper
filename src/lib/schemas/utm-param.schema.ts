import { z } from "zod";

export const utmSetSchema = z.object({
  source: z.string().trim().optional().nullable(),
  medium: z.string().trim().optional().nullable(),
  campaign: z
    .string()
    .trim()
    .min(1, { message: "Campaign name is required for each UTM set" }),
  term: z.string().trim().optional().nullable(),
  content: z.string().trim().optional().nullable(),
});

export type UtmSetFormData = z.infer<typeof utmSetSchema>;
