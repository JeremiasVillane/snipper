"use client";

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
import type { ShortLinkFromRepository } from "@/lib/types";
import { Download } from "lucide-react";
import Image from "next/image";
import { toast } from "../ui/simple-toast";

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
  const handleDownload = () => {
    if (!link.qrCodeUrl) return;

    const a = document.createElement("a");
    a.href = link.qrCodeUrl;
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
          {link.qrCodeUrl ? (
            <Image
              src={link.qrCodeUrl || "/placeholder.svg"}
              alt={`QR code for ${link.shortCode}`}
              className="w-48 h-48 border rounded-md"
              width={12}
              height={12}
            />
          ) : (
            <div className="w-48 h-48 border rounded-md flex items-center justify-center bg-muted">
              <p className="text-sm text-muted-foreground text-center px-4">
                QR code not available
              </p>
            </div>
          )}
        </CredenzaBody>
        <CredenzaFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {link.qrCodeUrl && (
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
