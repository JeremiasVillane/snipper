import { ArrowIcon, GitHubIcon, LinkedInIcon } from "@/components";
import { Image, Link } from "@nextui-org/react";
import { Metadata } from "next";
import NextLink from "next/link";

export const metadata: Metadata = {
  title: "About | Snipper",
};

export default function AboutPage() {
  return (
    <main className="flex flex-col">
      <section
        id="hero"
        className="relative bg-cover bg-center bg-no-repeat py-8 w-screen"
        style={{ backgroundImage: "url(/bg-hero.jpg)" }}
      >
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-hero-gradient-from to-hero-gradient-to dark:from-hero-gradient-dark-from dark:to-hero-gradient-dark-to bg-cover bg-center bg-no-repeat"></div>

        <div className="container relative z-30 pt-20 pb-12 sm:pt-56 sm:pb-48 lg:pt-64 lg:pb-48">
          <div className="flex flex-col items-center justify-center lg:flex-row">
            <div className="rounded-full border-8 border-primary shadow-xl">
              <Image
                src="/author.jpg"
                className="h-48 rounded-full sm:h-56 select-none"
                alt="author"
              />
            </div>
            <div className="pt-8 sm:pt-10 lg:pl-8 lg:pt-0">
              <h1 className="text-center font-header text-4xl text-white sm:text-left sm:text-5xl md:text-6xl">
                Hello I&apos;m Jeremias Villane!
              </h1>
              <div className="flex flex-col justify-center pt-3 sm:flex-row sm:pt-5 lg:justify-start">
                <div className="flex items-center justify-center pl-0 sm:justify-start md:pl-1">
                  <p className="font-body text-lg uppercase text-white">
                    Full Stack Developer
                  </p>
                  <div className="hidden sm:block">
                    <i className="bx bx-chevron-right text-3xl text-yellow"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="pl-0 md:pl-9">
        <div className="container flex flex-col items-center py-16 md:py-20 lg:flex-row">
          <article className="w-full text-center sm:w-3/4 lg:w-3/5 lg:text-left">
            <h2 className="font-header text-4xl font-semibold uppercase text-primary sm:text-5xl lg:text-6xl">
              What is this?
            </h2>
            <h4 className="pt-6 font-header text-xl font-medium text-black dark:text-white sm:text-2xl lg:text-3xl">
              <b>Snipper</b> is a small project to continue my learning of Full
              Stack Web Development
            </h4>
            <p className="pt-6 font-body leading-relaxed text-grey-20">
              I am an enthusiastic web developer in constant search of knowledge
              and creative solutions. My adventure in the development world
              began when I discovered the power of technology to change the way
              we live and work, thanks to my studies in Computer Science. Since
              then, I have been immersed in learning new technologies.
              <br />
              My experience with <b>JavaScript/Typescript</b> has allowed me to
              create interactive and dynamic web applications, using{" "}
              <b>React</b> and <b>Redux</b> as fundamental tools and recently
              with <b>NextJS</b>. In addition, I have worked with <b>Node.js</b>{" "}
              to develop robust and scalable backend services, managing{" "}
              <b>SQL</b> databases primarely using <b>PostgreSQL</b> and{" "}
              <b>Express</b>.
            </p>
            <div className="flex flex-col justify-center pt-6 sm:flex-row lg:justify-start">
              <div className="flex items-center justify-center sm:justify-start">
                <p className="font-body text-lg font-semibold uppercase text-grey-20 select-none">
                  Connect with me
                </p>
                <div className="hidden sm:block">
                  <ArrowIcon color="#d59453" className="mx-2" />
                </div>
              </div>
              <div className="flex items-center justify-center pt-5 pl-2 sm:justify-start sm:pt-0">
                <a
                  href="https://snppr.vercel.app/r0nyEBaLC"
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  <GitHubIcon
                    name="GitHub"
                    className="dark:invert transform hover:scale-105 duration-200 select-none"
                  />
                </a>
                <a
                  href="https://snppr.vercel.app/2Vt7W2xMe"
                  rel="noreferrer noopener"
                  target="_blank"
                  className="pl-4"
                >
                  <LinkedInIcon
                    name="LinkedIn"
                    className="transform hover:scale-105 duration-200 select-none"
                  />
                </a>
              </div>
            </div>
          </article>

          <article
            id="tech-stack"
            className="w-full pl-2 pt-10 sm:w-3/4 lg:w-2/5 lg:pl-12 lg:pt-0"
          >
            <div>
              <div className="flex items-end justify-between">
                <h4 className="font-body text-lg font-semibold uppercase text-grey-20">
                  Tech Stack used:
                </h4>
              </div>
            </div>
            <div className="pt-6">
              <div className="flex items-end justify-between">
                <h4 className="font-body font-semibold text-black dark:text-white">
                  Framework: NEXTJS 14
                </h4>
              </div>
            </div>
            <div className="pt-6">
              <div className="flex items-end justify-between">
                <h4 className="font-body font-semibold text-black dark:text-white">
                  Language: TYPESCRIPT
                </h4>
              </div>
            </div>
            <div className="pt-6">
              <div className="flex items-end justify-between">
                <h4 className="font-body font-semibold text-black dark:text-white">
                  Database: PRISMA, POSTGRESQL
                </h4>
              </div>
            </div>
            <div className="pt-6">
              <div className="flex items-end justify-between">
                <h4 className="font-body font-semibold text-black dark:text-white">
                  Styles: TAILWIND CSS, NEXT-THEMES, NEXTUI, FRAMER MOTION
                </h4>
              </div>
            </div>
            <div className="pt-6">
              <div className="flex items-end justify-between">
                <Link
                  isExternal
                  showAnchorIcon
                  href="https://snppr.vercel.app/BOWA6mKuF"
                  as={NextLink}
                >
                  Visit source code on GitHub.
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
