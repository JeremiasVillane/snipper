"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { deleteCustomDomain } from "@/lib/actions/custom-domains";
import { getSafeActionResponse } from "@/lib/actions/safe-action-helpers";
import { CustomDomainFromRepository } from "@/lib/types";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { List, ListItem } from "@/components/ui/list";
import { toast } from "@/components/ui/simple-toast";

interface DeleteCustomDomainDialogProps {
  customDomain: CustomDomainFromRepository;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCustomDomainDialog({
  customDomain,
  open,
  onOpenChange,
}: DeleteCustomDomainDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      const { data, success, error } = await deleteCustomDomain({
        domainId: customDomain.id,
      }).then((res) => getSafeActionResponse(res));

      toast({
        title: success ? "Success!" : "Error",
        description: success ? data.message : error,
        type: success ? "success" : "error",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete custom domain",
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
          <DialogTitle>Delete Custom Domain</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this subdomain? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <div>
          <p className="text-sm font-medium">
            Subdomain: <strong>{customDomain.domain}</strong>
          </p>

          {customDomain.shortLinks.length > 0 && (
            <p className="mt-1 text-sm">
              Links ({customDomain.shortLinks.length}):
            </p>
          )}

          {customDomain.shortLinks.length === 0 && (
            <p className="mt-1 text-sm italic text-muted-foreground">
              No Links
            </p>
          )}

          {customDomain.shortLinks.length > 0 && (
            <>
              <List variant="dash">
                {customDomain.shortLinks.map((lnk) => (
                  <ListItem
                    key={lnk.id}
                    className="text-sm text-muted-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-bold">
                        /{lnk.shortCode}:
                      </span>
                      {lnk.originalUrl}
                    </span>
                  </ListItem>
                ))}
              </List>

              <Alert styleVariant="bootstrap" withIcon className="mt-6">
                <AlertTitle>
                  This wil <strong>NOT</strong> delete the associated links.
                </AlertTitle>
              </Alert>
            </>
          )}
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
