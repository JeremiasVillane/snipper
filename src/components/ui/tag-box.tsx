"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChevronsUpDown, Edit2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalAction,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";

const DEFAULT_COLOR = "#9A71F4";

interface TagType {
  id: string;
  name: string;
  color?: string;
}

interface TagBoxProps
  extends BadgeProps,
    Omit<
      React.ComponentPropsWithoutRef<"div">,
      "onChange" | "value" | "defaultValue" | "color"
    > {
  /**
   * An array of currently selected tags (controlled mode).
   */
  value?: TagType[];

  /**
   * Initial array of selected tags for uncontrolled mode.
   */
  defaultValue?: TagType[];

  /**
   * Callback function invoked when the selected tags change.
   * It receives an array of the new selected tags.
   */
  onChange?: (tags: TagType[]) => void;

  /** Name attribute for the hidden input, for form submission. */
  name?: string;

  /**
   * An array of all tags available to the user.
   * These are used for suggestions and management.
   */
  userTags?: TagType[];

  /**
   * Callback function invoked when a user edits an existing tag
   * through the "Manage tags" dialog.
   * It receives the updated tag object.
   */
  onTagEdit?: (tag: TagType) => void;

  /**
   * Callback function invoked when a user removes an existing tag
   * through the "Manage tags" dialog.
   * It receives the tag object to be removed.
   */
  onTagRemove?: (tag: TagType) => void;

  /**
   * Maximum number of tags that can be selected.
   * If set, the input will be disabled once this limit is reached.
   */
  maxTags?: number;

  /**
   * Determines if the max tags count should be displayed.
   * @default false */
  showMaxTags?: boolean;

  /**
   * Placeholder text to display in the tag input field.
   * @default "Type or select tags..." */
  placeholder?: string;

  /**
   * Placeholder text to display in the tag input field when the max tags limit is reached.
   * @default "Max tags reached" */
  placeholderWhenFull?: string;

  /**
   * Optional CSS class name to apply to the root element of the TagBox.
   */
  className?: string;

  /**
   * Optional CSS class name to apply to the tag element.
   */
  tagClassName?: string;

  /**
   * Determines if tags should have customizable colors.
   * @default true */
  withColor?: boolean;

  /**
   * Optional flag to automatically open the popover when the input is focused.
   * @default true */
  openOnFocus?: boolean;

  /** Optional flag to enable the creation of new tags directly from the input.
   * If false, only existing `userTags` can be selected.
   * @default true */
  enableCreate?: boolean;

  /** Optional flag to enable the "Manage tags" dialog.
   * @default true */
  enableManage?: boolean;

  /** Optional prop to control the position of the selected tags relative to the input field.
   * @default "bottom" */
  tagsPosition?: "bottom" | "inner" | "top";

  /**
   * Optional flag to disable the TagBox component.
   * @default false */
  disabled?: boolean;
}

const getTagStyle = (color?: string) => {
  if (!color) return {};
  return {
    borderColor: `${color}`,
    backgroundColor: `${color}30`,
    color,
  };
};

type PopoverOption =
  | { type: "tag"; data: TagType; name: string; idPrefix: string }
  | { type: "create"; name: string; idPrefix: string; data: { name: string } };

function TagBox({
  // Controlled/uncontrolled state
  value: valueProp,
  defaultValue,
  onChange: onChangeProp,

  // Tag data and management callbacks
  userTags: userTagsProp = [],
  onTagEdit: onTagEditProp,
  onTagRemove: onTagRemoveProp,

  // Behavior props
  maxTags,
  showMaxTags = false,
  withColor = true,
  openOnFocus = true,
  enableCreate = true,
  enableManage = true,
  tagsPosition = "bottom",

  // UI Text
  placeholder = "Type or select tags...",
  placeholderWhenFull = "Max tags reached",

  // Styling props
  className,
  tagClassName,

  // Badge props
  variant,
  size,
  shape,
  leftElement,
  rightElement,

  // Form integration props
  id, // Inherited from div attributes, applied to root
  name: formName, // For the hidden input

  // Disabled state
  disabled: disabledProp,

  // Other div props (e.g., style, data-*, aria-*)
  ...restDivProps
}: TagBoxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);

  const [internalSelectedTags, setInternalSelectedTags] = React.useState<
    TagType[]
  >(defaultValue || []);
  const isControlled = valueProp !== undefined;
  const currentSelectedTags = isControlled ? valueProp : internalSelectedTags;

  const popoverContentRef = React.useRef<HTMLDivElement>(null);

  const updateSelectedTags = (newTags: TagType[]) => {
    if (!isControlled) {
      setInternalSelectedTags(newTags);
    }
    onChangeProp?.(newTags);
  };

  React.useEffect(() => {
    if (open && inputRef.current && focusedIndex === -1) {
      // Only focus input if no item in list is focused
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [open, focusedIndex]);

  React.useEffect(() => {
    const handleScroll = (event: Event) => {
      if (open) {
        if (
          popoverContentRef.current &&
          popoverContentRef.current.contains(event.target as Node)
        ) {
          return;
        }
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("scroll", handleScroll, true);
    }
    return () => {
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  const addTag = (tagName: string) => {
    if (!!maxTags && maxTags > 0 && currentSelectedTags.length >= maxTags) {
      return;
    }

    const trimmedName = tagName.trim();
    if (!trimmedName) return;

    const existingUserTag = userTagsProp.find(
      (t) => t.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    const isAdded = currentSelectedTags.some(
      (t) => t.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (isAdded) {
      setInputValue("");
      setOpen(false);
      return;
    }

    let newTagToAdd: TagType;
    if (existingUserTag) {
      newTagToAdd = existingUserTag;
    } else {
      newTagToAdd = {
        id: "",
        name: trimmedName,
      };
      if (withColor) {
        newTagToAdd.color = DEFAULT_COLOR;
      }
    }
    updateSelectedTags([...currentSelectedTags, newTagToAdd]);
    setInputValue("");
    setOpen(false);
  };

  const removeTag = (tagName: string) => {
    updateSelectedTags(currentSelectedTags.filter((t) => t.name !== tagName));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setOpen(newValue.length > 0);
  };

  const availableTags = React.useMemo(
    () =>
      userTagsProp.filter(
        (tag) =>
          !currentSelectedTags.some(
            (t) => t.name.toLowerCase() === tag.name.toLowerCase(),
          ) && tag.name.toLowerCase().includes(inputValue.toLowerCase()),
      ),
    [userTagsProp, currentSelectedTags, inputValue],
  );

  const showCreateOption = React.useMemo(
    () =>
      enableCreate &&
      inputValue.trim() &&
      !userTagsProp.some(
        (tag) => tag.name.toLowerCase() === inputValue.trim().toLowerCase(),
      ) &&
      !currentSelectedTags.some(
        (tag) => tag.name.toLowerCase() === inputValue.trim().toLowerCase(),
      ),
    [inputValue, userTagsProp, currentSelectedTags],
  );

  const popoverOptions = React.useMemo((): PopoverOption[] => {
    const options: PopoverOption[] = [];
    availableTags.forEach((tag) => {
      options.push({ type: "tag", data: tag, name: tag.name, idPrefix: "tag" });
    });
    if (showCreateOption) {
      const createName = inputValue.trim();
      options.push({
        type: "create",
        name: createName,
        data: { name: createName },
        idPrefix: "create",
      });
    }
    return options;
  }, [availableTags, showCreateOption, inputValue]);

  const getOptionId = (optionIndex: number): string | undefined => {
    if (optionIndex < 0 || optionIndex >= popoverOptions.length)
      return undefined;
    const option = popoverOptions[optionIndex];
    const uniquePart =
      option.type === "tag" ? option.data.id || option.data.name : option.name;
    // Sanitize uniquePart for ID: replace spaces and convert to lowercase
    const sanitizedUniquePart = uniquePart.replace(/\s+/g, "-").toLowerCase();
    return `tagbox-${id || "popover"}-option-${option.idPrefix}-${sanitizedUniquePart}-${optionIndex}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabledProp) return;

    const { key } = e;

    if (
      tagsPosition === "inner" &&
      e.key === "Backspace" &&
      inputValue === "" &&
      currentSelectedTags.length > 0
    ) {
      e.preventDefault();
      removeTag(currentSelectedTags[currentSelectedTags.length - 1].name);
      return;
    }

    if (key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
        inputRef.current?.focus();
      }
      return;
    }

    if (key === "Tab" && open) {
      setOpen(false); // Allow tabbing out, Popover's onOpenChange will reset focusedIndex
      return;
    }

    const numOptions = popoverOptions.length;

    if (key === "ArrowDown" || key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        if (inputValue.length > 0 && numOptions > 0) {
          setOpen(true);
          setFocusedIndex(key === "ArrowDown" ? 0 : numOptions - 1);
        } else if (inputValue.length === 0 && numOptions > 0) {
          setOpen(true);
          setFocusedIndex(key === "ArrowDown" ? 0 : numOptions - 1);
        }
      } else {
        if (numOptions === 0) {
          setFocusedIndex(-1);
          return;
        }
        let nextIndex = focusedIndex;
        if (key === "ArrowDown") {
          nextIndex = focusedIndex + 1;
          if (nextIndex >= numOptions) nextIndex = 0;
        } else {
          // ArrowUp
          nextIndex = focusedIndex - 1;
          if (nextIndex < 0) nextIndex = numOptions - 1;
        }
        setFocusedIndex(nextIndex);
      }
      return;
    }

    if (key === "Enter") {
      if (open && focusedIndex >= 0 && focusedIndex < numOptions) {
        e.preventDefault();
        const selectedOption = popoverOptions[focusedIndex];
        addTag(selectedOption.name);
        inputRef.current?.focus();
      } else if (inputValue.trim()) {
        e.preventDefault();
        addTag(inputValue.trim());
        inputRef.current?.focus();
      }
      return;
    }
  };

  React.useEffect(() => {
    // When input value changes (user is typing), or popover opens/closes with input
    // reset the focused index so that ArrowDown starts from the top.
    if (open) {
      setFocusedIndex(-1);
    }
  }, [inputValue, open]);

  React.useEffect(() => {
    if (
      open &&
      focusedIndex !== -1 &&
      popoverContentRef.current &&
      popoverOptions[focusedIndex]
    ) {
      const optionId = getOptionId(focusedIndex);
      if (optionId) {
        const focusedElement =
          popoverContentRef.current.querySelector<HTMLElement>(
            `#${CSS.escape(optionId)}`,
          );
        if (focusedElement) {
          focusedElement.scrollIntoView({
            behavior: "auto",
            block: "nearest",
          });
        }
      }
    }
  }, [focusedIndex, open, popoverOptions]);

  const onPopoverOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  };

  const activeDescendantId = React.useMemo(() => {
    if (focusedIndex === -1 || !open) return undefined;
    return getOptionId(focusedIndex);
  }, [focusedIndex, open, popoverOptions]);

  const allTagsForManagement = Array.from(
    new Map(
      [...userTagsProp, ...currentSelectedTags].map((tag) => [
        tag.id || tag.name,
        tag,
      ]),
    ).values(),
  );

  const isInputDisabled =
    (!!maxTags && currentSelectedTags.length >= maxTags) || !!disabledProp;
  const popoverTriggerId = id ? `${id}-trigger` : undefined;
  const popoverContentGeneratedId = id
    ? `${id}-popover-content`
    : "tagbox-popover-content";

  const tagList = (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        tagsPosition === "inner"
          ? "contents"
          : tagsPosition === "bottom"
            ? "mt-2"
            : "mb-2",
      )}
    >
      {currentSelectedTags.map((tag) => (
        <Badge
          key={tag.id || tag.name}
          shape={shape ?? "pill"}
          style={withColor && tag.color ? getTagStyle(tag.color) : {}}
          rightElement={
            rightElement ?? (
              <X
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") removeTag(tag.name);
                }}
                onClick={() => removeTag(tag.name)}
                className="transition-colors hover:text-destructive"
                aria-label={`Remove tag ${tag.name}`}
              />
            )
          }
          className={tagClassName}
          variant={variant}
          size={size}
          leftElement={leftElement}
          disabled={disabledProp}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );

  return (
    <div
      {...restDivProps}
      className={cn(
        "flex w-full flex-col",
        tagsPosition === "top" && "flex-col-reverse",
        className,
      )}
    >
      {!!formName && (
        <input
          type="hidden"
          name={formName}
          value={JSON.stringify(
            currentSelectedTags.map(({ id: tagId, name: tagName, color }) => ({
              id: tagId,
              name: tagName,
              ...(withColor && color && { color }),
            })),
          )}
        />
      )}

      <PopoverPrimitive.Root open={open} onOpenChange={onPopoverOpenChange}>
        <PopoverPrimitive.Trigger
          onClick={(e) => {
            e.preventDefault();
            !disabledProp && openOnFocus && setOpen(true);
          }}
          asChild
          id={popoverTriggerId}
        >
          <div
            className={cn(
              "group relative w-full",
              tagsPosition === "inner"
                ? "flex h-fit flex-wrap items-center gap-x-1.5 gap-y-1 rounded-md border border-input bg-background py-1 pl-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                : "",
            )}
          >
            {tagsPosition === "inner" &&
              currentSelectedTags.length > 0 &&
              tagList}

            <div
              className={cn(
                tagsPosition === "inner"
                  ? "relative flex-1 self-stretch"
                  : "relative w-full",
              )}
            >
              <Input
                ref={inputRef}
                id={id}
                placeholder={
                  disabledProp
                    ? ""
                    : !!maxTags && currentSelectedTags.length >= maxTags
                      ? tagsPosition !== "inner"
                        ? placeholderWhenFull
                        : ""
                      : placeholder
                }
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => !disabledProp && openOnFocus && setOpen(true)}
                onKeyDown={handleKeyDown}
                endInline={
                  showMaxTags && maxTags
                    ? `${currentSelectedTags.length}/${maxTags}`
                    : ""
                }
                endIcon={
                  <ChevronsUpDown
                    role="button"
                    onClick={() => {
                      !disabledProp && setOpen(true);
                    }}
                    className={cn(
                      "size-4 cursor-default opacity-50",
                      !disabledProp &&
                        "cursor-pointer hover:opacity-80 active:opacity-100",
                    )}
                    aria-label="Toggle tag selection"
                  />
                }
                className={cn(
                  tagsPosition === "inner"
                    ? "h-7 border-0 pl-0.5 focus-within:ring-0"
                    : "w-full",
                )}
                disabled={isInputDisabled}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls={open ? popoverContentGeneratedId : undefined}
                aria-activedescendant={activeDescendantId}
              />
            </div>
          </div>
        </PopoverPrimitive.Trigger>

        {!!maxTags &&
          currentSelectedTags.length >= maxTags &&
          tagsPosition === "inner" && (
            <div className="text-sm text-destructive">
              {placeholderWhenFull}
            </div>
          )}

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            ref={popoverContentRef}
            id={popoverContentGeneratedId}
            role="listbox"
            aria-label={id ? `Suggestions for ${id}` : "Tag suggestions"}
            className="z-50 overflow-hidden rounded-md border bg-popover shadow-md outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            sideOffset={4}
            align="start"
            side="bottom"
            onOpenAutoFocus={(e) => e.preventDefault()}
            style={{
              width: "var(--radix-popover-trigger-width)",
            }}
          >
            <div className="rounded-non flex h-full w-full flex-col overflow-hidden bg-popover text-popover-foreground">
              <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                {popoverOptions.length > 0 ? (
                  <section className="max-h-[200px] overflow-auto p-1 text-foreground">
                    {popoverOptions.map((option, index) => {
                      const optionId = getOptionId(index);
                      const isFocused = focusedIndex === index;
                      return (
                        <article
                          key={optionId || index} // Fallback key
                          id={optionId}
                          role="option"
                          aria-selected={isFocused}
                          onClick={(e) => {
                            e.preventDefault();
                            addTag(option.name);
                            inputRef.current?.focus();
                            setOpen(false);
                          }}
                          onMouseEnter={() => setFocusedIndex(index)}
                          className={cn(
                            "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted/80 data-[focused=true]:bg-muted",
                            option.type === "create" && "text-muted-foreground",
                          )}
                          data-focused={isFocused}
                          tabIndex={-1}
                        >
                          <div className="flex items-center">
                            {withColor &&
                              (option.type === "tag" && option.data.color ? (
                                <div
                                  className="mr-2 size-4 rounded-full"
                                  style={{ backgroundColor: option.data.color }}
                                />
                              ) : option.type === "create" ? (
                                <div className="mr-2 size-4 rounded-full bg-gray-300" />
                              ) : null)}
                            {option.type === "create"
                              ? `Create "${option.name}"`
                              : option.name}
                          </div>
                        </article>
                      );
                    })}
                  </section>
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {inputValue ? "No matching tags" : "No tags found"}
                  </div>
                )}

                {enableManage && (
                  <>
                    <Separator />

                    <section className="overflow-hidden p-1 text-foreground">
                      <article className="relative flex select-none items-center gap-2 rounded-sm text-sm outline-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          iconLeft={<Edit2 />}
                          iconAnimation="zoomIn"
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenDialog(true);
                            setOpen(false); // Close popover when opening dialog
                          }}
                          className="flex h-8 w-full justify-start px-2"
                          tabIndex={0}
                        >
                          Manage tags
                        </Button>
                      </article>
                    </section>
                  </>
                )}
              </div>
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      {["top", "bottom"].includes(tagsPosition) &&
        currentSelectedTags.length > 0 &&
        tagList}

      <Modal open={openDialog} onOpenChange={setOpenDialog} separatedFooter>
        <ModalContent>
          <ModalTitle>Manage Tags</ModalTitle>
          <ModalDescription>Edit or delete existing tags</ModalDescription>

          <ModalBody>
            {allTagsForManagement.map((tag) => (
              <TagForm
                key={tag.id || tag.name}
                {...tag}
                withColor={withColor}
                {...{ variant, size, shape, leftElement, rightElement }}
                onDelete={() => {
                  if (tag.id && tag.id.length > 0) onTagRemoveProp?.(tag);
                  removeTag(tag.name);
                }}
                onSubmit={(formData) => {
                  const newNameFromForm = formData.name;

                  const updatedTagFromForm: TagType = {
                    ...tag,
                    name: newNameFromForm.trim(),
                  };

                  if (withColor) {
                    const colorFromForm = formData.color;
                    updatedTagFromForm.color = colorFromForm || DEFAULT_COLOR;
                  }

                  if (tag.id && tag.id.length > 0) {
                    onTagEditProp?.(updatedTagFromForm);
                  }

                  const newSelectedValues = currentSelectedTags.map(
                    (selectedTag) =>
                      (selectedTag.id && selectedTag.id === tag.id) ||
                      selectedTag.name === tag.name
                        ? updatedTagFromForm
                        : selectedTag,
                  );
                  updateSelectedTags(newSelectedValues);
                }}
              />
            ))}
          </ModalBody>

          <ModalFooter>
            <ModalClose variant="outline">Close</ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

type TagFormProps = {
  color?: string;
  onSubmit: (formData: Omit<TagType, "id">) => void;
  onDelete: () => void;
  withColor: boolean;
} & TagType &
  Omit<BadgeProps, "disabled">;

const TagForm = ({
  id,
  name,
  color,
  onSubmit,
  onDelete,
  withColor,
  // Badge props
  variant,
  size,
  shape,
  leftElement,
  rightElement,
}: TagFormProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [accordionValue, setAccordionValue] = React.useState("");
  const [nameValue, setNameValue] = React.useState(name);
  const [colorValue, setColorValue] = React.useState(
    withColor ? color || DEFAULT_COLOR : undefined,
  );

  React.useEffect(() => {
    if (accordionValue) inputRef.current?.focus();
  }, [accordionValue]);

  const initialColorForCompare = withColor ? color || DEFAULT_COLOR : undefined;
  const isModified =
    name !== nameValue || (withColor && initialColorForCompare !== colorValue);

  return (
    <Accordion
      type="single"
      variant="contained"
      trigger="plus-minus"
      triggerPosition="left"
      collapsible
      value={accordionValue}
      onValueChange={setAccordionValue}
    >
      <AccordionItem value={name}>
        <div className="flex items-center justify-between">
          <Badge
            shape={shape ?? "pill"}
            style={withColor && color ? getTagStyle(color) : {}}
            {...{ variant, size, leftElement, rightElement }}
          >
            {name}
          </Badge>
          <div className="flex items-center gap-4 py-2">
            <AccordionTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-8 text-foreground/80 hover:bg-muted hover:text-foreground",
              )}
            >
              Edit
            </AccordionTrigger>
            <Modal
              mode="alertdialog"
              variant="destructive"
              responsive={false}
              align="left"
              withIcon
            >
              <ModalTrigger
                variant="destructive"
                size="sm"
                className="h-8 w-20"
              >
                Delete
              </ModalTrigger>
              <ModalContent>
                <ModalTitle>Are you sure?</ModalTitle>
                <ModalDescription className="flex flex-col">
                  <span>
                    You are about to delete the tag:{" "}
                    <span className="font-semibold">{name}</span>.
                  </span>
                  <span>This action cannot be undone.</span>
                </ModalDescription>
                <ModalFooter>
                  <ModalClose>Cancel</ModalClose>
                  <ModalAction onClick={onDelete}>Delete</ModalAction>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </div>
        <AccordionContent className="ps-0">
          <section className="flex items-end gap-4 border-l border-dashed pl-3 pt-1">
            <div className="w-full space-y-2">
              <label htmlFor={`name-${id || name}`}>Name</label>
              <Input
                ref={inputRef}
                id={`name-${id || name}`}
                name="name"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                minLength={2}
                maxLength={20}
                showMaxLength="inside"
                className="h-8"
                required
              />
            </div>
            {withColor && (
              <div className="space-y-2">
                <label htmlFor={`color-${id || name}`}>Color</label>
                <ColorPicker
                  id={`color-${id || name}`}
                  name="color"
                  value={colorValue || DEFAULT_COLOR}
                  onChange={setColorValue}
                  className="size-8 cursor-pointer p-1"
                />
              </div>
            )}
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onSubmit({ name: nameValue, color: colorValue });
                setAccordionValue("");
              }}
              className="h-8 w-28"
              disabled={!isModified}
            >
              Save
            </Button>
          </section>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { getTagStyle, TagBox };
export type { TagType, TagBoxProps };
