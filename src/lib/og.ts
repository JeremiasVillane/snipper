import { publicUrl } from "@/env.mjs";

/** This function generates a URL for an Open Graph image with the specified title, type, and mode.
 * It constructs the URL using the public URL and appends query parameters for the heading, type, and mode.
 *
 * @param {Object} params - The parameters for generating the Open Graph image URL.
 * @param {string} params.title - The title to be displayed in the Open Graph image.
 * @param {string} params.type - The type of the Open Graph image.
 * @param {string} [params.mode="light"] - The mode of the Open Graph image (light or dark).
 * @returns {string} - The generated Open Graph image URL.
 */
export const generateOgImageUrl = ({
  title,
  type,
  mode = "light",
}: {
  title: string;
  type: string;
  mode?: "light" | "dark";
}): string => {
  const url = publicUrl;

  const ogUrl = new URL(`${url}/api/og`);
  ogUrl.searchParams.set("heading", title);
  ogUrl.searchParams.set("type", type);
  ogUrl.searchParams.set("mode", mode);

  return ogUrl.toString();
};
