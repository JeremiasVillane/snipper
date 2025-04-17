import {
  BarChart3,
  CheckCircle2,
  type LucideIcon,
  PenTool,
  QrCode,
  Shield,
  Zap,
} from "lucide-react";
import { Card } from "../ui/card";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: FeatureItem[] = [
  {
    icon: PenTool,
    title: "Custom Links",
    description:
      "Create branded short links with custom aliases that are memorable and promote your brand.",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description:
      "Track clicks, locations, devices, and more with our powerful analytics dashboard.",
  },
  {
    icon: QrCode,
    title: "QR Codes",
    description:
      "Generate QR codes for your short links to share them in print and physical media.",
  },
  {
    icon: Zap,
    title: "UTM Builder",
    description:
      "Add UTM parameters to your links for enhanced campaign tracking and analytics.",
  },
  {
    icon: Shield,
    title: "Link Protection",
    description:
      "Set passwords and expiration dates to control access to your links.",
  },
  {
    icon: CheckCircle2,
    title: "Easy Organization",
    description:
      "Organize your links with tags and search functionality to quickly find what you need.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="container py-12 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Powerful Features
        </h2>
        <p className="mt-4 text-muted-foreground">
          Everything you need to create, share, and track your links.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <Card key={index} className="space-y-4 p-6">
            <div className="inline-flex items-center justify-center rounded-lg p-2 bg-primary/10">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
