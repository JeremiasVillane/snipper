import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Tag } from "lucide-react";
import { useState } from "react";

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
        : [...prevTags, tag]
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
    <Credenza
      open={open}
      onOpenChange={(isOpen) => {
        isOpen ? setCurrentTags(selectedTags) : setCurrentTags([]);
        setOpen(isOpen);
      }}
    >
      <CredenzaTrigger asChild>
        <Button
          variant="outline"
          iconLeft={<Tag className="size-4" />}
          iconAnimation="spinRight"
          className="gap-2"
        >
          Tags
          {selectedTags.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {selectedTags.length}
            </Badge>
          )}
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Filter by Tags</CredenzaTitle>
          <CredenzaDescription>
            Select tags to filter your links
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="flex flex-wrap gap-2 py-4">
          {availableTags.length > 0 ? (
            availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={currentTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer select-none"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))
          ) : (
            <p className="text-muted-foreground">No tags available</p>
          )}
        </CredenzaBody>
        <CredenzaFooter>
          <Button variant="outline" onClick={clearTags}>
            Clear All
          </Button>
          <Button onClick={applyTags}>
            {currentTags.length > 0 ? "Apply" : "Close"}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
