"use client";

import { ShortLinkFromRepository } from "@/lib/types";
import { useState } from "react";
import { toast } from "@/components/ui/simple-toast";
import { LayoutGridIcon, Link2, TableIcon } from "lucide-react";
import EditLinkDialog from "./edit-link-dialog";
import {
  Button,
  LeftInsetButton,
  RightInsetButton,
} from "@/components/ui/button";
import DeleteLinkDialog from "./delete-link-dialog";
import QrCodeDialog from "./qr-code-dialog";
import { LinkTable } from "./link-table";
import { LinkCard } from "./link-card";
import { cn } from "@/lib/utils";
import { parseAsString, useQueryState } from "nuqs";

interface LinkListProps {
  links: ShortLinkFromRepository[];
}

export function LinkList({ links }: LinkListProps) {
  const [displayView, setDisplayView] = useQueryState(
    "display",
    parseAsString.withDefault("table")
  );

  const [editingLink, setEditingLink] =
    useState<ShortLinkFromRepository | null>(null);
  const [deletingLink, setDeletingLink] =
    useState<ShortLinkFromRepository | null>(null);
  const [showingQrCode, setShowingQrCode] =
    useState<ShortLinkFromRepository | null>(null);

  const copyToClipboard = (shortCode: string) => {
    const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    toast({
      title: "Copied!",
      description: "Short URL copied to clipboard",
    });
  };

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-primary/10 p-3 mb-4">
          <Link2 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">No links yet</h3>
        <p className="text-muted-foreground mt-1 mb-4">
          Create your first shortened link to get started
        </p>
        <EditLinkDialog>
          <Button className="flex md:hidden">Create Link</Button>
        </EditLinkDialog>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <Button size="sm" variant="outline" className="hidden md:flex w-fit">
        <LeftInsetButton
          onClick={() => setDisplayView("table")}
          className={
            displayView !== "table"
              ? "bg-transparent"
              : "bg-primary text-background"
          }
        >
          <TableIcon />
        </LeftInsetButton>
        <RightInsetButton
          onClick={() => setDisplayView("grid")}
          className={
            displayView !== "grid"
              ? "bg-transparent"
              : "bg-primary text-background"
          }
        >
          <LayoutGridIcon />
        </RightInsetButton>
      </Button>

      <LinkTable
        links={links}
        onCopy={copyToClipboard}
        onEdit={setEditingLink}
        onDelete={setDeletingLink}
        onQrCode={setShowingQrCode}
        className={cn(
          "hidden",
          displayView === "table" ? "md:flex" : "md:hidden"
        )}
      />

      <section
        className={cn(
          "grid grid-cols-1 gap-6",
          displayView === "grid"
            ? "md:grid md:grid-cols-2 lg:grid-cols-3"
            : "md:hidden"
        )}
      >
        {links.map((link) => (
          <LinkCard
            key={link.id}
            link={link}
            onCopy={copyToClipboard}
            onEdit={setEditingLink}
            onDelete={setDeletingLink}
            onQrCode={setShowingQrCode}
          />
        ))}
      </section>

      {editingLink && (
        <EditLinkDialog
          link={editingLink}
          open={!!editingLink}
          onOpenChange={() => setEditingLink(null)}
        />
      )}

      {deletingLink && (
        <DeleteLinkDialog
          link={deletingLink}
          open={!!deletingLink}
          onOpenChange={() => setDeletingLink(null)}
        />
      )}

      {showingQrCode && (
        <QrCodeDialog
          link={showingQrCode}
          open={!!showingQrCode}
          onOpenChange={() => setShowingQrCode(null)}
        />
      )}
    </div>
  );
}
