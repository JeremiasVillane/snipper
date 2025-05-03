import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
