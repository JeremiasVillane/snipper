import { z } from "zod";

import { REGEX, reservedWords } from "../constants";

const domainErrorMessage =
  "Invalid domain name. Must be between 2 and 12 characters, not start or end with a hyphen, and should not include reserved subdomains.";

export const customDomainSchema = z
  .string()
  .min(2, "Subdomain must be between 2 and 12 characters")
  .max(12, "Subdomain must be between 2 and 12 characters")
  .refine(
    (data) => (data.length > 1 && REGEX.subDomain.test(data)) || data === "",
    {
      message: domainErrorMessage,
    },
  )
  .refine(
    (data) => data === "" || !reservedWords.includes(data.toLowerCase()),
    {
      message: "This subdomain is reserved and cannot be used.",
    },
  );

export const createCustomDomainSchema = z.object({
  domain: customDomainSchema,
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
  shortLinkIds: z.array(z.string().uuid()),
});

export type CreateCustomDomainInput = z.infer<typeof createCustomDomainSchema>;

const customDomainIdSchema = z.object({
  id: z.string().uuid("Invalid custom domain ID"),
});

export const getCustomDomainSchema = customDomainIdSchema;

export const updateCustomDomainSchema =
  createCustomDomainSchema.merge(customDomainIdSchema);

export const deleteCustomDomainSchema = z.object({
  id: customDomainIdSchema.shape.id,
});
