import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PricingCTA() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter mb-4">
          Ready to Get Started?
        </h2>
        <p className="md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed opacity-90 max-w-2xl mx-auto mb-8 text-pretty">
          Create an account today and start shortening your links with powerful
          features.
        </p>
        <Link href="/register">
          <Button size="lg" variant="secondary">
            Sign Up Free
          </Button>
        </Link>
      </div>
    </section>
  );
}
