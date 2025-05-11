import { Copy, Share2 } from "lucide-react";

import { buildShortUrl, buildUrlWithUtm } from "@/lib/helpers";
import { ShortLinkFromRepository } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";
import { CopyToClipboardButton } from "../ui/copy-to-clipboard-button";

interface CopyOptionsMenuProps {
  link: ShortLinkFromRepository;
  isExpired: boolean;
  className?: string;
}

export function CopyOptionsMenu({
  link,
  isExpired,
  className,
}: CopyOptionsMenuProps) {
  const baseShortUrl = buildShortUrl(link.shortCode);
  const hasUtmParams = link.utmParams && link.utmParams.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 shrink-0 text-muted-foreground hover:text-primary",
            className,
          )}
          disabled={isExpired}
          aria-label="Copy link options"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="select-none">Copy Link</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="p-0">
          <CopyToClipboardButton
            content={baseShortUrl}
            variant="ghost"
            className="h-8 w-full justify-start gap-2 px-2 py-1.5 text-sm font-normal text-foreground [&_svg]:mr-2 [&_svg]:size-4"
            disabled={isExpired}
            successToastOptions={{ title: "Base URL Copied!" }}
          >
            <span>Base URL</span>
          </CopyToClipboardButton>
        </DropdownMenuItem>
        {hasUtmParams && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="hover:text-white data-[state=open]:text-white">
              <Share2 className="mr-2 h-4 w-4" />
              <span>Copy with Campaign...</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuLabel className="select-none">
                  Select Campaign
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {link.utmParams.map((utmSet) => {
                  const urlWithUtm = buildUrlWithUtm(baseShortUrl, utmSet);
                  return (
                    <DropdownMenuItem key={utmSet.id} asChild className="p-0">
                      <CopyToClipboardButton
                        content={urlWithUtm}
                        variant="ghost"
                        className="h-8 w-full justify-start gap-2 px-2 py-1.5 text-sm font-normal text-foreground [&_svg]:size-4"
                        disabled={isExpired}
                        successToastOptions={{
                          title: `URL with Campaign Copied!`,
                          description: `${utmSet.campaign}`,
                        }}
                      >
                        <span className="truncate" title={utmSet.campaign}>
                          {utmSet.campaign}
                        </span>
                      </CopyToClipboardButton>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
