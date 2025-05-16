import { Metadata } from "next";

import { appName } from "./constants";

/** This function constructs the metadata for the application,
 * including title, description, Open Graph data, and authors.
 * It also includes a manifest file for the application.
 *
 * @param {Metadata} metadata - The metadata object containing the title, description, and Open Graph data.
 * @returns {Metadata} - The constructed metadata object.
 */
export const constructMetadata = (metadata: Metadata): Metadata => {
  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title!,
      description: metadata.description!,
      siteName: appName,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          height: 630,
          width: 1200,
          alt: appName,
        },
      ],
      locale: "en_US",
      ...metadata.openGraph,
    },
    authors: [
      {
        name: "Jeremias Villane",
        url: "https://github.com/snipper",
      },
    ],
    manifest: "/site.webmanifest",
    ...metadata,
  };
};
