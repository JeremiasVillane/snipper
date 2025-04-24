"use client";

import {
  Button,
  LeftInsetButton,
  RightInsetButton,
} from "@/components/ui/button";
import { ShortLinkFromRepository } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CircleXIcon,
  Filter,
  LayoutGridIcon,
  Link2,
  Search,
  TableIcon,
  X,
} from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useMemo, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import DeleteLinkDialog from "./delete-link-dialog";
import { LinkDialog } from "./link-dialog";
import { LinkGrid } from "./link-grid";
import { LinkTable } from "./link-table";
import { LinkTagFilter } from "./link-tag-filter";
import QrCodeDialog from "./qr-code-dialog";

interface LinkListProps {
  links: ShortLinkFromRepository[];
}

export function LinkList({ links }: LinkListProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [selectedTags, setSelectedTags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([])
  );

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

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    links.forEach((link) => {
      if (link.tags) {
        link.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [links]);

  const filteredLinks = useMemo(() => {
    let result = links;

    const query = searchQuery.trim().toLowerCase();
    if (query.length > 0) {
      result = result.filter(
        (link) =>
          link.shortCode.toLowerCase().includes(query) ||
          link.originalUrl.toLowerCase().includes(query)
      );
    }
    const currentSelectedTags = Array.isArray(selectedTags) ? selectedTags : [];
    if (currentSelectedTags.length > 0) {
      result = result.filter((link) =>
        currentSelectedTags.some((tag) => link.tags?.includes(tag))
      );
    }

    return result;
  }, [searchQuery, selectedTags, links]);

  const handleClearInput = () => {
    setSearchQuery(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
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
        <LinkDialog>
          <Button className="flex md:hidden">Create Link</Button>
        </LinkDialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex items-center gap-4">
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

        <Input
          ref={inputRef}
          placeholder="Search by URL or short code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startIcon={<Search className="size-4 text-muted-foreground mr-0.5" />}
          endIcon={
            searchQuery ? (
              <CircleXIcon
                size={16}
                role="button"
                aria-label="Clear input"
                onClick={handleClearInput}
                className="transition-colors hover:text-foreground"
              />
            ) : undefined
          }
        />
        <LinkTagFilter {...{ selectedTags, setSelectedTags, availableTags }} />
      </section>

      {(searchQuery || selectedTags.length > 0) && (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filteredLinks.length} results found
            </span>
          </div>

          {selectedTags.length > 0 && (
            <div className="flex items-start md:items-center gap-2 ml-2">
              <span className="text-sm text-muted-foreground">Tags:</span>
              <div className="flex flex-wrap gap-1">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <LinkTable
        links={filteredLinks}
        onEdit={setEditingLink}
        onDelete={setDeletingLink}
        onQrCode={setShowingQrCode}
        className={cn(
          "hidden",
          displayView === "table" ? "md:flex" : "md:hidden"
        )}
      />

      <LinkGrid
        links={filteredLinks}
        onEdit={setEditingLink}
        onDelete={setDeletingLink}
        onQrCode={setShowingQrCode}
        className={cn(
          "grid grid-cols-1 gap-6",
          displayView === "grid"
            ? "md:grid md:grid-cols-2 lg:grid-cols-3"
            : "md:hidden"
        )}
      />

      {editingLink && (
        <LinkDialog
          initialData={editingLink}
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
