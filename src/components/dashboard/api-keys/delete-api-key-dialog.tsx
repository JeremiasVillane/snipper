"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/simple-toast";
import { deleteApiKey } from "@/lib/actions/api-keys";
import { getSafeActionResponse } from "@/lib/actions/safe-action-helpers";
import { formatDate } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed: Date | null;
  expiresAt: Date | null;
}

interface DeleteApiKeyDialogProps {
  apiKey: ApiKey;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteApiKeyDialog({
  apiKey,
  open,
  onOpenChange,
}: DeleteApiKeyDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      const result = await deleteApiKey({ id: apiKey.id }).then((res) =>
        getSafeActionResponse(res)
      );

      toast({
        title: result.success ? "Success!" : "Error",
        description: result.success ? result.data.message : result.error,
        type: result.success ? "success" : "error",
      });

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete API key",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete API Key</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this API key? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm font-medium">Name: {apiKey.name}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Created: {formatDate(apiKey.createdAt)}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
