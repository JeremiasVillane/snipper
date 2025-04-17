import {
  PricingCTA,
  PricingFAQ,
  PricingHero,
  PricingTiers,
} from "@/components/pricing";

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
