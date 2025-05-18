import { iconOptions } from "@/data/shortlink-icons";
import { z } from "zod";

import { REGEX, reservedWords } from "../constants";
import { customDomainSchema } from "./custom-domain.schema";
import { utmSetSchema } from "./utm-param.schema";

export const shortCodeSchema = z
  .string()
  .min(3, { message: "Alias must be at least 3 characters" })
  .max(15, { message: "Alias cannot exceed 15 characters" })
  .regex(REGEX.shortCode, {
    message: "Only alphanumeric, hyphen, underscore allowed",
  })
  .refine(
    (data) => data === "" || !reservedWords.includes(data.toLowerCase()),
    {
      message: "This alias is reserved and cannot be used.",
    },
  );

export const shortLinkPassword = z.string().superRefine((val, ctx) => {
  if (val === "") {
    return;
  }
  if (val.length < 6) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 6,
      type: "string",
      inclusive: true,
      fatal: true,
      message: "Password must be at least 6 characters long",
    });
  }
  if (val.length > 33) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: 33,
      type: "string",
      inclusive: true,
      fatal: true,
      message: "Password must be less than 33 characters long",
    });
  }
});

const baseLinkSchema = z.object({
  originalUrl: z.string().url({ message: "Please enter a valid URL" }),
  shortCode: shortCodeSchema.optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  expiresAt: z.date().nullable().optional(),
  password: shortLinkPassword.optional().nullable(),
  utmSets: z.array(utmSetSchema).optional(),
});

export const createLinksSchemaAPI = baseLinkSchema;
export type CreateLinkBodyAPI = z.infer<typeof createLinksSchemaAPI>;

export const updateLinksSchemaAPI = baseLinkSchema.partial();
export type UpdateLinkBodyAPI = z.infer<typeof updateLinksSchemaAPI>;

const formLinkSchema = z.object({
  originalUrl: baseLinkSchema.shape.originalUrl,
  shortCode: baseLinkSchema.shape.shortCode,
  title: z
    .string()
    .max(50, { message: "Title should be 50 characters or less." })
    .optional()
    .nullable(),
  tags: baseLinkSchema.shape.tags,
  isExpirationEnabled: z.boolean().optional(),
  expiresAt: baseLinkSchema.shape.expiresAt,
  expirationUrl: z
    .string()
    .optional()
    .nullable()
    .superRefine((val, ctx) => {
      if (
        val === null ||
        val === undefined ||
        (typeof val === "string" && val.trim() === "")
      ) {
        return;
      }

      try {
        new URL(val);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_string,
          validation: "url",
          message: "Please provide a valid URL.",
          path: [],
        });
      }
    }),
  isPasswordEnabled: z.boolean().optional(),
  password: baseLinkSchema.shape.password,
  utmSets: baseLinkSchema.shape.utmSets,
  isCustomOgEnabled: z.boolean().optional(),
  customOgTitle: z
    .string()
    .max(70, { message: "Preview title should be 70 characters or less." })
    .optional()
    .nullable(),
  customOgDescription: z
    .string()
    .max(200, {
      message: "Preview description should be 200 characters or less.",
    })
    .optional()
    .nullable(),
  customOgImageUrl: z
    .string()
    .url({ message: "Please provide a valid image URL." })
    .optional()
    .nullable(),
  customDomain: customDomainSchema.optional().nullable(),
  isLinkHubEnabled: z.boolean().optional(),
  linkHubTitle: z
    .string()
    .max(25, { message: "Link hub title should be 25 characters or less." })
    .optional()
    .nullable(),
  linkHubDescription: z
    .string()
    .max(100, {
      message: "Link hub description should be 100 characters or less.",
    })
    .optional()
    .nullable(),
  shortLinkIcon: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (val === null || val === undefined) return true;
        return Object.keys(iconOptions).includes(val);
      },
      {
        message: "Icon not found",
      },
    ),
});

export const createLinkSchema = formLinkSchema
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
    },
  );

export type CreateLinkFormData = z.infer<typeof createLinkSchema>;

export const updateLinkSchema = formLinkSchema
  .partial()
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
    },
  );

export type UpdateLinkFormData = z.infer<typeof updateLinkSchema>;
