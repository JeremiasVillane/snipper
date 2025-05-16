import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { List, ListItem } from "@/components/ui/list";
import { TextAnimate } from "@/components/ui/text-animate";

export function CTASection() {
  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Ready to get more from your links?
            </h2>
            <p className="opacity-90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Create an account today and unlock all premium features to manage
              your links like a pro.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Sign Up Free
                </Button>
              </Link>
              <Link href="/features">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-primary-foreground bg-primary/20 sm:w-auto"
                >
                  View All Features
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:ml-auto">
            <List
              variant="none"
              spacing="loose"
              icon={
                <CheckCircle2 className="mb-0.5 h-5 w-5 text-primary-foreground" />
              }
              className="text-primary-foreground [&>li]:before:pr-1"
            >
              <ListItem>
                <TextAnimate as="span" once by="text">
                  Custom branded links
                </TextAnimate>
              </ListItem>
              <ListItem>
                <TextAnimate
                  as="span"
                  once
                  by="text"
                  delay={0.1}
                  duration={0.7}
                >
                  Detailed click analytics
                </TextAnimate>
              </ListItem>
              <ListItem>
                <TextAnimate
                  as="span"
                  once
                  by="text"
                  delay={0.2}
                  duration={0.7}
                >
                  QR code generation
                </TextAnimate>
              </ListItem>
              <ListItem>
                <TextAnimate
                  as="span"
                  once
                  by="text"
                  delay={0.3}
                  duration={0.7}
                >
                  Password protection
                </TextAnimate>
              </ListItem>
              <ListItem>
                <TextAnimate
                  as="span"
                  once
                  by="text"
                  delay={0.4}
                  duration={0.7}
                >
                  Link expiration settings
                </TextAnimate>
              </ListItem>
              <ListItem>
                <TextAnimate
                  as="span"
                  once
                  by="text"
                  delay={0.5}
                  duration={0.7}
                >
                  UTM parameter builder
                </TextAnimate>
              </ListItem>
            </List>
          </div>
        </div>
      </div>
    </section>
  );
}
