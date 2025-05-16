import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publicUrl } from "@/env.mjs";
import { ExternalLink } from "lucide-react";

import { usersRepository } from "@/lib/db/repositories";
import { buildShortUrl } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";

import { AppLogo } from "../../../../public/app-logo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  const rootDomain = new URL(publicUrl).host;

  return {
    title: `${subdomain}.${rootDomain}`,
    description: `Subdomain page for ${subdomain}.${rootDomain}`,
  };
}

interface SubdomainPage {
  params: Promise<{ subdomain: string }>;
}

export default async function SubdomainPage({ params }: SubdomainPage) {
  const { subdomain } = await params;

  const userData = await usersRepository.findByCustomDomain(subdomain);
  if (!userData) return notFound();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <article className="flex flex-col items-center justify-center space-y-6 pb-24">
          {/* Profile Header */}
          <header className="flex flex-col items-center space-y-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
              <Image
                src={userData.image || "/placeholder.svg"}
                alt={userData.name!}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {userData.name}'s Link Hub
              </h1>
              <p className="text-gray-600">@{subdomain}</p>
            </div>
            {/* <p className="max-w-md text-center text-gray-600">{userData.bio}</p> */}
          </header>

          {/* Social Links */}
          {/* <div className="flex space-x-4">
            {userData.socialLinks.map((social) => (
              <Link
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white p-2 text-gray-600 shadow-sm transition-all hover:scale-110 hover:text-purple-600 hover:shadow-md"
                aria-label={`${social.platform} profile`}
              >
                {social.platform === "twitter" && <Twitter size={20} />}
                {social.platform === "instagram" && <Instagram size={20} />}
                {social.platform === "github" && <Github size={20} />}
                {social.platform === "linkedin" && <Linkedin size={20} />}
                {social.platform === "email" && <Mail size={20} />}
              </Link>
            ))}
          </div> */}

          {/* Links */}
          <List variant="none" spacing="loose" className="w-full">
            {userData.shortLinks.map((link) => {
              return (
                <ListItem key={link.id}>
                  <Link
                    href={buildShortUrl(
                      link.shortCode,
                      link.customDomain?.domain,
                    )}
                  >
                    <Card className="group flex w-full items-center justify-between border-gray-100 bg-white p-4 transition-all hover:scale-[1.01] hover:shadow-md">
                      <div className="group-dark:hover:text-primary flex items-center gap-3 font-medium text-gray-600 group-hover:text-primary dark:text-gray-600">
                        <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                          <AppLogo width={20} height={20} />
                        </div>

                        {link.originalUrl}
                      </div>
                      <ExternalLink
                        size={16}
                        className="text-gray-400 group-hover:scale-110"
                      />
                    </Card>
                  </Link>
                </ListItem>
              );
            })}
          </List>

          {/* Footer */}
          <section className="absolute bottom-10 flex flex-col items-center space-y-2 pt-4 text-center text-sm text-gray-500">
            <p>
              Powered by{" "}
              <Link href={publicUrl} className="font-semibold text-primary">
                Snippr
              </Link>
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 border-gray-300 bg-transparent"
            >
              Create your own Link Hub
            </Button>
          </section>
        </article>
      </div>
    </div>
  );
}
