"use client";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ShortLink } from "@/lib/types";
import { toast } from "../ui/simple-toast";

interface QrCodeDialogProps {
  link: ShortLink;
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code to access your shortened URL
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-6">
          {link.qrCodeUrl ? (
            <img
              src={link.qrCodeUrl || "/placeholder.svg"}
              alt={`QR code for ${link.shortCode}`}
              className="w-48 h-48 border rounded-md"
            />
          ) : (
            <div className="w-48 h-48 border rounded-md flex items-center justify-center bg-muted">
              <p className="text-sm text-muted-foreground text-center px-4">
                QR code not available
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {link.qrCodeUrl && (
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
