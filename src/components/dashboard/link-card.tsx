"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyToClipboardButton } from "@/components/ui/copy-to-clipboard-button";
import { buildShortUrl } from "@/lib/helpers";
import { ShortLinkFromRepository } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, LineChart, Pencil, QrCode, Trash2 } from "lucide-react";
import Link from "next/link";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { BubbleMenu } from "../ui/bubble-menu";

interface LinkCardProps {
  link: ShortLinkFromRepository;
  onEdit: (link: ShortLinkFromRepository) => void;
  onDelete: (link: ShortLinkFromRepository) => void;
  onQrCode: (link: ShortLinkFromRepository) => void;
}

export function LinkCard({ link, onEdit, onDelete, onQrCode }: LinkCardProps) {
  return (
    <Card className="relative h-full flex flex-col">
      <CardHeader className="pb-2 overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{link.shortCode}</CardTitle>
            <CardDescription
              data-tooltip-id="card-url-tooltip"
              data-tooltip-content={link.originalUrl}
              className="truncate max-w-[200px] md:max-w-[250px] cursor-default"
            >
              {link.originalUrl}
            </CardDescription>
          </div>
          <div>
            <Badge variant="outline" className="whitespace-nowrap">
              {link.clicks} clicks
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-2 flex-grow">
        <div className="mb-2">
          <p className="text-sm text-muted-foreground">
            Created{" "}
            {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
          </p>
          {link.expiresAt && (
            <p className="text-sm text-muted-foreground">
              Expires{" "}
              {formatDistanceToNow(new Date(link.expiresAt), {
                addSuffix: true,
              })}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mt-2 mr-4">
          {link.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}

          {link.password && (
            <Badge variant="outline" className="text-xs">
              Password Protected
            </Badge>
          )}
        </div>
      </CardContent>

      <BubbleMenu className="mt-1 mb-2 mr-auto xl:mr-2 ml-auto">
        <CopyToClipboardButton
          content={buildShortUrl(link.shortCode)}
          className="text-foreground [&_svg]:left-3.5 size-full p-3"
        />
        <QrCode
          role="button"
          onClick={() => onQrCode(link)}
          className="size-full p-3"
          aria-label="View QR Code"
        />
        <Link
          href={`/dashboard/analytics/${link.id}`}
          aria-label="View Link Analytics"
        >
          <LineChart className="size-full p-3" />
        </Link>
        <Link
          href={buildShortUrl(link.shortCode)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Short Link"
        >
          <ExternalLink className="size-full p-3" />
        </Link>
        <Pencil
          role="button"
          onClick={() => onEdit(link)}
          className="size-full p-3"
          aria-label="Update Short Link"
        />
        <Trash2
          role="button"
          onClick={() => onDelete(link)}
          className="text-destructive size-full p-3"
          aria-label="Delete Short Link"
        />
      </BubbleMenu>

      <ReactTooltip
        id="card-url-tooltip"
        className="max-w-sm md:max-w-md lg:max-w-xl whitespace-normal break-words"
      />
    </Card>
  );
}
