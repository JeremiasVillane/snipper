"use client";

import type React from "react";

import { Copy, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/simple-toast";
import { shortenUrl } from "@/actions";

export function ShortenerForm() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        type: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await shortenUrl(url);
      setShortUrl(result.shortUrl);
      toast({
        title: "Success!",
        description: "Your URL has been shortened",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to shorten URL. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard",
      });
    }
  };

  return (
    <Card className="w-full" id="shorten">
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
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Shortening...
              </>
            ) : (
              "Shorten URL"
            )}
          </Button>
        </form>

        {shortUrl && (
          <div className="mt-4 space-y-2">
            <Label htmlFor="short-url">Your short URL</Label>
            <div className="flex items-center gap-2">
              <Input
                id="short-url"
                value={shortUrl}
                readOnly
                className="font-medium"
              />
              <Button size="icon" variant="outline" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Want more features?{" "}
              <a href="/register" className="text-primary hover:underline">
                Create an account
              </a>{" "}
              to customize your links, track analytics, and more.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
