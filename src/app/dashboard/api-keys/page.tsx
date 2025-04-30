import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { apiKeysRepository } from "@/lib/db/repositories";
import { ApiKeyTable } from "@/components/dashboard/api-keys";
import CreateApiKeyDialog from "@/components/dashboard/api-keys/create-api-key-dialog";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage API Keys - Snipper",
  description:
    "Create, view, and manage your API keys for programmatic access to the Snipper service.",
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
    <main className="flex-1 min-h-screen container py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3 md:gap-0">
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
              "hidden md:flex h-9 md:h-10",
              apiKeys.length > 0 ? "flex" : ""
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
