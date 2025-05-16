import { appName } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import { generateOgImageUrl } from "@/lib/og";
import {
  FeaturesCTA,
  FeaturesDetails,
  FeaturesHero,
  FeaturesWhyChoose,
} from "@/components/features";

export const generateMetadata = async () => {
  const title = `${appName} Features: Custom Links, Analytics, UTM & QR Codes`;

  const description = `Discover ${appName}'s powerful URL shortener features: custom branded links, advanced click analytics (geo, device), QR code generation, built-in UTM builder for campaign tracking, password protection, and link organization tools.`;

  return constructMetadata({
    title,
    description,
    keywords: [
      "link analytics",
      "UTM builder",
      "QR code generator",
      "custom short links",
      "link tracking",
      "password protected links",
      "branded links",
    ],
    openGraph: {
      images: [
        {
          url: generateOgImageUrl({
            title: `Explore ${appName} Features`,
            type: "website",
          }),
          width: 1200,
          height: 630,
          alt: `Overview of ${appName} features: Analytics, Custom Links, UTM Builder, QR Codes`,
        },
      ],
    },
  });
};

export default function FeaturesPage() {
  return (
    <main className="flex-grow">
      <FeaturesHero />
      <FeaturesDetails />
      <FeaturesWhyChoose />
      <FeaturesCTA />
    </main>
  );
}
