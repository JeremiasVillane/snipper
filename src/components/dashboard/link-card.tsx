"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShortLinkFromRepository } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  Copy,
  ExternalLink,
  LineChart,
  Pencil,
  QrCode,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface LinkCardProps {
  link: ShortLinkFromRepository;
  onCopy: (shortCode: string) => void;
  onEdit: (link: ShortLinkFromRepository) => void;
  onDelete: (link: ShortLinkFromRepository) => void;
  onQrCode: (link: ShortLinkFromRepository) => void;
}

export function LinkCard({
  link,
  onCopy,
  onEdit,
  onDelete,
  onQrCode,
}: LinkCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{link.shortCode}</CardTitle>
            <CardDescription className="truncate max-w-[250px]">
              {link.originalUrl}
            </CardDescription>
          </div>
          <div>
            <Badge variant="outline">{link.clicks} clicks</Badge>
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

        <div className="flex flex-wrap gap-1 mt-2">
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

      <CardFooter className="pt-2 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onCopy(link.shortCode)}
          iconLeft={<Copy />}
          className="w-24"
        >
          Copy
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onQrCode(link)}
          iconLeft={<QrCode />}
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
          href={`${process.env.NEXT_PUBLIC_APP_URL}/${link.shortCode}`}
          className={cn(
            buttonVariants({ size: "sm", variant: "outline" }),
            "w-24"
          )}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Visit
        </Link>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(link)}
          iconLeft={<Pencil />}
          className="w-24"
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(link)}
          iconLeft={<Trash2 />}
          className="text-destructive w-24"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
