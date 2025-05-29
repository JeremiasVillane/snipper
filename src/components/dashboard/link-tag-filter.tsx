import { useState } from "react";
import { Plus, Tag } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";

interface LinkTagFilterProps {
  selectedTags: string[];
  setSelectedTags: (val: React.SetStateAction<string[]>) => void;
  availableTags: string[];
}

export function LinkTagFilter({
  selectedTags,
  setSelectedTags,
  availableTags,
}: LinkTagFilterProps) {
  const [open, setOpen] = useState(false);
  const [currentTags, setCurrentTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setCurrentTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag],
    );
  };

  const applyTags = () => {
    setSelectedTags(currentTags);
    setOpen(false);
  };

  const clearTags = () => {
    setCurrentTags([]);
    setSelectedTags([]);
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
        isOpen ? setCurrentTags(selectedTags) : setCurrentTags([]);
        setOpen(isOpen);
      }}
      separatedFooter
    >
      <ModalTrigger asChild>
        <Button
          variant="outline"
          iconLeft={<Tag className="size-4" />}
          iconAnimation="spinRight"
          className="gap-2"
        >
          Tags
          {selectedTags.length > 0 && (
            <Badge size="sm" variant="secondary" className="ml-1 p-2">
              {selectedTags.length}
            </Badge>
          )}
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalTitle>Filter by Tags</ModalTitle>
        <ModalDescription>Select tags to filter your links</ModalDescription>

        <ModalBody className="flex flex-row flex-wrap gap-2 py-4">
          {availableTags.length > 0 ? (
            availableTags.map((tag) => (
              <Badge
                key={tag}
                role="button"
                variant={currentTags.includes(tag) ? "default" : "outline"}
                size="md"
                shape="pill"
                leftElement={<Tag />}
                rightElement={
                  <Plus
                    className={cn(
                      "transition-all",
                      currentTags.includes(tag) && "rotate-45",
                    )}
                  />
                }
                onClick={() => toggleTag(tag)}
                className="cursor-pointer"
              >
                {tag}
              </Badge>
            ))
          ) : (
            <p className="text-muted-foreground">No tags available</p>
          )}
        </ModalBody>
        <ModalFooter>
          {availableTags.length > 0 && (
            <Button
              variant="outline"
              onClick={clearTags}
              disabled={currentTags.length < 1}
            >
              Clear All
            </Button>
          )}
          <Button onClick={applyTags}>
            {currentTags.length > 0 ? "Apply" : "Close"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
