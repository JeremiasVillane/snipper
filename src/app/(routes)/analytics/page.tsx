import { Redirector } from "@/components";
import { getAnalytics } from "@/server-actions";
import Link from "next/link";

interface AnalyticsPageProps {
  searchParams: {
    code: string;
  };
}

export default async function AnalyticsPage({
  searchParams,
}: AnalyticsPageProps) {
  const { code } = searchParams;
  const res = await getAnalytics(code);

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-slate-600 text-3xl">
        Total clicks: {res?.data?.clicks}
      </h1>

      <div className="flex flex-col gap-4 mt-8">
        <div className="flex">
          <span className="mr-2">Original URL</span>

          <a
            href={res?.data ? res.data.url.originalUrl : "#"}
            className="text-blue-300"
            target="_blank"
          >
            {res?.data?.url.originalUrl}
          </a>
        </div>

        <div className="flex">
          <span className="mr-2">Snipped URL</span>

          <Redirector code={res?.data ? res.data.url.urlCode : "#"}>
            {res?.data?.url.shortUrl}
          </Redirector>
        </div>
      </div>

      <button type="button" className="p-4 mt-8 bg-slate-400 rounded-lg">
        <Link href="/" className="text-white">
          Snip another URL
        </Link>
      </button>
    </div>
  );
}
