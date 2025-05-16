import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { appName } from "@/lib/constants";
import { CardBody, CardContainer } from "@/components/ui/3d-card";
import { AuroraText } from "@/components/ui/aurora-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { TextAnimate } from "@/components/ui/text-animate";

import { ScrollDownButton } from "../ui/scroll-down-button";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-secondary to-secondary/20 py-20">
      <div className="container min-h-screen px-4 md:px-6">
        <div className="grid items-center justify-center gap-6 lg:grid-cols-2 lg:justify-start lg:gap-12">
          <div className="space-y-4 text-center lg:text-left">
            <BlurFade direction="right">
              <AuroraText className="text-7xl font-extrabold tracking-tighter">
                {appName}
              </AuroraText>
            </BlurFade>
            <TextAnimate
              as="h1"
              animation="blurIn"
              once
              className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
            >
              Shorten, Share, Track
            </TextAnimate>
            <TextAnimate
              as="p"
              animation="blurIn"
              by="word"
              delay={0.3}
              duration={0.5}
              once
              className="max-w-[600px] text-muted-foreground md:text-xl"
            >
              Create short, memorable links in seconds. Track performance with
              powerful analytics. Take control of your links.
            </TextAnimate>

            <BlurFade direction="right" delay={0.5} duration={1}>
              <div className="flex flex-col justify-center gap-3 py-3 sm:flex-row lg:justify-start">
                <Link href="/register">
                  <Button
                    size="lg"
                    iconRight={<ArrowRight className="ml-1" />}
                    iconAnimation="translateXRight"
                    className="w-full sm:w-auto"
                  >
                    Get Started For Free
                  </Button>
                </Link>
                <Link href="/features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </BlurFade>
          </div>

          <BlurFade direction="right" delay={0.5}>
            <CardContainer className="hidden items-center justify-center lg:flex">
              <CardBody className="relative aspect-[4/3] w-full max-w-[500px] overflow-hidden rounded-xl border bg-background shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-700 opacity-20"></div>
                <div className="relative flex h-full flex-col justify-center p-6">
                  <BlurFade direction="down" delay={0.6} duration={1}>
                    <div className="mb-4 rotate-[-2deg] transform rounded-lg bg-white p-4 shadow-lg dark:bg-slate-900">
                      <div className="mb-2 h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
                      <div className="flex h-10 items-center rounded bg-slate-100 px-3 dark:bg-slate-800">
                        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
                      </div>
                    </div>
                  </BlurFade>
                  <BlurFade direction="up" delay={0.8} duration={1}>
                    <div className="rotate-[1deg] transform rounded-lg bg-white p-4 shadow-lg dark:bg-slate-900">
                      <div className="mb-2 h-6 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
                      <div className="flex h-10 items-center rounded bg-purple-100 px-3 dark:bg-purple-900/30">
                        <div className="h-4 w-1/3 rounded bg-purple-200 dark:bg-purple-700"></div>
                      </div>
                    </div>
                  </BlurFade>
                  <Link href="/register">
                    <div className="absolute bottom-4 right-4 rounded-full bg-white p-2 shadow-lg transition-all duration-300 hover:scale-110 dark:bg-slate-800">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 font-bold text-white">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </Link>
                </div>
              </CardBody>
            </CardContainer>
          </BlurFade>
        </div>
        <div className="flex w-full items-center justify-center pt-20">
          <ScrollDownButton targetId="features" />
        </div>
      </div>
    </section>
  );
}
