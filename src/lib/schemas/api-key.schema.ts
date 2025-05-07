import { z } from "zod";

export const createApiKeySchema = z.object({
  name: z
    .string()
    .min(3, "The API Key name must be at least 3 characters long.")
    .max(33, "The API Key name cannot be more than 33 characters long."),
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
