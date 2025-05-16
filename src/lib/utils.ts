import { deepStrictEqual } from "assert";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date for display
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function isDeepEqual(a: unknown, b: unknown) {
  try {
    deepStrictEqual(a, b);
    return true;
  } catch {
    return false;
  }
}

export const slugify = (text: string) => {
  return text
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/_/g, "-") // Replace _ with -
    .replace(/:/g, "-") // Replace : with -
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/-$/g, ""); // Remove trailing -
};
