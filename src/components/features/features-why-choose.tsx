import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { List, ListItem } from "@/components/ui/list";

import WhyChooseInfoCards from "./features-why-choose-cards";

interface WhyChooseItem {
  title: string;
  description: string;
}

const WHY_CHOOSE_ITEMS: WhyChooseItem[] = [
  {
    title: "User-Friendly Interface",
    description: "Clean, intuitive design makes link management simple",
  },
  {
    title: "Comprehensive Analytics",
    description:
      "Make data-driven decisions with detailed link performance metrics",
  },
  {
    title: "Flexible Organization",
    description: "Manage links your way with custom tags and smart filtering",
  },
  {
    title: "Source-Available & Transparent",
    description:
      "Review every line of code and collaborate under our non-commercial license",
  },
];

export function FeaturesWhyChoose() {
  return (
    <section className="bg-muted/50 py-20">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter">
              Why Choose Snipper?
            </h2>
            <p className="text-muted-foreground">
              Our platform offers a complete solution for all your link
              management needs, with benefits that help you work smarter.
            </p>

            <List
              variant="none"
              icon={
                <div className="rounded-full bg-primary/10 p-1">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
              }
              className="mt-6 space-y-4 [&>li]:before:mr-1"
            >
              {WHY_CHOOSE_ITEMS.map((item, index) => (
                <ListItem key={index} className="flex gap-2">
                  <article>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </article>
                </ListItem>
              ))}
            </List>

            <div className="pt-4">
              <Link href="/register">
                <Button
                  size="lg"
                  iconRight={<ChevronRight className="ml-2 h-4 w-4" />}
                  iconAnimation="translateXRight"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>

          <WhyChooseInfoCards />
        </div>
      </div>
    </section>
  );
}
