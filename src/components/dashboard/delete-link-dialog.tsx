"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { getSafeActionResponse } from "@/lib/actions/safe-action-helpers";
import { deleteShortLink } from "@/lib/actions/short-links";
import { deleteQrPreferences } from "@/lib/qr-preferences-db";
import type { ShortLinkFromRepository } from "@/lib/types";
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

      const { data, success, error } = await deleteShortLink({
        id: link.id,
      }).then((res) => getSafeActionResponse(res));

      if (success) {
        await deleteQrPreferences(link.shortCode).catch((err) =>
          console.warn(
            `Preferences for QR code ${link.shortCode} could not be deleted:`,
            err,
          ),
        );
      }

      toast({
        title: success ? "Success!" : "Error",
        description: success ? data.message : error,
        type: success ? "success" : "error",
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
    <Modal
      mode="alertdialog"
      open={open}
      onOpenChange={onOpenChange}
      separatedFooter
    >
      <ModalContent>
        <ModalTitle>Delete Link</ModalTitle>
        <ModalDescription>
          Are you sure you want to delete this link? This action cannot be
          undone.
        </ModalDescription>

        <ModalBody className="overflow-x-hidden py-4">
          <p className="text-sm font-medium">Short URL: {link.shortCode}</p>
          <p
            data-tooltip-id="url-tooltip"
            data-tooltip-content={link.originalUrl}
            className="mt-1 cursor-default truncate text-sm text-muted-foreground"
          >
            Original URL: {link.originalUrl}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </ModalFooter>
        <ReactTooltip
          id="url-tooltip"
          offset={15}
          className="max-w-sm whitespace-normal break-words md:max-w-md lg:max-w-xl"
        />
      </ModalContent>
    </Modal>
  );
}
