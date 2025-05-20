"use client";

import * as React from "react";
import { ChevronsUpDown, Edit2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEFAULT_COLOR = "#9A71F4";

interface Tag {
  id: string;
  name: string;
  color: string;
}

const getTagStyle = (color: string) => ({
  borderColor: `${color}`,
  backgroundColor: `${color}30`,
  color,
});

/**
 * Props for the TagBox component.
 */
interface TagBoxProps {
  /**
   * An array of currently selected tags.
   * @default [] */
  value?: Tag[];
  /**
   * Callback function invoked when the selected tags change.
   * It receives an array of the new selected tags.
   */
  onChange?: (tags: Tag[]) => void;
  /**
   * An array of all tags available to the user.
   * These are used for suggestions and management.
   */
  userTags: Tag[];
  /**
   * Callback function invoked when a user edits an existing tag
   * through the "Manage tags" dialog.
   * It receives the updated tag object.
   */
  onTagEdit: (tag: Tag) => void;
  /**
   * Callback function invoked when a user removes an existing tag
   * through the "Manage tags" dialog.
   * It receives the tag object to be removed.
   */
  onTagRemove: (tag: Tag) => void;
  /**
   * Determines if the tag suggestion combobox should open when the input field gains focus.
   * @default true */
  openOnFocus?: boolean;
  maxTags?: number;
  showMaxTags?: boolean;
  /**
   * Placeholder text to display in the tag input field.
   * @default "Type or select tags..." */
  placeholder?: string;
  placeholderWhenFull?: string;
  /**
   * Optional CSS class name to apply to the root element of the TagBox.
   */
  className?: string;
}

function TagBox({
  value = [],
  onChange,
  userTags,
  onTagEdit,
  onTagRemove,
  openOnFocus = true,
  maxTags,
  showMaxTags = false,
  placeholder = "Type or select tags...",
  placeholderWhenFull = "Max tags reached",
  className,
}: TagBoxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const comboboxRef = React.useRef<HTMLDivElement>(null);
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>("");

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpenCombobox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTag = (tagName: string) => {
    if (!!maxTags && maxTags > 0 && value.length >= maxTags) {
      return;
    }

    const trimmedName = tagName.trim();
    if (!trimmedName) return;

    const isExisting = userTags.some(
      (t) => t.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    const isAdded = value.some(
      (t) => t.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (isAdded) {
      setInputValue("");
      return;
    }

    const newTag = isExisting
      ? userTags.find(
          (t) => t.name.toLowerCase() === trimmedName.toLowerCase(),
        )!
      : { id: "", name: trimmedName, color: DEFAULT_COLOR };

    onChange?.([...value, newTag]);
    setInputValue("");
    setOpenCombobox(false);
  };

  const removeTag = (tagName: string) => {
    onChange?.(value.filter((t) => t.name !== tagName));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setOpenCombobox(e.target.value.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  const availableTags = userTags.filter(
    (tag) =>
      !value.some((t) => t.name === tag.name) &&
      tag.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const showCreateOption =
    inputValue.trim() &&
    !userTags.some(
      (tag) => tag.name.toLowerCase() === inputValue.trim().toLowerCase(),
    );

  const allTags = Array.from(
    new Map([...userTags, ...value].map((tag) => [tag.name, tag])).values(),
  );

  return (
    <div className={cn("w-full", className)} ref={comboboxRef}>
      <Input
        ref={inputRef}
        placeholder={
          !!maxTags && value.length >= maxTags
            ? placeholderWhenFull
            : placeholder
        }
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => openOnFocus && setOpenCombobox(true)}
        endInline={showMaxTags && maxTags ? `${value.length}/${maxTags}` : ""}
        endIcon={
          <ChevronsUpDown
            className="size-4 cursor-pointer opacity-50 hover:opacity-80 active:opacity-100"
            onClick={() => setOpenCombobox(!openCombobox)}
          />
        }
        className="w-full"
        disabled={!!maxTags && value.length >= maxTags}
      />

      {openCombobox && (
        <div className="relative">
          <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
            <Command loop>
              <CommandList>
                {availableTags.length > 0 || showCreateOption ? (
                  <CommandGroup className="max-h-[200px] overflow-auto">
                    {availableTags.map((tag) => (
                      <CommandItem
                        key={tag.name}
                        value={tag.name}
                        onSelect={() => addTag(tag.name)}
                      >
                        <div className="flex items-center">
                          <div
                            className="mr-2 size-4 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                        </div>
                      </CommandItem>
                    ))}
                    {showCreateOption && (
                      <CommandItem
                        onSelect={() => addTag(inputValue.trim())}
                        className="text-muted-foreground"
                      >
                        <div className="flex items-center">
                          <div className="mr-2 size-4 rounded-full bg-gray-300" />
                          Create "{inputValue.trim()}"
                        </div>
                      </CommandItem>
                    )}
                  </CommandGroup>
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No tags found
                  </div>
                )}
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem className="cursor-pointer">
                    <Button
                      variant="ghost"
                      iconLeft={<Edit2 />}
                      iconAnimation="spinUp"
                      onClick={() => setOpenDialog(true)}
                      className="flex h-5 w-full justify-start px-0"
                    >
                      Manage tags
                    </Button>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        {value.map(({ name, color }) => (
          <Badge
            key={name}
            variant="outline"
            style={getTagStyle(color)}
            className="pr-2"
          >
            <div className="flex items-center">
              {name}
              <button
                type="button"
                onClick={() => removeTag(name)}
                className="ml-1 transition-colors hover:text-destructive"
                aria-label={`Remove tag ${name}`}
              >
                <X className="size-3" />
              </button>
            </div>
          </Badge>
        ))}
      </div>

      <Credenza open={openDialog} onOpenChange={setOpenDialog}>
        <CredenzaContent className="flex max-h-[90vh] flex-col">
          <CredenzaHeader>
            <CredenzaTitle>Manage Tags</CredenzaTitle>
            <CredenzaDescription>
              Edit or delete existing tags
            </CredenzaDescription>
          </CredenzaHeader>

          <CredenzaBody className="-ml-2 -mr-5 overflow-scroll px-6 py-2">
            {allTags.map((tag) => (
              <TagForm
                key={tag.id || tag.name}
                {...tag}
                onDelete={() => {
                  if (tag.id.length > 0) onTagRemove(tag);
                  removeTag(tag.name);
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(
                    e.currentTarget as HTMLFormElement,
                  );
                  const name = formData.get("name") as string;
                  const color = formData.get("color") as string;

                  const updatedTag = {
                    ...tag,
                    name: name.trim(),
                    color,
                  };

                  if (tag.id.length > 0) onTagEdit(updatedTag);

                  const newValue = value.map((t) =>
                    t.name === tag.name ? updatedTag : t,
                  );
                  onChange?.(newValue);
                }}
              />
            ))}
          </CredenzaBody>
          <CredenzaFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Close
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </div>
  );
}

interface TagFormProps extends Tag {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
}

const TagForm = ({
  name = "",
  color = DEFAULT_COLOR,
  onSubmit,
  onDelete,
}: TagFormProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [accordionValue, setAccordionValue] = React.useState("");
  const [nameValue, setNameValue] = React.useState(name);
  const [colorValue, setColorValue] = React.useState(color);

  React.useEffect(() => {
    if (accordionValue) inputRef.current?.focus();
  }, [accordionValue]);

  const isModified = name !== nameValue || color !== colorValue;

  return (
    <Accordion
      type="single"
      variant="contained"
      collapsible
      value={accordionValue}
      onValueChange={setAccordionValue}
    >
      <AccordionItem value={name}>
        <div className="flex items-center justify-between">
          <Badge variant="outline" style={getTagStyle(color)}>
            {name}
          </Badge>
          <div className="flex items-center gap-4">
            <AccordionTrigger className="gap-1 text-foreground/80 hover:no-underline hover:text-foreground">
              Edit
            </AccordionTrigger>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="h-8 w-20">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription className="flex flex-col">
                    <span>
                      You are about to delete the tag:{" "}
                      <span className="font-semibold">{name}</span>.
                    </span>
                    <span>This action cannot be undone.</span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className={buttonVariants({ variant: "destructive" })}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <AccordionContent>
          <form
            onSubmit={onSubmit}
            className="flex items-end gap-4 border-l border-dashed pl-3 pt-1"
          >
            <div className="w-full space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                ref={inputRef}
                id="name"
                name="name"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                minLength={2}
                maxLength={12}
                showMaxLength="inside"
                className="h-8"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                type="color"
                value={colorValue}
                onChange={(e) => setColorValue(e.target.value)}
                className="size-8 cursor-pointer p-1"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="h-8 w-28"
              disabled={!isModified}
            >
              Save
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { TagBox, getTagStyle };
export type { TagBoxProps, Tag };
