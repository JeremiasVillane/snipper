import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { apiKeysRepository } from "@/lib/db/repositories";
import { ApiKeyTable } from "@/components/dashboard/api-keys";
import CreateApiKeyDialog from "@/components/dashboard/api-keys/create-api-key-dialog";

export default async function ApiKeysPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const apiKeys = await apiKeysRepository.findByUserId(session.user.id);

  return (
    <main className="flex-1 min-h-screen container py-6">
      <div className="flex items-center justify-between mb-6">
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
            className="hidden md:flex"
          >
            Create API Key
          </Button>
        </CreateApiKeyDialog>
      </div>

      <div className="space-y-6">
        <ApiKeyTable apiKeys={apiKeys} />
      </div>
    </main>
  );
}
