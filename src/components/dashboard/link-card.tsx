"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyToClipboardButton } from "@/components/ui/copy-to-clipboard-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { buildShortUrl } from "@/lib/helpers";
import { ShortLinkFromRepository } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  ExternalLink,
  LineChart,
  Pencil,
  Plus,
  QrCode,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface LinkCardProps {
  link: ShortLinkFromRepository;
  onEdit: (link: ShortLinkFromRepository) => void;
  onDelete: (link: ShortLinkFromRepository) => void;
  onQrCode: (link: ShortLinkFromRepository) => void;
}

export function LinkCard({ link, onEdit, onDelete, onQrCode }: LinkCardProps) {
  return (
    <Card className="relative h-full flex flex-col">
      <CardHeader className="pb-2">
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

      <Popover>
        <PopoverTrigger
          className={cn(
            buttonVariants({ size: "icon" }),
            "bg-muted text-muted-foreground hover:bg-accent/50 hover:text-white",
            "absolute bottom-2 right-2 rounded-full size-7 shadow shadow-foreground/15",
            "group"
          )}
        >
          <Plus className="size-4 group-data-[state=open]:-rotate-45 translate-x-3 transition-transform duration-200 ease-in-out" />
          <X className="size-4 scale-0 group-data-[state=open]:scale-100 -translate-x-3 transition-transform duration-200 ease-in-out" />
          <span className="sr-only">Toggle menu</span>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          className="grid grid-cols-2 gap-2 justify-center w-fit p-2"
        >
          <CopyToClipboardButton
            content={buildShortUrl(link.shortCode)}
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "w-24 text-foreground [&_svg]:left-5"
            )}
          >
            Copy
          </CopyToClipboardButton>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onQrCode(link)}
            iconLeft={<QrCode className="-ms-5" />}
            className="w-24"
          >
            QR
          </Button>

          <Link
            href={`/dashboard/analytics/${link.id}`}
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "w-24"
            )}
          >
            <LineChart className="h-4 w-4" /> Stats
          </Link>

          <Link
            href={buildShortUrl(link.shortCode)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="sm"
              variant="outline"
              iconLeft={<ExternalLink className="-ms-2.5" />}
              className="w-24"
            >
              Visit
            </Button>
          </Link>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(link)}
            iconLeft={<Pencil className="-ms-2" />}
            className="w-24"
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(link)}
            iconLeft={<Trash2 className="-mr-0.5" />}
            className="text-destructive w-24"
          >
            Delete
          </Button>
        </PopoverContent>
      </Popover>

      <ReactTooltip
        id="card-url-tooltip"
        className="max-w-sm md:max-w-md lg:max-w-xl whitespace-normal break-words"
      />
    </Card>
  );
}
