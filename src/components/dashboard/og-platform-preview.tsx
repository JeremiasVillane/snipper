import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OGPlatformPreviewProps {
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  siteName?: string;
}

const PLACEHOLDER_IMAGE = "/placeholder.svg";
const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 630;

const CommonPreview: React.FC<{
  imageUrl: string;
  className?: string;
}> = ({ imageUrl, className = "" }) => (
  <figure className={`relative aspect-[1200/630] w-full ${className}`}>
    <Image
      src={imageUrl}
      alt="Preview"
      width={IMAGE_WIDTH}
      height={IMAGE_HEIGHT}
      className="size-full object-cover"
      draggable={false}
    />
  </figure>
);

export function OGPlatformPreview({
  title,
  description,
  imageUrl,
  siteName = "YourSite.com",
}: OGPlatformPreviewProps) {
  const currentImageUrl = imageUrl ?? PLACEHOLDER_IMAGE;
  const currentTitle = title || "Your Title Here";
  const currentDescription =
    description ||
    "Your description will appear here. Keep it concise and engaging.";

  return (
    <Tabs
      variant="underlined"
      defaultValue="facebook"
      className="flex min-h-80 flex-col md:min-h-96"
    >
      <TabsList>
        <TabsTrigger value="facebook" className="w-full">
          Facebook
        </TabsTrigger>
        <TabsTrigger value="instagram" className="w-full">
          Instagram
        </TabsTrigger>
        <TabsTrigger value="xtwitter" className="w-full">
          X/Twitter
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="facebook"
        className="flex flex-grow items-center justify-center"
      >
        <div className="w-full max-w-96 border border-gray-300">
          <CommonPreview imageUrl={currentImageUrl} />
          <div className="grid gap-1 border-t border-gray-300 bg-[#f2f3f5] p-2">
            <p className="text-xs uppercase text-foreground/80 md:text-sm">
              {siteName}
            </p>
            <p className="truncate text-xs font-bold text-[#1d2129] md:text-sm">
              {currentTitle}
            </p>
            <p className="mb-1 line-clamp-2 max-h-10 w-full rounded-md text-xs text-muted-foreground md:text-sm">
              {currentDescription}
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="instagram"
        className="flex flex-grow items-center justify-center"
      >
        <div className="grid max-w-96 grid-cols-2 gap-3 rounded-lg border border-[#8c8c8c33] px-4 py-3">
          <div className="overflow-hidden rounded-lg">
            <CommonPreview imageUrl={currentImageUrl} />
          </div>
          <div className="grid gap-2">
            <div className="line-clamp-2 w-full border-none text-sm font-bold leading-4 text-foreground/80 md:text-base">
              {currentTitle}
            </div>
            <p className="text-sm text-foreground/60 md:text-base">
              {siteName}
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="xtwitter"
        className="flex flex-grow items-start justify-center"
      >
        <div className="w-full max-w-96">
          <div className="relative overflow-hidden rounded-2xl border border-gray-300">
            <CommonPreview imageUrl={currentImageUrl} />
            <div className="absolute bottom-2 left-0 w-full px-2">
              <div className="w-fit max-w-full rounded bg-black/[0.77] px-1.5 py-px">
                <span className="block max-w-sm truncate text-xs text-white md:text-sm">
                  {currentTitle}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-1 text-xs text-[#606770] md:text-sm">
            From {siteName}
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
