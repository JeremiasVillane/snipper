import { Button } from "@/components/ui/button";
import type { UtmSetFormData } from "@/lib/schemas";
import { Pencil, X } from "lucide-react";

interface UtmSetDisplayProps {
  index: number;
  utmSet: UtmSetFormData;
  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
}

export function UtmSetDisplay({
  index,
  utmSet,
  onRemove,
  onEdit,
}: UtmSetDisplayProps) {
  const summary = [
    utmSet.source ? `s: ${utmSet.source}` : null,
    utmSet.medium ? `m: ${utmSet.medium}` : null,
    utmSet.term ? `t: ${utmSet.term}` : null,
    utmSet.content ? `c: ${utmSet.content}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border p-3 text-sm bg-background">
      <div className="flex flex-col gap-1 overflow-hidden">
        <p
          className="font-semibold truncate text-primary"
          title={utmSet.campaign}
        >
          Campaign: {utmSet.campaign}
        </p>
        {summary && (
          <p className="text-xs text-muted-foreground truncate" title={summary}>
            {summary}
          </p>
        )}
      </div>

      <div className="flex items-center shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-primary"
          onClick={() => onEdit(index)}
          aria-label={`Edit campaign ${utmSet.campaign}`}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(index)}
          aria-label={`Remove campaign ${utmSet.campaign}`}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
