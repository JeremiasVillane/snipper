import { z } from "zod";
import { validateCustomAlias } from "@/lib/helpers";

const utmParamsSchema = z.object({
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
  term: z.string().optional(),
  content: z.string().optional(),
});

export const createLinkSchema = z
  .object({
    originalUrl: z
      .string({ required_error: "Original URL is required." })
      .url({ message: "Please enter a valid URL." })
      .min(1, { message: "Original URL cannot be empty." }),
    shortCode: z
      .string()
      .optional()
      .refine(
        async (alias) => {
          if (!alias) return true;
          const validation = await validateCustomAlias(alias);
          return validation.valid;
        },
        {
          message: "This alias is already taken or invalid.",
        }
      ),
    tags: z.array(z.string()),
    isExpirationEnabled: z.boolean(),
    expiresAt: z.date().optional().nullable(),
    isPasswordEnabled: z.boolean(),

    password: z.string().optional().nullable(),
    utmParams: utmParamsSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.isExpirationEnabled && !data.expiresAt) {
        return false;
      }
      return true;
    },
    {
      message: "Please select an expiration date.",
      path: ["expiresAt"],
    }
  )
  .refine(
    (data) => {
      if (
        data.isPasswordEnabled &&
        (!data.password || data.password.length < 3)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Password must be at least 3 characters long.",
      path: ["password"], // Path for refinement error
    }
  );

export type CreateLinkFormData = z.infer<typeof createLinkSchema>;
export type UtmParams = z.infer<typeof utmParamsSchema>;
