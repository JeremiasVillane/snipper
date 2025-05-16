"use client";

import { useCopyToClipboard } from "@/hooks";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button, ButtonProps } from "./button";
import { toast, ToastProps } from "./simple-toast";

export const CopyToClipboardButton = ({
  content,
  className,
  successToastOptions,
  children,
  ...props
}: ButtonProps & {
  content: string;
  successToastOptions?: Omit<ToastProps, "id">;
}) => {
  const { copyToClipboard, isCopied } = useCopyToClipboard({
    onCopy: () =>
      toast(
        successToastOptions ?? {
          title: "Copied!",
          description: "Copied to clipboard",
        }
      ),
  });

  return (
    <Button
      variant="ghost"
      size="xs"
      {...props}
      className={cn(
        "relative shrink-0 [&_svg]:size-3.5",
        "text-muted-foreground hover:bg-transparent hover:text-primary",
        className
      )}
      onClick={() => copyToClipboard(content)}
      aria-label={isCopied ? "Copied to clipboard" : "Copy to clipboard"}
    >
      <span className="sr-only">{isCopied ? "Copied" : "Copy"}</span>
      <Copy
        className={cn(
          "h-4 w-4 transition-transform duration-200 ease-in-out",
          isCopied ? "scale-0" : "scale-100"
        )}
        aria-hidden={isCopied}
      />
      <Check
        className={cn(
          "absolute h-4 w-4 transition-transform duration-200 ease-in-out",
          isCopied ? "scale-100" : "scale-0"
        )}
        aria-hidden={!isCopied}
      />
      {children}
    </Button>
  );
};
