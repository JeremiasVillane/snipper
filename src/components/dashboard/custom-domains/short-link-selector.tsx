import { ShortLinkFromRepository } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";

interface ShortLinkSelectorProps {
  userShortLinks: ShortLinkFromRepository[];
  selectedLinkIds: string[];
  onSelectLinks: (ids: string[]) => void;
  open: boolean;
  onClose: () => void;
}

export function ShortLinkSelector({
  userShortLinks,
  selectedLinkIds,
  onSelectLinks,
  open,
  onClose,
}: ShortLinkSelectorProps) {
  const toggleSelection = (link: ShortLinkFromRepository) => {
    const currentIds = selectedLinkIds ?? [];
    if (currentIds.includes(link.id)) {
      onSelectLinks(currentIds.filter((id) => id !== link.id));
    } else {
      onSelectLinks([...currentIds, link.id]);
    }
  };

  return (
    <Credenza open={open} onOpenChange={onClose}>
      <CredenzaContent className="max-w-full md:max-w-[500px]">
        <CredenzaHeader>
          <CredenzaTitle>Short Links Available</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          {userShortLinks.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              There are no short links available.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {userShortLinks.map((link) => {
                const isSelected = selectedLinkIds?.includes(link.id) ?? false;
                return (
                  <label
                    key={link.id}
                    className="flex cursor-pointer items-center gap-2 rounded border p-2"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(link)}
                      className="form-checkbox"
                    />
                    <div>
                      <p className="text-sm font-medium">{link.shortCode}</p>
                      <p className="text-xs text-muted-foreground">
                        {link.originalUrl}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </CredenzaBody>
        <div className="flex justify-end p-4">
          <Button onClick={onClose} size="sm">
            Close
          </Button>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
