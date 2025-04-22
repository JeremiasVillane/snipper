import { BlurFade } from "@/components/ui/blur-fade";
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
import { CheckCircle2, X } from "lucide-react";
import Link from "next/link";

export function PricingTiers() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <BlurFade>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="flex flex-col h-full hover:scale-105 transition-transform">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2">
                  Perfect for personal use and trying out the service.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <List
                  icon={<CheckCircle2 className="size-5 text-primary" />}
                  spacing="relaxed"
                  className="[&>li]:before:mr-1"
                >
                  <ListItem>Up to 10 short links</ListItem>
                  <ListItem>Basic click analytics</ListItem>
                  <ListItem>QR code generation</ListItem>
                </List>
                <List
                  icon={<X className="size-5 text-muted-foreground" />}
                  spacing="relaxed"
                  className="mb-6 mt-2 text-muted-foreground"
                >
                  <ListItem>Custom short URLs</ListItem>
                  <ListItem>Password protection</ListItem>
                  <ListItem>UTM builder</ListItem>
                  <ListItem>Link expiration</ListItem>
                  <ListItem>Detailed analytics</ListItem>
                </List>
              </CardContent>
              <CardFooter className="pt-4">
                <Link href="/register" className="w-full">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="flex flex-col h-full border-primary hover:scale-105 transition-transform">
              <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
                <div className="py-1 px-3 bg-primary-foreground text-primary text-sm rounded-full w-fit font-medium mb-4">
                  Most Popular
                </div>
                <CardTitle>Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$9</span>
                  <span>/month</span>
                </div>
                <CardDescription className="mt-2 text-primary-foreground/90">
                  Perfect for professionals and small businesses.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <List
                  icon={<CheckCircle2 className="size-5 text-primary" />}
                  spacing="relaxed"
                  className="[&>li]:before:mr-1 pt-6"
                >
                  <ListItem>Up to 500 short links</ListItem>
                  <ListItem>Advanced analytics dashboard</ListItem>
                  <ListItem>QR code generation & customization</ListItem>
                  <ListItem>Custom short URLs</ListItem>
                  <ListItem>Password protection</ListItem>
                  <ListItem>UTM builder</ListItem>
                  <ListItem>Link expiration</ListItem>
                </List>
                <List
                  icon={<X className="size-5 text-muted-foreground" />}
                  spacing="relaxed"
                  className="mb-4 mt-2"
                >
                  <ListItem className="text-muted-foreground">
                    API access
                  </ListItem>
                </List>
              </CardContent>
              <CardFooter className="pt-4">
                <Link href="/register" className="w-full">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Business Plan */}
            <Card className="flex flex-col h-full hover:scale-105 transition-transform">
              <CardHeader>
                <CardTitle>Business</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2">
                  Perfect for teams and growing businesses.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <List
                  icon={<CheckCircle2 className="size-5 text-primary" />}
                  spacing="relaxed"
                  className="[&>li]:before:mr-1"
                >
                  <ListItem>Unlimited short links</ListItem>
                  <ListItem>Comprehensive analytics with exports</ListItem>
                  <ListItem>Advanced QR customization</ListItem>
                  <ListItem>Custom short URLs</ListItem>
                  <ListItem>Password protection</ListItem>
                  <ListItem>Advanced UTM campaign tools</ListItem>
                  <ListItem>Link expiration & scheduling</ListItem>
                  <ListItem>API access</ListItem>
                </List>
              </CardContent>
              <CardFooter className="pt-4">
                <Link href="/register" className="w-full">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </BlurFade>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold mb-2">Need a custom plan?</h3>
          <p className="text-muted-foreground mb-6">
            We offer custom enterprise plans for larger teams and specific
            requirements.
          </p>
          <Button variant="outline">Contact Sales</Button>
        </div>
      </div>
    </section>
  );
}
