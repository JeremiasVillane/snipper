"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ShortLink } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/utils";
import {
  BarChart2,
  Copy,
  ExternalLink,
  Link2,
  MoreHorizontal,
  Pencil,
  QrCode,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "../ui/simple-toast";
import DeleteLinkDialog from "./delete-link-dialog";
import EditLinkDialog from "./edit-link-dialog";
import QrCodeDialog from "./qr-code-dialog";

interface LinkTableProps {
  links: ShortLink[];
}

export function LinkTable({ links }: LinkTableProps) {
  const [editingLink, setEditingLink] = useState<ShortLink | null>(null);
  const [deletingLink, setDeletingLink] = useState<ShortLink | null>(null);
  const [showingQrCode, setShowingQrCode] = useState<ShortLink | null>(null);

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
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="flex items-center ms-2">
                Short URL
              </TableHead>
              <TableHead>Original URL</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2 ms-2">
                    <Link
                      href={`/${link.shortCode}`}
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      {link.shortCode}
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(link.shortCode)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  <Link
                    href={link.originalUrl}
                    target="_blank"
                    className="flex items-center gap-1 hover:underline"
                  >
                    {link.originalUrl}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </TableCell>
                <TableCell>{formatDate(link.createdAt)}</TableCell>
                <TableCell>
                  {link.expiresAt ? formatDate(link.expiresAt) : "Never"}
                </TableCell>
                <TableCell>{formatNumber(link.clicks)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {link.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                    {link.tags.length === 0 && (
                      <span className="text-muted-foreground text-sm">
                        None
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => copyToClipboard(link.shortCode)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowingQrCode(link)}>
                        <QrCode className="mr-2 h-4 w-4" />
                        QR Code
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/analytics/${link.id}`}>
                          <BarChart2 className="mr-2 h-4 w-4" />
                          Analytics
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setEditingLink(link)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingLink(link)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
    </>
  );
}
