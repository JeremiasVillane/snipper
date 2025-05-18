"use client";

import { useState } from "react";
import Link from "next/link";
import { publicUrl } from "@/env.mjs";
import { Copy, Globe, MoreHorizontal, Pencil, Trash } from "lucide-react";

import { buildCustomDomainUrl } from "@/lib/helpers";
import {
  CustomDomainFromRepository,
  ShortLinkFromRepository,
} from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyToClipboardButton } from "@/components/ui/copy-to-clipboard-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/simple-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CustomDomainDialog } from "./custom-domain-dialog";
import { DeleteCustomDomainDialog } from "./delete-custom-domain-dialog";

// import DeleteCustomDomainDialog from "./delete-custom-domain-dialog";

const currentHost = new URL(publicUrl).host;

interface CustomDomainTableProps {
  customDomains: CustomDomainFromRepository[];
  userShortLinks: ShortLinkFromRepository[];
}

export function CustomDomainTable({
  customDomains,
  userShortLinks,
}: CustomDomainTableProps) {
  const [editingCustomDomain, setEditingCustomDomain] =
    useState<CustomDomainFromRepository | null>(null);
  const [deletingCustomDomain, setDeletingCustomDomain] =
    useState<CustomDomainFromRepository | null>(null);

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied!",
      description: "Custom domain copied to clipboard",
    });
  };

  if (customDomains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-3">
          <Globe className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">No custom domains yet</h3>
        <p className="mb-4 mt-1 text-muted-foreground">
          Create your first subdomain to get started
        </p>
        <CustomDomainDialog {...{ userShortLinks }}>
          <Button className="flex md:hidden">Create Subdomain</Button>
        </CustomDomainDialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ms-2 flex items-center">
                Subdomain
              </TableHead>
              <TableHead className="whitespace-nowrap">
                Link Hub Enabled
              </TableHead>
              <TableHead className="whitespace-nowrap">
                Link Hub Title
              </TableHead>
              <TableHead className="whitespace-nowrap">
                Link Hub Description
              </TableHead>
              <TableHead>Links</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customDomains.map((customDomain) => {
              const linkHubUrl = `${customDomain.domain}.${currentHost}`;
              const fullLinkHubUrl = buildCustomDomainUrl(customDomain.domain);

              return (
                <TableRow key={customDomain.id}>
                  <TableCell className="max-w-[120px] font-medium">
                    <div className="ms-2 flex items-center gap-0.5">
                      <Link
                        href={fullLinkHubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-[220px] truncate text-primary underline-offset-2 hover:underline"
                      >
                        {linkHubUrl}
                      </Link>
                      <CopyToClipboardButton content={fullLinkHubUrl} />
                    </div>
                  </TableCell>
                  <TableCell className="w-36">
                    {customDomain.isLinkHubEnabled ? (
                      <Badge>Enabled</Badge>
                    ) : (
                      <Badge variant="outline">Disabled</Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {customDomain.linkHubTitle ?? "No Title"}
                  </TableCell>
                  <TableCell className="max-w-[240px] truncate">
                    {customDomain.linkHubDescription ?? "No Description"}
                  </TableCell>
                  <TableCell>{customDomain.shortLinks.length}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="select-none">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => copyToClipboard(fullLinkHubUrl)}
                          className="group"
                        >
                          <Copy className="mr-2 size-4 group-hover:scale-105" />
                          Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setEditingCustomDomain(customDomain)}
                          className="group"
                        >
                          <Pencil className="mr-2 size-4 group-hover:scale-105" />{" "}
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingCustomDomain(customDomain)}
                          className="group text-destructive focus:text-white"
                        >
                          <Trash className="mr-2 size-4 group-hover:scale-105" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>

      {editingCustomDomain && (
        <CustomDomainDialog
          initialData={editingCustomDomain}
          open={!!editingCustomDomain}
          onOpenChange={() => setEditingCustomDomain(null)}
          userShortLinks={userShortLinks}
        />
      )}

      {deletingCustomDomain && (
        <DeleteCustomDomainDialog
          customDomain={deletingCustomDomain}
          open={!!deletingCustomDomain}
          onOpenChange={() => setDeletingCustomDomain(null)}
        />
      )}
    </div>
  );
}
