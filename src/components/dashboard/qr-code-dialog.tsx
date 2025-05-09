"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";

import { buildShortUrl, generateQRCode } from "@/lib/helpers";
import type { ShortLinkFromRepository } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { toast } from "@/components/ui/simple-toast";

interface QrCodeDialogProps {
  link: ShortLinkFromRepository;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QrCodeDialog({
  link,
  open,
  onOpenChange,
}: QrCodeDialogProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () =>
      setQrCodeUrl(await generateQRCode(buildShortUrl(link.shortCode))))();
  }, []);

  const handleDownload = async () => {
    if (!qrCodeUrl) return;

    const a = document.createElement("a");
    a.href = qrCodeUrl;
    a.download = `qrcode-${link.shortCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Downloaded!",
      description: "QR code has been downloaded",
    });
  };

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>QR Code</CredenzaTitle>
          <CredenzaDescription>
            Scan this QR code to access your shortened URL
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="flex justify-center py-6">
          {qrCodeUrl ? (
            <Image
              src={qrCodeUrl || "/placeholder.svg"}
              alt={`QR code for ${link.shortCode}`}
              className="h-48 w-48 rounded-md border"
              width={12}
              height={12}
            />
          ) : (
            <div className="flex h-48 w-48 items-center justify-center rounded-md border bg-muted">
              <p className="px-4 text-center text-sm text-muted-foreground">
                QR code not available
              </p>
            </div>
          )}
        </CredenzaBody>
        <CredenzaFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {qrCodeUrl && (
            <Button
              onClick={handleDownload}
              iconLeft={<Download />}
              iconAnimation="translateYDown"
            >
              Download
            </Button>
          )}
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
