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
import type { ShortLinkFromRepository } from "@/lib/types";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import {
  BarChart2,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  QrCode,
  Trash,
} from "lucide-react";
import Link from "next/link";

interface LinkTableProps {
  links: ShortLinkFromRepository[];
  onCopy: (shortCode: string) => void;
  onEdit: (link: ShortLinkFromRepository) => void;
  onDelete: (link: ShortLinkFromRepository) => void;
  onQrCode: (link: ShortLinkFromRepository) => void;
}

export function LinkTable({
  links,
  onCopy,
  onEdit,
  onDelete,
  onQrCode,
  className,
  ...props
}: LinkTableProps & Omit<React.ComponentPropsWithoutRef<"div">, "onCopy">) {
  return (
    <section className={cn("rounded-md border", className)} {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="flex items-center ms-2">Short URL</TableHead>
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
                    onClick={() => onCopy(link.shortCode)}
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
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {link.tags.length === 0 && (
                    <span className="text-muted-foreground text-sm">None</span>
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
                    <DropdownMenuItem onClick={() => onCopy(link.shortCode)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onQrCode(link)}>
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
                    <DropdownMenuItem onClick={() => onEdit(link)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(link)}
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
    </section>
  );
}
