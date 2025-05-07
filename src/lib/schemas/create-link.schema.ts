import { z } from "zod";
import { utmSetSchema } from "./utm-param.schema";

export const shortCodeSchema = z
  .string()
  .min(3, { message: "Alias must be at least 3 characters" })
  .max(20, { message: "Alias cannot exceed 20 characters" })
  .regex(/^[a-zA-Z0-9-_]+$/, {
    message: "Only alphanumeric, hyphen, underscore allowed",
  });

export const shortLinkPassword = z
  .string()
  .min(6, "Password must be at least 6 character long")
  .max(33, "Password must be less than 33 characters long");

export const createLinkSchema = z
  .object({
    originalUrl: z.string().url({ message: "Please enter a valid URL" }),
    shortCode: shortCodeSchema.optional().or(z.literal("")),
    tags: z.array(z.string()).optional(),
    isExpirationEnabled: z.boolean().optional(),
    expiresAt: z.date().nullable().optional(),
    isPasswordEnabled: z.boolean().optional(),
    password: shortLinkPassword.optional().nullable(),
    utmSets: z.array(utmSetSchema).optional(),
  })
  .refine((data) => !data.isExpirationEnabled || !!data.expiresAt, {
    message: "Expiration date is required when enabled",
    path: ["expiresAt"],
  })
  .refine(
    (data) =>
      !data.isPasswordEnabled || (!!data.password && data.password.length > 0),
    {
      message: "Password is required when enabled",
      path: ["password"],
    }
  );

export type CreateLinkFormData = z.infer<typeof createLinkSchema>;
