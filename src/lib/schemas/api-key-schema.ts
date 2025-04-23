import { z } from "zod";

export const createApiKeySchema = z.object({
  name: z
    .string()
    .min(1, { message: "The API Key name cannot be empty." }),
  expiresAt: z
    .date()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      { message: "The expiration date cannot be in the past." }
    ),
});

export type CreateApiKeyFormData = z.infer<typeof createApiKeySchema>;
