"use client";

import Link from "next/link";
import {
  BarChart2,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  QrCode,
  Trash,
} from "lucide-react";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { buildShortUrl } from "@/lib/helpers";
import type { ShortLinkFromRepository } from "@/lib/types";
import { cn, formatDate, formatNumber } from "@/lib/utils";
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

import { LinkPreview } from "../ui/link-preview";
import { CopyOptionsMenu } from "./copy-options-menu";

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
            <TableHead className="w-[180px] pe-0 ps-4">Short Code</TableHead>
            <TableHead>Original URL</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="text-center">Clicks</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-6"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.length > 0 ? (
            links.map((link) => {
              const isExpired =
                !!link.expiresAt && new Date() >= link.expiresAt;
              return (
                <TableRow
                  key={link.id}
                  className={isExpired ? "opacity-60" : ""}
                >
                  <TableCell className="pe-1 ps-4 font-medium">
                    <div className="flex items-center justify-start gap-2">
                      <Link
                        href={buildShortUrl(
                          link.shortCode,
                          link.customDomain?.domain,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "truncate whitespace-nowrap text-primary hover:underline",
                          isExpired
                            ? "cursor-not-allowed text-destructive"
                            : "",
                        )}
                        title={buildShortUrl(
                          link.shortCode,
                          link.customDomain?.domain,
                        )}
                        aria-disabled={isExpired}
                        onClick={(e) => isExpired && e.preventDefault()}
                      >
                        {link.shortCode}
                      </Link>
                      <CopyOptionsMenu {...{ link, isExpired }} />
                    </div>
                  </TableCell>

                  <TableCell className="max-w-[200px] lg:max-w-[300px]">
                    <div
                      data-tooltip-id="table-url-tooltip"
                      data-tooltip-content={link.originalUrl}
                      className="flex w-fit items-center gap-2"
                    >
                      <LinkPreview
                        url={link.originalUrl}
                        className={cn(
                          "min-w-0 truncate hover:underline",
                          isExpired ? "text-muted-foreground" : "",
                        )}
                      >
                        {link.originalUrl}
                      </LinkPreview>
                      <a
                        href={link.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open original URL"
                      >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground hover:text-foreground" />
                      </a>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {formatDate(link.createdAt)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {link.expiresAt ? formatDate(link.expiresAt) : "Never"}
                    {isExpired && (
                      <Badge variant="destructive" className="ms-2">
                        Expired
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatNumber(link.clicks)}
                  </TableCell>
                  <TableCell>
                    <div className="flex max-w-[240px] flex-wrap gap-1">
                      {link.tags.length > 0 ? (
                        link.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-nowrap"
                          >
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs italic text-muted-foreground">
                          No tags
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
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
                          onClick={() => onQrCode(link)}
                          disabled={isExpired}
                        >
                          <QrCode className="mr-2 h-4 w-4" /> QR Code
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/analytics/${link.id}`}>
                            <BarChart2 className="mr-2 h-4 w-4" /> Analytics
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(link)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(link)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No links found.
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
        className="z-50 max-w-md !whitespace-normal !break-words lg:max-w-xl"
      />
    </section>
  );
}
