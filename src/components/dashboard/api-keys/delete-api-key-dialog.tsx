"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { deleteApiKey } from "@/lib/actions/api-keys";
import { getSafeActionResponse } from "@/lib/actions/safe-action-helpers";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
} from "@/components/ui/modal";
import { toast } from "@/components/ui/simple-toast";

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
        getSafeActionResponse(res),
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
    <Modal
      mode="alertdialog"
      open={open}
      onOpenChange={onOpenChange}
      separatedFooter
    >
      <ModalContent>
        <ModalTitle>Delete API Key</ModalTitle>
        <ModalDescription>
          Are you sure you want to delete this API key? This action cannot be
          undone.
        </ModalDescription>

        <ModalBody>
          <p className="text-sm font-medium">Name: {apiKey.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Created: {formatDate(apiKey.createdAt)}
          </p>
        </ModalBody>
        <ModalFooter>
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
