"use client";

import { useEffect, useState } from "react";
import { useFileUpload } from "@/hooks";
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";

import { CreateLinkFormData } from "@/lib/schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/simple-toast";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImgUploader } from "@/components/img-uploader";

import { OGPlatformPreview } from "./og-platform-preview";

interface OgPreviewCustomizerProps {
  control: Control<CreateLinkFormData>;
  setValue: UseFormSetValue<CreateLinkFormData>;
  getValues: UseFormGetValues<CreateLinkFormData>;
  errors: FieldErrors<CreateLinkFormData>;
  setOgImageFile: (val: File | null) => void;
}

const MAX_IMAGE_SIZE_MB = 3;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = "image/png,image/jpeg,image/jpg";

export function OgPreviewCustomizer({
  control,
  setValue,
  getValues,
  errors,
  setOgImageFile,
}: OgPreviewCustomizerProps) {
  const [
    { files, isDragging, errors: imgErrors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
      addFiles,
    },
  ] = useFileUpload({
    multiple: false,
    maxSize: MAX_IMAGE_SIZE_BYTES,
    accept: ACCEPTED_IMAGE_TYPES,
    onFilesRemoved: () => setValue("customOgImageUrl", null),
  });

  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(
    getValues("customOgImageUrl") ?? null,
  );

  const isCustomOgEnabled = getValues("isCustomOgEnabled");
  const customOgTitle = getValues("customOgTitle");
  const customOgDescription = getValues("customOgDescription");

  useEffect(() => {
    const loadCurrentImage = async () => {
      try {
        const formImageUrl = getValues("customOgImageUrl");
        if (!!formImageUrl) {
          const imageFile = await fetch(formImageUrl)
            .then((res) => res.blob())
            .then(
              (res) =>
                new File([res], `custom-og-image-${getValues("shortCode")}`, {
                  type: res.type,
                }),
            );
          addFiles([imageFile]);
        }
      } catch (error) {
        console.error("Error loading OG Image:", error);
        toast({
          title: "Error loading image. Try again later.",
          type: "error",
        });
      }
    };

    loadCurrentImage();
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      const file = files[0].file as File;
      setOgImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setCurrentImageUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (files.length === 0) {
      setOgImageFile(null);
      setCurrentImageUrl(null);
    }
  }, [files.length]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link Preview (Open Graph)</CardTitle>
        <CardDescription>
          Customize how your link appears when shared on social media.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="isCustomOgEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Customize Preview</FormLabel>
                <FormDescription>
                  Manually set the title, description, and image.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (!checked) {
                      setValue("customOgTitle", null);
                      setValue("customOgDescription", null);
                      setValue("customOgImageUrl", null);
                      setCurrentImageUrl(null);
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {!isCustomOgEnabled && (
          <p className="px-4 text-sm text-muted-foreground">
            A preview will be automatically generated based on the original
            URL's content.
          </p>
        )}

        {isCustomOgEnabled && (
          <div className="ml-0 space-y-4 border-l border-dotted pl-3 md:ml-0 md:pl-4">
            <FormField
              control={control}
              name="customOgTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preview Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a catchy title (max 70 chars)"
                      {...field}
                      value={field.value ?? ""}
                      maxLength={70}
                      showMaxLength="outside"
                    />
                  </FormControl>
                  <FormDescription>
                    Appears prominently in the preview.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="customOgDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preview Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the link's content (max 200 chars)"
                      {...field}
                      value={field.value ?? ""}
                      maxLength={200}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Supports the title, shown below it.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Preview Image</FormLabel>
              <FormDescription>
                Upload a custom image (Recommended: 1200x630px).
              </FormDescription>
              <FormControl>
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
                    errors: imgErrors,
                    acceptedTypes: ACCEPTED_IMAGE_TYPES,
                    maxSize: MAX_IMAGE_SIZE_MB,
                    previewWidth: 200,
                    previewHeight: 105,
                  }}
                />
              </FormControl>
              <FormMessage>{errors.customOgImageUrl?.message}</FormMessage>
            </FormItem>
          </div>
        )}

        {isCustomOgEnabled && (
          <div className="mt-8 border-t border-dotted pt-6">
            <h3 className="mb-4 text-center text-lg font-semibold">
              Live Preview
            </h3>

            <OGPlatformPreview
              title={customOgTitle}
              description={customOgDescription}
              imageUrl={currentImageUrl}
              siteName={new URL(getValues("originalUrl")).host}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
