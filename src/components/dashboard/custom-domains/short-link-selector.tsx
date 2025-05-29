import { ShortLinkFromRepository } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from "@/components/ui/modal";

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
    <Modal open={open} onOpenChange={onClose} separatedFooter>
      <ModalContent className="max-w-full md:max-w-[500px]">
        <ModalTitle>Short Links Available</ModalTitle>
        <ModalBody className="pb-4">
          {userShortLinks.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              There are no short links available.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {userShortLinks.map((link) => {
                const isSelected = selectedLinkIds?.includes(link.id) ?? false;
                return (
                  <Label
                    key={link.id}
                    className="group flex cursor-pointer items-center gap-2 rounded border p-2 hover:border-primary/60"
                  >
                    <Checkbox
                      checked={isSelected}
                      variant="draw"
                      onCheckedChange={() => toggleSelection(link)}
                      className="size-[0.9rem] border-muted-foreground/80 group-hover:border-primary/80 data-[state=checked]:border-primary/60 [&>svg]:size-[0.9rem]"
                    />
                    <div>
                      <p className="text-sm font-medium">{link.shortCode}</p>
                      <p className="text-xs text-muted-foreground">
                        {link.originalUrl}
                      </p>
                    </div>
                  </Label>
                );
              })}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} size="sm" className="w-full md:w-fit">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
