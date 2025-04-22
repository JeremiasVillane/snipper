import { MagicBackButton } from "@/components/ui/magic-back-button";
import { Separator } from "@/components/ui/separator";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md text-center bg-card p-8 rounded-xl shadow-lg border border-border/50">
        <h1 className="text-8xl font-bold text-primary mb-2 animate-pulse">
          404
        </h1>

        <h2 className="text-3xl font-semibold text-foreground mb-4">
          Page Not Found
        </h2>

        <p className="text-lg text-muted-foreground mb-8">
          Sorry, we couldn't find the page you were looking for. It might have
          been moved, deleted, or maybe you just mistyped the URL.
        </p>

        <Separator className="my-6 border-muted" />

        <div className="flex flex-row items-center justify-center gap-2 font-semibold text-lg text-foreground/80">
          <MagicBackButton />
          <span>Go Back</span>
        </div>
      </div>
    </div>
  );
}
