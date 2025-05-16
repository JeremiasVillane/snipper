import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { auth } from "@/lib/auth";
import { appName } from "@/lib/constants";
import { apiKeysRepository } from "@/lib/db/repositories";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ApiKeyTable } from "@/components/dashboard/api-keys";
import CreateApiKeyDialog from "@/components/dashboard/api-keys/create-api-key-dialog";

export const metadata: Metadata = {
  title: `Manage API Keys - ${appName}`,
  description: `Create, view, and manage your API keys for programmatic access to the ${appName} service.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ApiKeysPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const apiKeys = await apiKeysRepository.findByUserId(session.user.id);

  return (
    <main className="container min-h-screen flex-1 py-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center md:gap-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your API keys for programmatic access
          </p>
        </div>
        <CreateApiKeyDialog>
          <Button
            iconLeft={<Plus className="size-4" />}
            iconAnimation="zoomIn"
            className={cn(
              "hidden h-9 md:flex md:h-10",
              apiKeys.length > 0 ? "flex" : "",
            )}
          >
            Create API Key
          </Button>
        </CreateApiKeyDialog>
      </div>

      <ApiKeyTable apiKeys={apiKeys} />
    </main>
  );
}
