import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FeaturesCTA() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter mb-4">
          Ready to Get Started?
        </h2>
        <p className="md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed opacity-90 max-w-2xl mx-auto mb-8 text-balance">
          Create an account today and unlock the full potential of your links.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Sign Up Free
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="bg-primary/20 border-primary-foreground"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
