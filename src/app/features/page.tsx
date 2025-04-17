import {
  FeaturesCTA,
  FeaturesDetails,
  FeaturesHero,
  FeaturesWhyChoose,
} from "@/components/features";

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
