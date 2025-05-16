import {
  Calendar,
  Globe,
  Layers,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import { BlurFade } from "@/components/ui/blur-fade";
import { Card } from "@/components/ui/card";

interface InfoCardItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const INFO_CARDS: InfoCardItem[] = [
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Track link clicks from anywhere in the world",
  },
  {
    icon: Calendar,
    title: "Time Analysis",
    description: "See when your links perform best",
  },
  {
    icon: Smartphone,
    title: "Device Insights",
    description: "Understand how users access your content",
  },
  {
    icon: Layers,
    title: "Campaign Tracking",
    description: "Monitor multiple campaigns simultaneously",
  },
];

export default function WhyChooseInfoCards() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {INFO_CARDS.map((card, index) => (
        <BlurFade
          key={card.title}
          delay={0.25 + index * 0.05}
          duration={1}
          inView
        >
          <Card
            key={index}
            className="flex h-full flex-col items-center space-y-2 rounded-lg p-6 text-center"
          >
            <card.icon className="mb-2 h-8 w-8 text-primary" />
            <h3 className="font-medium">{card.title}</h3>
            <p className="text-pretty text-sm text-muted-foreground">
              {card.description}
            </p>
          </Card>
        </BlurFade>
      ))}
    </div>
  );
}
