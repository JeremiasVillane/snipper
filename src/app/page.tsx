import { HeroSection } from "@/components/home/hero-section";
import { ShortenerForm } from "@/components/home/shortener-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Clock,
  Globe,
  Key,
  Link2,
  QrCode,
  Tag,
  Zap,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Snipper: URL shortnener",
};

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />

      <section className="container py-12 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Shorten Your URL
          </h2>
          <p className="mt-4 text-muted-foreground">
            Create a short link in seconds. Sign up for more features.
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-2xl">
          <ShortenerForm />
        </div>
      </section>

      <section id="features" className="container py-12 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Powerful Features
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to manage and track your links
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Link2 className="h-6 w-6 mb-2 text-primary" />
              <CardTitle>Custom URLs</CardTitle>
              <CardDescription>
                Create memorable, branded short links with custom aliases
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Clock className="h-6 w-6 mb-2 text-primary" />
              <CardTitle>Expiration Dates</CardTitle>
              <CardDescription>
                Set your links to expire after a specific time period
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Key className="h-6 w-6 mb-2 text-primary" />
              <CardTitle>Password Protection</CardTitle>
              <CardDescription>
                Secure your links with password protection
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Tag className="h-6 w-6 mb-2 text-primary" />
              <CardTitle>Organize with Tags</CardTitle>
              <CardDescription>
                Categorize and organize your links with custom tags
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <QrCode className="h-6 w-6 mb-2 text-primary" />
              <CardTitle>QR Code Generation</CardTitle>
              <CardDescription>
                Generate QR codes for your short links instantly
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <BarChart3 className="h-6 w-6 mb-2 text-primary" />
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Track clicks, locations, devices, and more
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Globe className="h-6 w-6 mb-2 text-primary" />
              <CardTitle>Geo Tracking</CardTitle>
              <CardDescription>
                See where your link visitors are coming from
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Zap className="h-6 w-6 mb-2 text-primary" />
              <CardTitle>UTM Builder</CardTitle>
              <CardDescription>
                Create and manage UTM parameters for campaign tracking
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <BarChart3 className="h-6 w-6 mb-2 text-primary" />
              <CardTitle>Detailed Reports</CardTitle>
              <CardDescription>
                Get insights with detailed analytics reports
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section
        id="pricing"
        className="container py-12 md:py-24 bg-slate-50 dark:bg-slate-900 rounded-xl"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Simple Pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start for free, upgrade for more features
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>
                Basic link shortening for everyone
              </CardDescription>
              <div className="mt-4 text-4xl font-bold">$0</div>
              <p className="text-sm text-muted-foreground">Forever free</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                  Basic URL shortening
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-primary" />5 links
                  per day
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                  Basic click tracking
                </li>
              </ul>
              <Button className="mt-6 w-full">Get Started</Button>
            </CardContent>
          </Card>
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>
                For professionals and small teams
              </CardDescription>
              <div className="mt-4 text-4xl font-bold">$9</div>
              <p className="text-sm text-muted-foreground">per month</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                  Everything in Free
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                  Unlimited links
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                  Custom URLs
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                  QR code generation
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                  Password protection
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                  Advanced analytics
                </li>
              </ul>
              <Button className="mt-6 w-full">Upgrade to Pro</Button>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>
                For large organizations and teams
              </CardDescription>
              <div className="mt-4 text-4xl font-bold">$29</div>
              <p className="text-sm text-muted-foreground">per month</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                  Everything in Pro
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                  Team management
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                  API access
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                  Custom branding
                </li>
                <li className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                  Priority support
                </li>
              </ul>
              <Button className="mt-6 w-full">Contact Sales</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="faq" className="container py-12 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Answers to common questions about our service
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>What is LinkSnip?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                LinkSnip is a URL shortening service that allows you to create
                short, memorable links from long URLs. It also provides
                analytics and tracking features.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Is it free to use?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Yes, LinkSnip offers a free tier with basic URL shortening
                features. Premium features are available with paid plans.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>How long do links last?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Free links last for 30 days. Premium users can set custom
                expiration dates or create permanent links.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Can I customize my short links?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Yes, premium users can create custom short links with their
                preferred aliases, making them more memorable and branded.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
