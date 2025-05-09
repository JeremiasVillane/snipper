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
