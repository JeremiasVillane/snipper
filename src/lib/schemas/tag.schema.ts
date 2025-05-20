import { z } from "zod";

export const tagIdSchema = z.object({
  id: z.string().min(1, "Tag ID is required"),
});

const tagName = z
  .string()
  .max(12, "Tag cannot be more than 12 characters long");

export const tagSchema = z.object({
  id: z.string(),
  name: tagName.min(2, { message: "Tag must be at least 2 characters long" }),
  color: z.string().length(7),
});

export const updateTagSchema = z.object({
  id: tagIdSchema.shape.id,
  name: tagName.optional(),
  color: tagSchema.shape.color.optional(),
});
