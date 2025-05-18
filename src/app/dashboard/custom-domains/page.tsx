import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { auth } from "@/lib/auth";
import { appName } from "@/lib/constants";
import {
  customDomainsRepository,
  shortLinksRepository,
} from "@/lib/db/repositories";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CustomDomainDialog,
  CustomDomainTable,
} from "@/components/dashboard/custom-domains";

export const metadata: Metadata = {
  title: `Manage Custom Domains - ${appName}`,
  description: `Create, view, and manage your subdomains for link sharing through the ${appName} service.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CustomDomainsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const customDomains = await customDomainsRepository.findByUserId(
    session.user.id,
  );
  const userShortLinks = await shortLinksRepository.findByUserId(
    session.user.id,
  );
  const nonExpiredLinks = userShortLinks.filter(
    (link) =>
      (!!link.expiresAt && new Date() >= link.expiresAt) || !link.expiresAt,
  );

  return (
    <main className="container min-h-screen flex-1 py-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center md:gap-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Custom Domains</h1>
          <p className="text-muted-foreground">
            Manage your subdomains for link sharing
          </p>
        </div>
        <CustomDomainDialog userShortLinks={nonExpiredLinks}>
          <Button
            iconLeft={<Plus className="size-4" />}
            iconAnimation="zoomIn"
            className={cn(
              "hidden h-9 md:flex md:h-10",
              customDomains.length > 0 ? "flex" : "",
            )}
          >
            Create Subdomain
          </Button>
        </CustomDomainDialog>
      </div>

      <CustomDomainTable
        customDomains={customDomains}
        userShortLinks={nonExpiredLinks}
      />
    </main>
  );
}
