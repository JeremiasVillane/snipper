"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, LineChart, Pencil, QrCode, Trash2 } from "lucide-react";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { buildShortUrl } from "@/lib/helpers";
import { ShortLinkFromRepository } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { BubbleMenu } from "../ui/bubble-menu";
import { CopyOptionsMenu } from "./copy-options-menu";

interface LinkCardProps {
  link: ShortLinkFromRepository;
  onEdit: (link: ShortLinkFromRepository) => void;
  onDelete: (link: ShortLinkFromRepository) => void;
  onQrCode: (link: ShortLinkFromRepository) => void;
}

export function LinkCard({ link, onEdit, onDelete, onQrCode }: LinkCardProps) {
  const isExpired = !!link.expiresAt && new Date() >= link.expiresAt;

  return (
    <Card className="relative flex h-full flex-col">
      <CardHeader className="overflow-hidden pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{link.shortCode}</CardTitle>
            <CardDescription
              data-tooltip-id="card-url-tooltip"
              data-tooltip-content={link.originalUrl}
              className="max-w-[200px] cursor-default truncate md:max-w-[250px]"
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

      <CardContent className="flex-grow py-2">
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

        <div className="mr-4 mt-2 flex flex-wrap gap-1">
          {link.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}

          {link.isPasswordEnabled && (
            <Badge variant="outline" className="text-xs">
              Password Protected
            </Badge>
          )}

          {link.utmParams.length > 0 && (
            <Badge variant="outline" className="text-xs">
              UTM Params
            </Badge>
          )}
        </div>
      </CardContent>

      <BubbleMenu className="mb-2 ml-auto mr-auto mt-1 xl:mr-2">
        <CopyOptionsMenu {...{ link, isExpired }} />
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
          className="size-full p-3 text-destructive"
          aria-label="Delete Short Link"
        />
      </BubbleMenu>

      <ReactTooltip
        id="card-url-tooltip"
        className="max-w-sm whitespace-normal break-words md:max-w-md lg:max-w-xl"
      />
    </Card>
  );
}
