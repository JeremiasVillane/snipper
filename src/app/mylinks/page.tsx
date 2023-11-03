import { SnipCard } from "@/components";
import { getCurrentUser } from "@/server-actions";
import { Url } from "@prisma/client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Snipper: My URLs",
};

export default async function MyLinks() {
  const { urls }: { urls: [Url] } = await getCurrentUser();

  return (
    <div className="max-w-5xl mx-auto px-8">
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 py-10">
        {urls ? (
          urls.map((url: Url, index: number) => (
            <SnipCard
              key={index}
              index={index}
              date={new Date(url.createdAt).toLocaleDateString()}
              urlCode={url.urlCode}
              shortUrl={url.shortUrl}
              originalUrl={url.originalUrl}
              clicks={url.clicks}
            />
          ))
        ) : (
          <p>No urls</p>
        )}
      </div>
    </div>
  );
}
