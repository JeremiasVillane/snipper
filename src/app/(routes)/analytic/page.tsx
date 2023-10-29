import { getAnalytics } from "@/server-actions";
import Link from "next/link";

interface AnalyticPageProps {
  searchParams: {
    code: string;
  };
}

export default async function AnalyticPage({
  searchParams,
}: AnalyticPageProps) {
  const { code } = searchParams;
  const res = await getAnalytics(code);

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-slate-600 text-3xl">
        Total clicks: {res?.data?.clicked}
      </h1>

      <div className="flex flex-col gap-4 mt-8">
        <div className="flex">
          <span className="mr-2">Original URL</span>

          <Link
            href={res?.data ? res.data.url.originalUrl : "#"}
            className="text-blue-300"
            target="_blank"
          >
            {res?.data?.url.originalUrl}
          </Link>
        </div>

        <div className="flex">
          <span className="mr-2">Snipped URL</span>

          <Link
            href={res?.data ? res.data.url.shortUrl : "#"}
            className="text-blue-300"
            target="_blank"
            prefetch={false}
          >
            {res?.data?.url.shortUrl}
          </Link>
        </div>
      </div>

      <button type="button" className="p-4 mt-8 bg-slate-400 rounded-lg">
        <Link href="/" className="text-white" target="_blank">
          Snip another URL
        </Link>
      </button>
    </div>
  );
}
