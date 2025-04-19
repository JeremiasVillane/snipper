"use client";

import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { deleteShortLink } from "@/lib/actions/short-links";
import type { ShortLinkFromRepository } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "../ui/simple-toast";

interface DeleteLinkDialogProps {
  link: ShortLinkFromRepository;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteLinkDialog({
  link,
  open,
  onOpenChange,
}: DeleteLinkDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await deleteShortLink(link.id);

      toast({
        title: "Success!",
        description: "Your link has been deleted",
      });

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete link",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Delete Link</CredenzaTitle>
          <CredenzaDescription>
            Are you sure you want to delete this link? This action cannot be
            undone.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="py-4">
          <p className="text-sm font-medium">Short URL: {link.shortCode}</p>
          <p className="text-sm text-muted-foreground mt-1 truncate">
            Original URL: {link.originalUrl}
          </p>
        </CredenzaBody>
        <CredenzaFooter>
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
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
