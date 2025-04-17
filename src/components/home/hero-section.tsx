import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Shorten, Share, Track
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Create short, memorable links in seconds. Track performance with
                powerful analytics. Take control of your links.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="#shorten">
                <Button size="lg" className="gap-1.5">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-[4/3] overflow-hidden rounded-xl border bg-background shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-700 opacity-20"></div>
              <div className="relative p-6 flex flex-col h-full justify-center">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-lg mb-4 transform rotate-[-2deg]">
                  <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded flex items-center px-3">
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-lg transform rotate-[1deg]">
                  <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="h-10 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center px-3">
                    <div className="h-4 w-1/3 bg-purple-200 dark:bg-purple-700 rounded"></div>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg">
                  <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
