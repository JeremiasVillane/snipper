import { z } from "zod";

import { REGEX, reservedWords } from "../constants";

const domainErrorMessage =
  "Invalid domain name. Must be between 2 and 12 characters, not start or end with a hyphen, and should not include reserved subdomains.";

export const customDomainSchema = z
  .string()
  .max(12, "Domain name must be less than or equal to 12 characters")
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
});

export type CreateCustomDomainInput = z.infer<typeof createCustomDomainSchema>;

const customDomainIdSchema = z.object({
  id: z.string().uuid("Invalid custom domain ID"),
});

export const getCustomDomainSchema = customDomainIdSchema;

export const updateCustomDomainSchema = z.object({
  id: customDomainIdSchema.shape.id,
  domain: customDomainSchema,
});

export const deleteCustomDomainSchema = z.object({
  id: customDomainIdSchema.shape.id,
});
