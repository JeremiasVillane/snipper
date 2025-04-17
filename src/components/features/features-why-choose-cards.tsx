import { Card } from "@/components/ui/card";
import {
  Calendar,
  Globe,
  Layers,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

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
        <Card
          key={index}
          className="rounded-lg p-6 flex flex-col items-center text-center space-y-2"
        >
          <card.icon className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">{card.title}</h3>
          <p className="text-sm text-muted-foreground">{card.description}</p>
        </Card>
      ))}
    </div>
  );
}
