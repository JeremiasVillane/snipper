import {
  BarChart3,
  CheckCircle2,
  PenTool,
  QrCode,
  Shield,
  Tag,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { BlurFade } from "@/components/ui/blur-fade";
import { Card } from "@/components/ui/card";

interface FeatureDetail {
  icon: LucideIcon;
  title: string;
  description: string;
  points: string[];
}

const FEATURE_DETAILS: FeatureDetail[] = [
  {
    icon: PenTool,
    title: "Custom Short Links",
    description:
      "Create personalized, branded links that are memorable and promote your brand identity.",
    points: [
      "Choose custom aliases for your URLs",
      "Simple validation ensures availability",
      "Easy to remember and share",
    ],
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Track and analyze your link performance with comprehensive statistics and insights.",
    points: [
      "Track clicks over time with visual charts",
      "See device, browser, and OS breakdown",
      "Analyze geographic distribution of visitors",
    ],
  },
  {
    icon: QrCode,
    title: "QR Code Generation",
    description:
      "Generate QR codes for your short links to share them across digital and print media.",
    points: [
      "One-click QR code generation",
      "Download high-quality images",
      "Perfect for print materials and presentations",
    ],
  },
  {
    icon: Zap,
    title: "UTM Builder",
    description:
      "Add and manage UTM parameters for enhanced campaign tracking and analytics integration.",
    points: [
      "Built-in UTM parameter builder",
      "Integrates with Google Analytics",
      "Track campaign effectiveness",
    ],
  },
  {
    icon: Shield,
    title: "Link Protection",
    description:
      "Secure your links with passwords and set expiration dates for temporary access.",
    points: [
      "Password-protect sensitive links",
      "Set automatic expiration dates",
      "Control access to confidential information",
    ],
  },
  {
    icon: Tag,
    title: "Organization Tools",
    description:
      "Organize and manage your links efficiently with tags, search, and filtering options.",
    points: [
      "Tag links for easy categorization",
      "Search across all your links",
      "Filter by tags, date, and more",
    ],
  },
];

export function FeaturesDetails() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FEATURE_DETAILS.map((feature, index) => (
            <BlurFade key={feature.title} delay={0.25 + index * 0.05} inView>
              <Card key={index} className="space-y-4 rounded-lg p-6">
                <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-2">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start">
                      <CheckCircle2 className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
