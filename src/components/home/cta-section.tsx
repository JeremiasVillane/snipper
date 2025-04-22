import { Button } from "@/components/ui/button";
import { List, ListItem } from "@/components/ui/list";
import { TextAnimate } from "@/components/ui/text-animate";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="bg-primary text-primary-foreground py-20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Ready to get more from your links?
            </h2>
            <p className="md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed opacity-90">
              Create an account today and unlock all premium features to manage
              your links like a pro.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
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
                  className="w-full sm:w-auto bg-primary/20 border-primary-foreground"
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
                <CheckCircle2 className="h-5 w-5 text-primary-foreground mb-0.5" />
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
