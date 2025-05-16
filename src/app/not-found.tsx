import { MagicBackButton } from "@/components/ui/magic-back-button";
import { Separator } from "@/components/ui/separator";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md rounded-xl border border-border/50 bg-card p-8 text-center shadow-lg">
        <h1 className="mb-2 animate-pulse text-8xl font-bold text-primary">
          404
        </h1>

        <h2 className="mb-4 text-3xl font-semibold text-foreground">
          Page Not Found
        </h2>

        <p className="mb-8 text-lg text-muted-foreground">
          Sorry, we couldn't find the page you were looking for. It might have
          been moved, deleted, or maybe you just mistyped the URL.
        </p>

        <Separator className="my-6 border-muted" />

        <div className="flex flex-row items-center justify-center gap-2 text-lg font-semibold text-foreground/80">
          <MagicBackButton />
          <span>Go Back</span>
        </div>
      </div>
    </div>
  );
}
