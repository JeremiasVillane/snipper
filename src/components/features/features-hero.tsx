import { appName } from "@/lib/constants";

export function FeaturesHero() {
  return (
    <section className="bg-gradient-to-b from-secondary to-secondary/20 py-20">
      <div className="container px-4 md:px-6">
        <div className="mb-12 flex flex-col items-center space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Powerful Features for Your Links
          </h1>
          <p className="max-w-3xl text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Discover all the tools and capabilities that make {appName} the
            perfect solution for your link management needs.
          </p>
        </div>
      </div>
    </section>
  );
}
