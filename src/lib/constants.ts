import packageJson from "../../package.json";

export const appName = packageJson.name.replace(/\w/, (c) => c.toUpperCase());

export const publicPaths = [
  "api-docs",
  "features",
  "login",
  "pricing",
  "register",
];

export const privatePaths = ["dashboard", "admin"];

export const reservedPaths = [...publicPaths, ...privatePaths];

export const reservedAlias = [
  "www",
  "admin",
  "api",
  "snipper",
  "snippr",
  "snnpr",
  "google",
  "http",
  "https",
  "admin",
  "settings",
  "x",
  "fb",
  "ig",
  "gh",
  "jv",
  "jv-cv",
  "jv-in",
  "jv-gh",
  "jv-x",
  "jv-ig",
  "jv-fb",
  "jv-yt",
];

export const reservedWords = [...reservedAlias, ...reservedPaths];

export const REGEX = {
  /** It must:
   * - start with a letter or number
   * - end with a letter or number
   * - contain only letters, numbers, hyphens, and underscores
   * - not contain consecutive hyphens or underscores
   * - not start or end with a hyphen or underscore
   * - be between 3 and 15 characters long
   */
  shortCode: /^(?!.*(--|__|-_|_-))(?![-_])[a-zA-Z0-9_-]{3,15}(?<![-_])$/,
  /** It must:
   * - start with a letter or number
   * - end with a letter or number
   * - contain only letters, numbers, hyphens, and underscores
   * - not contain consecutive hyphens or underscores
   * - not start or end with a hyphen or underscore
   * - be between 2 and 12 characters long
   */
  subDomain: /^(?!.*(--|__|-_|_-))(?![-_])[a-z0-9_-]{2,12}(?<![-_])$/,
};
