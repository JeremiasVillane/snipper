import Link from "next/link";

import { Button } from "@/components/ui/button";

export function FeaturesCTA() {
  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="container px-4 text-center md:px-6">
        <h2 className="mb-4 text-3xl font-bold tracking-tighter">
          Ready to Get Started?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-balance opacity-90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Create an account today and unlock the full potential of your links.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Sign Up Free
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground bg-primary/20"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
