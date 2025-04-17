import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
          <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Link Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The link you're looking for doesn't exist or has expired.
        </p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
