import { customAlphabet } from "nanoid";

export function generateShortCode(length = 6): string {
  const nanoid = customAlphabet(
    "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    9
  );
  const shortCode = nanoid();

  return shortCode;
}
