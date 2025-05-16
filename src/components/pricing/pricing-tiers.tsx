import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";

import { PricingCard } from "./pricing-card";

type Feature = {
  text: string;
  included: boolean;
};

export type PricingTier = {
  name: string;
  price: number;
  description: string;
  features: Feature[];
  isPopular?: boolean;
};

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for personal use and trying out the service.",
    features: [
      { text: "Up to 10 short links", included: true },
      { text: "Basic click analytics", included: true },
      { text: "UTM builder (1 campaign per link)", included: true },
      { text: "QR code generation", included: true },
      { text: "Custom short URLs", included: false },
      { text: "Password protection", included: false },
      { text: "Link expiration", included: false },
      { text: "Custom preview link image", included: false },
    ],
  },
  {
    name: "Pro",
    price: 9,
    description: "Perfect for professionals and small businesses.",
    isPopular: true,
    features: [
      { text: "Up to 500 short links", included: true },
      { text: "Advanced analytics dashboard", included: true },
      { text: "Advanced QR customization", included: true },
      { text: "Custom short URLs", included: true },
      { text: "Password protection", included: true },
      { text: "Link expiration", included: true },
      { text: "Custom preview link image", included: true },
      { text: "UTM builder (3 campaigns per link)", included: true },
      { text: "API access", included: false },
    ],
  },
  {
    name: "Business",
    price: 19,
    description: "Perfect for teams and growing businesses.",
    features: [
      { text: "Unlimited short links", included: true },
      { text: "Comprehensive analytics with exports", included: true },
      { text: "Advanced QR customization", included: true },
      { text: "Custom short URLs", included: true },
      { text: "Password protection", included: true },
      { text: "Link expiration", included: true },
      { text: "Custom preview link image", included: true },
      { text: "Advanced UTM campaign tools", included: true },
      { text: "API access", included: true },
    ],
  },
];

export function PricingTiers() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <BlurFade direction="up" offset={12}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier} />
            ))}
          </div>
        </BlurFade>

        <div className="mt-16 text-center">
          <h3 className="mb-2 text-xl font-bold">Need a custom plan?</h3>
          <p className="mb-6 text-muted-foreground">
            We offer custom enterprise plans for larger teams and specific
            requirements.
          </p>
          <Button variant="outline">Contact Sales</Button>
        </div>
      </div>
    </section>
  );
}
