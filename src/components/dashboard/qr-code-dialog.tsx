"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useFileUpload, type FileWithPreview } from "@/hooks";
import { Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

import { buildShortUrl } from "@/lib/helpers";
import {
  dataURLtoFile,
  loadQrPreferences,
  saveQrPreferences,
} from "@/lib/qr-preferences-db";
import type { ShortLinkFromRepository } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/simple-toast";

import { ImgUploader } from "./img-uploader";

interface QrCodeDialogProps {
  link: ShortLinkFromRepository;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPremiumOrDemoUser: boolean;
}

const DEFAULT_FG_COLOR = "#000000";
const DEFAULT_BG_COLOR = "#FFFFFF";
const QR_CODE_SIZE = 512;

const MAX_LOGO_SIZE_MB = 2;
const MAX_LOGO_SIZE_BYTES = MAX_LOGO_SIZE_MB * 1024 * 1024;
const ACCEPTED_LOGO_TYPES = "image/svg+xml,image/png,image/jpeg,image/jpg";

export default function QrCodeDialog({
  link,
  open,
  onOpenChange,
  isPremiumOrDemoUser,
}: QrCodeDialogProps) {
  const [fgColor, setFgColor] = useState(DEFAULT_FG_COLOR);
  const [bgColor, setBgColor] = useState(DEFAULT_BG_COLOR);

  const handleColorChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    let lastUpdate = 0;
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const now = Date.now();
      if (now - lastUpdate > 50) {
        setter(e.target.value);
        lastUpdate = now;
      }
    };
  };

  const handleFgColorChange = useCallback(handleColorChange(setFgColor), []);
  const handleBgColorChange = useCallback(handleColorChange(setBgColor), []);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
      clearFiles,
      addFiles,
    },
  ] = useFileUpload({
    multiple: false,
    maxSize: MAX_LOGO_SIZE_BYTES,
    accept: ACCEPTED_LOGO_TYPES,
  });

  const selectedLogoFileWithPreview: FileWithPreview | undefined = files[0];
  const selectedLogoDataUrl = selectedLogoFileWithPreview?.preview || null;

  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  // --- Effect to Load preferences when the dialog opens ---
  useEffect(() => {
    if (open && link?.shortCode) {
      const loadPreferences = async () => {
        try {
          const preferences = await loadQrPreferences(link.shortCode);

          if (preferences) {
            setFgColor(preferences.fgColor);
            setBgColor(preferences.bgColor);

            if (preferences.logoDataUrl && isPremiumOrDemoUser) {
              if (preferences.logoDataUrl.startsWith("data:")) {
                const logoFile = await dataURLtoFile(
                  preferences.logoDataUrl,
                  `logo_${link.shortCode}`,
                );
                addFiles([logoFile]);
              }
            }
          }
        } catch (error) {
          console.error("Error loading preferences:", error);
        }
      };

      loadPreferences();
    }
  }, [open, link?.shortCode, isPremiumOrDemoUser]);

  const handleDownload = () => {
    const canvas = qrCodeRef.current;
    if (!canvas) {
      toast({
        title: "Error",
        description: "Could not generate QR code for download.",
        type: "error",
      });
      return;
    }

    const pngUrl = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = `qrcode-${link.shortCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Downloaded!",
      description: "QR code has been downloaded.",
    });
  };

  const shortUrl = buildShortUrl(link.shortCode, link.customDomain?.domain);

  const savePreferences = async () => {
    if (link?.shortCode && isPremiumOrDemoUser) {
      let logoDataUrl: string | null = null;

      if (files.length > 0) {
        const file = files[0];
        logoDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject();
          // Use the actual Blob from file object if available
          const fileToRead = "file" in file ? file.file : file;
          reader.readAsDataURL(fileToRead as Blob);
        });
      }

      const currentPreferences = {
        fgColor,
        bgColor,
        logoDataUrl,
      };

      try {
        await saveQrPreferences(link.shortCode, currentPreferences);
      } catch (error) {
        console.error(`Error saving preferences: ${error}`);
      }
    }

    if (files.length > 0) {
      requestAnimationFrame(() => clearFiles());
    }
    setFgColor(DEFAULT_FG_COLOR);
    setBgColor(DEFAULT_BG_COLOR);
  };

  return (
    <Credenza
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          savePreferences().catch((error) => {
            console.error("Failed to save logo configuration:", error);
            toast({
              title: "Error",
              description: "Failed to save logo configuration",
              type: "error",
            });
          });
        }
        onOpenChange(isOpen);
      }}
    >
      <CredenzaContent className="max-h-full max-w-full overflow-hidden md:max-h-[90vh] md:max-w-lg md:overflow-y-auto">
        <CredenzaHeader>
          <CredenzaTitle>Customize & Download QR Code</CredenzaTitle>
          <CredenzaDescription>
            Scan this QR code to access your shortened URL. Customize its
            appearance and add an optional logo.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="flex flex-grow flex-col items-center gap-6 overflow-y-auto py-6">
          {/* QR Code Display */}
          {shortUrl ? (
            <div
              className="relative flex items-center justify-center overflow-hidden rounded-md border"
              style={{
                height: `${QR_CODE_SIZE / 2}px`,
                width: `${QR_CODE_SIZE / 2}px`,
              }}
            >
              <QRCodeCanvas
                value={shortUrl}
                size={QR_CODE_SIZE}
                fgColor={fgColor}
                bgColor={bgColor}
                level="H" // High error correction level for logos
                imageSettings={
                  selectedLogoDataUrl
                    ? {
                        src: selectedLogoDataUrl,
                        x: undefined, // Auto-center
                        y: undefined, // Auto-center
                        height: QR_CODE_SIZE * 0.2, // Logo size (20%)
                        width: QR_CODE_SIZE * 0.2,
                        excavate: true, // Make space for the logo
                      }
                    : undefined
                }
                ref={qrCodeRef}
                className="scale-50"
              />
            </div>
          ) : (
            <div className="flex h-64 w-64 items-center justify-center rounded-md border bg-muted">
              <p className="px-4 text-center text-sm text-muted-foreground">
                QR code not available. Please ensure the link is valid.
              </p>
            </div>
          )}

          <Accordion
            type="single"
            variant="separated"
            styleVariant="outline"
            collapsible
          >
            <AccordionItem
              value="customization"
              className="hover:border-muted-foreground/60"
            >
              <AccordionTrigger className="focus-visible:outline-none">
                Customization Options
              </AccordionTrigger>
              <AccordionContent>
                {isPremiumOrDemoUser ? (
                  <section className="w-full space-y-6 px-1">
                    <div className="grid w-full items-center gap-3">
                      <Label htmlFor="fgColor">Foreground Color</Label>
                      <Input
                        id="fgColor"
                        type="color"
                        defaultValue={fgColor} // Usar defaultValue en lugar de value
                        onChange={handleFgColorChange}
                        className="h-10 w-full hover:border-muted-foreground/60"
                      />
                    </div>

                    <div className="grid w-full items-center gap-3">
                      <Label htmlFor="bgColor">Background Color</Label>
                      <Input
                        id="bgColor"
                        type="color"
                        defaultValue={bgColor}
                        onChange={handleBgColorChange}
                        className="h-10 w-full"
                      />
                    </div>

                    <div className="grid w-full items-center gap-3">
                      <Label>Optional Logo Image</Label>
                      <ImgUploader
                        {...{
                          handleDragEnter,
                          handleDragLeave,
                          handleDragOver,
                          handleDrop,
                          openFileDialog,
                          removeFile,
                          getInputProps,
                          isDragging,
                          files,
                          errors,
                          acceptedTypes: ACCEPTED_LOGO_TYPES,
                          maxSize: MAX_LOGO_SIZE_MB,
                        }}
                      />
                    </div>
                  </section>
                ) : (
                  <Alert variant="info" styleVariant="bootstrap" withIcon>
                    <AlertTitle>
                      QR Code customization is a premium feature.
                    </AlertTitle>
                    <AlertDescription>
                      Upgrade your plan to access QR Code customization options.
                      <br />
                      <span className="text-sm">
                        <Link
                          href="/pricing"
                          className="text-blue-500 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Upgrade Now
                        </Link>
                      </span>
                    </AlertDescription>
                  </Alert>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CredenzaBody>
        <CredenzaFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {shortUrl && (
            <Button
              onClick={handleDownload}
              iconLeft={<Download />}
              iconAnimation="translateYDown"
              disabled={errors.length > 0}
            >
              Download
            </Button>
          )}
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
