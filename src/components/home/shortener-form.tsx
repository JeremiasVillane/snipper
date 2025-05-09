"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { buildShortUrl, generateShortCode } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyToClipboardButton } from "@/components/ui/copy-to-clipboard-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShineBorder } from "@/components/ui/shine-border";
import { toast } from "@/components/ui/simple-toast";

export function ShortenerForm() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isDemoProcessing, setIsDemoProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShortUrl(null);

    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL.",
        type: "error",
      });
      return;
    }

    try {
      new URL(url);
    } catch (_) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL.",
        type: "error",
      });
      return;
    }

    setIsDemoProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const demoShortCode = generateShortCode();
    const demoShortUrl = buildShortUrl(demoShortCode);

    setShortUrl(demoShortUrl);
    setIsDemoProcessing(false);

    toast({
      title: "Short URL created!",
      description: "Register or login to save it.",
    });
  };

  return (
    <Card
      id="shorten"
      className="relative w-full overflow-hidden transition-all duration-300 hover:scale-105 hover:border-border"
    >
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Enter your long URL</Label>
            <Input
              id="url"
              placeholder="https://example.com/very/long/url/that/needs/shortening"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              aria-describedby="url-helper-text"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            isLoading={isDemoProcessing}
            disabled={isDemoProcessing}
          >
            {isDemoProcessing ? "Shortening..." : "Shorten URL (Demo)"}
          </Button>
        </form>

        {shortUrl && (
          <div className="mt-6 space-y-3 border-t pt-4">
            <Label htmlFor="short-url">Your short URL</Label>
            <div className="flex items-center gap-2">
              <Input
                id="short-url"
                value={shortUrl}
                readOnly
                className="font-medium text-primary"
              />
              <CopyToClipboardButton
                title="Copy link"
                content={shortUrl}
                className={buttonVariants({ variant: "outline", size: "icon" })}
              />
              <Button
                size="icon"
                variant="outline"
                title="Open short link (Demo)"
                className="px-2 text-muted-foreground"
              >
                <ExternalLink className="size-4" />
              </Button>
            </div>
            <p
              id="url-helper-text"
              className="mt-2 text-sm text-muted-foreground"
            >
              This is a demo link and has not been saved.{" "}
              <Link
                href={`/register?redirect=/dashboard&pendingUrl=${encodeURIComponent(
                  url,
                )}`}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "h-auto p-0",
                )}
              >
                Create an account
              </Link>{" "}
              o{" "}
              <Link
                href={`/login?redirect=/dashboard&pendingUrl=${encodeURIComponent(
                  url,
                )}`}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "h-auto p-0",
                )}
              >
                sign in
              </Link>{" "}
              to customize your links, track analytics, and more.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
