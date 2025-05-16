import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publicUrl } from "@/env.mjs";

import { customDomainsRepository } from "@/lib/db/repositories";
import { buildShortUrl } from "@/lib/helpers";
import { List, ListItem } from "@/components/ui/list";

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
  const customDomain = await customDomainsRepository.findByDomain(subdomain);

  if (!customDomain) return notFound();

  const shortLinks = await customDomainsRepository.getShortLinksByDomain(
    customDomain.domain,
    customDomain.userId,
  );

  if (!shortLinks || shortLinks.length === 0) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background p-4">
      <div className="flex items-start justify-center pt-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-muted-foreground">
            Welcome to {subdomain} links:
          </h1>

          <List
            variant="triangle"
            className="rounded-md border border-dashed border-muted p-4 [&>li]:before:mt-0.5 [&>li]:before:text-4xl"
          >
            {shortLinks.map((link) => (
              <ListItem key={link.id}>
                <Link
                  href={buildShortUrl(link.shortCode, customDomain.domain)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-muted-foreground underline-offset-4 transition-all hover:text-foreground hover:underline"
                >
                  {new URL(link.originalUrl).hostname}
                </Link>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </div>
  );
}
