import { Pencil, X } from "lucide-react";

import type { UtmSetFormData } from "@/lib/schemas";
import { Button } from "@/components/ui/button";

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
    <div className="flex items-center justify-between gap-2 rounded-md border bg-background p-3 text-sm">
      <div className="flex flex-col gap-1 overflow-hidden">
        <p
          className="truncate font-semibold text-primary"
          title={utmSet.campaign}
        >
          Campaign: {utmSet.campaign}
        </p>
        {summary && (
          <p className="truncate text-xs text-muted-foreground" title={summary}>
            {summary}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center">
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
