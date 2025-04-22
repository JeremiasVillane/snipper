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
import { buildShortUrl } from "@/lib/helpers";
import type { ShortLinkFromRepository } from "@/lib/types";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import {
  BarChart2,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  QrCode,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { CopyToClipboardButton } from "../ui/copy-to-clipboard-button";
import { LinkPreview } from "../ui/link-preview";

interface LinkTableProps {
  links: ShortLinkFromRepository[];
  onEdit: (link: ShortLinkFromRepository) => void;
  onDelete: (link: ShortLinkFromRepository) => void;
  onQrCode: (link: ShortLinkFromRepository) => void;
}

export function LinkTable({
  links,
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
          {links.length > 0 ? (
            links.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-0.5 ms-2">
                    <Link
                      href={`/${link.shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline whitespace-nowrap"
                    >
                      {link.shortCode}
                    </Link>
                    <CopyToClipboardButton
                      content={buildShortUrl(link.shortCode)}
                    />
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <div
                    data-tooltip-id="table-url-tooltip"
                    data-tooltip-content={link.originalUrl}
                    className="flex items-center gap-2"
                  >
                    <LinkPreview
                      url={link.originalUrl}
                      className="hover:underline truncate min-w-0"
                    >
                      {link.originalUrl}
                    </LinkPreview>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </div>
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
                      <DropdownMenuItem asChild>
                        <CopyToClipboardButton
                          content={buildShortUrl(link.shortCode)}
                          className="[&_svg]:size-4 [&_svg]:left-2.5 text-sm gap-3 h-8 py-2 px-2.5 text-foreground hover:text-background"
                        >
                          Copy URL
                        </CopyToClipboardButton>
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ReactTooltip
        id="table-url-tooltip"
        place="bottom"
        offset={15}
        float
        className="max-w-md lg:max-w-xl whitespace-normal break-words"
      />
    </section>
  );
}
