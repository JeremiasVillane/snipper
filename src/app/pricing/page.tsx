import { appName } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import { generateOgImageUrl } from "@/lib/og";
import {
  PricingCTA,
  PricingFAQ,
  PricingHero,
  PricingTiers,
} from "@/components/pricing";

export const generateMetadata = async () => {
  const title = `${appName} Pricing: Plans for Every Need | URL Shortener`;
  const description = `Discover ${appName}'s pricing options, including powerful free features for self-hosting and affordable plans with advanced capabilities. Start shortening and tracking links effectively today.`;

  return constructMetadata({
    title,
    description,
    keywords: [
      `${appName.toLowerCase()} pricing`,
      "url shortener cost",
      "link shortener plans",
      "affordable link tracker",
      "link analytics pricing",
      "UTM tracker cost",
    ],
    openGraph: {
      images: [
        {
          url: generateOgImageUrl({
            title: `${appName} Pricing Plans`,
            type: "website",
          }),
          width: 1200,
          height: 630,
          alt: `Overview of ${appName} URL Shortener Pricing Plans and Options`,
        },
      ],
    },
  });
};

export default function PricingPage() {
  return (
    <main className="flex-grow">
      <PricingHero />
      <PricingTiers />
      <PricingFAQ />
      <PricingCTA />
    </main>
  );
}
