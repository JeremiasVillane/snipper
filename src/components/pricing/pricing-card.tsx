import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";

import { PricingTier } from "./pricing-tiers";

interface PricingCardProps {
  tier: PricingTier;
}

export function PricingCard({ tier }: PricingCardProps) {
  const includedFeatures = tier.features.filter((f) => f.included);
  const excludedFeatures = tier.features.filter((f) => !f.included);

  return (
    <Card
      className={`flex h-full flex-col transition-transform duration-200 hover:scale-105 ${tier.isPopular ? "border-primary" : ""}`}
    >
      <CardHeader
        className={
          tier.isPopular
            ? "rounded-t-lg bg-primary text-primary-foreground"
            : ""
        }
      >
        {tier.isPopular && (
          <div className="mb-4 w-fit rounded-full bg-primary-foreground px-3 py-1 text-sm font-medium text-primary">
            Most Popular
          </div>
        )}
        <CardTitle>{tier.name}</CardTitle>
        <div className="mt-4">
          <span className="text-3xl font-bold">${tier.price}</span>
          <span className={tier.isPopular ? "" : "text-muted-foreground"}>
            /month
          </span>
        </div>
        <CardDescription
          className={`mt-2 ${tier.isPopular ? "text-primary-foreground/90" : ""}`}
        >
          {tier.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <List
          icon={<CheckCircle2 className="size-5 text-primary" />}
          spacing="relaxed"
          className={`${tier.isPopular ? "pt-6" : ""} [&>li]:before:mr-1`}
        >
          {includedFeatures.map((feature) => (
            <ListItem key={feature.text}>{feature.text}</ListItem>
          ))}
        </List>
        {excludedFeatures.length > 0 && (
          <List
            icon={<X className="size-5 text-muted-foreground" />}
            spacing="relaxed"
            className="mb-4 mt-2 text-muted-foreground"
          >
            {excludedFeatures.map((feature) => (
              <ListItem key={feature.text}>{feature.text}</ListItem>
            ))}
          </List>
        )}
      </CardContent>
      <CardFooter className="pt-4">
        <Link href="/register" className="w-full">
          <Button
            variant={tier.isPopular ? "default" : "outline"}
            className="w-full"
          >
            Get Started
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
