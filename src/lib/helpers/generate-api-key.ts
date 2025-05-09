import { customAlphabet } from "nanoid";

export function generateApiKey(): string {
  const nanoid = customAlphabet(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    32,
  );
  const code = nanoid();

  return `lsk_${code}`;
}
