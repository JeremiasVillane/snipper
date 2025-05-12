"use client";

import Image from "next/image";
import { ImageIcon, UploadIcon, XIcon } from "lucide-react";

import { FileUploadActions, FileUploadState } from "@/hooks/use-file-upload";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ImgUploaderProps {
  handleDragEnter: FileUploadActions["handleDragEnter"];
  handleDragLeave: FileUploadActions["handleDragLeave"];
  handleDragOver: FileUploadActions["handleDragOver"];
  handleDrop: FileUploadActions["handleDrop"];
  openFileDialog: FileUploadActions["openFileDialog"];
  removeFile: FileUploadActions["removeFile"];
  getInputProps: FileUploadActions["getInputProps"];
  isDragging: FileUploadState["isDragging"];
  files: FileUploadState["files"];
  errors: FileUploadState["errors"];
  acceptedTypes: string;
  maxSize: number;
}

export function ImgUploader({
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
  acceptedTypes,
  maxSize,
}: ImgUploaderProps) {
  const previewUrl = files[0]?.preview || null;
  const fileName =
    files[0]?.file instanceof File
      ? files[0].file.name
      : files[0]?.file.name || null;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        {/* Drop area */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="relative flex min-h-40 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload image file"
          />
          {previewUrl ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={previewUrl}
                alt={fileName || "Uploaded image"}
                width={111}
                height={111}
                className="mx-auto max-h-full rounded object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="mb-2 flex size-10 shrink-0 items-center justify-center rounded-full border bg-background"
                aria-hidden="true"
              >
                <ImageIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">Drop your image here</p>
              <p className="text-xs text-muted-foreground">
                {acceptedTypes
                  .split(",")
                  .map((type) => type.split("/")[1].toUpperCase())
                  .join(", ")}{" "}
                (max. {maxSize}MB)
              </p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={openFileDialog}
                type="button"
              >
                <UploadIcon
                  className="-ms-1 size-4 opacity-60"
                  aria-hidden="true"
                />
                Select image
              </Button>
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="absolute right-2 top-2 z-10">
            <button
              type="button"
              className="z-50 flex size-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-none transition-[color,box-shadow] hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              onClick={() => files[0]?.id && removeFile(files[0].id)}
              aria-label="Remove image"
            >
              <XIcon className="size-3" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Display the first error from useFileUpload */}
      {errors.length > 0 && (
        <Alert withIcon variant="destructive">
          <AlertTitle className="font-bold">{errors[0]}</AlertTitle>
        </Alert>
      )}
    </div>
  );
}
