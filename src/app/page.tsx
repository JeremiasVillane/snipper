import { publicUrl } from "@/env.mjs";

import { appName } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import { generateOgImageUrl } from "@/lib/og";
import { CTASection, FeaturesSection, HeroSection } from "@/components/home";

export const generateMetadata = async () => {
  const title = `${appName}: URL shortnener | Landing Page`;

  const description =
    "Create personalized, branded links and track its performance with comprehensive statistics and insights.";

  return constructMetadata({
    title,
    description,
    openGraph: {
      images: [
        {
          url: generateOgImageUrl({
            title,
            type: "website",
          }),
          width: 1200,
          height: 630,
          alt: "Create and track short links",
        },
      ],
    },
    alternates: {
      canonical: publicUrl,
    },
  });
};

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />

      <FeaturesSection />

      <CTASection />

      {/* <section id="faq" className="container py-12 md:py-24">
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
              <CardTitle>What is Snippr?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Snippr is a URL shortening service that allows you to create
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
                Yes, Snippr offers a free tier with basic URL shortening
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
                All users can create links without expiration. Premium users can set custom
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
      </section> */}
    </main>
  );
}
