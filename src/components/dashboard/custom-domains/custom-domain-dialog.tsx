"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ban, InfoIcon, ListCheck, MoreHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { Tooltip as ReactTooltip } from "react-tooltip";

import {
  createCustomDomain,
  updateCustomDomain,
} from "@/lib/actions/custom-domains";
import { getSafeActionResponse } from "@/lib/actions/safe-action-helpers";
import {
  CreateCustomDomainInput,
  createCustomDomainSchema,
} from "@/lib/schemas";
import {
  CustomDomainFromRepository,
  ShortLinkFromRepository,
} from "@/lib/types";
import { isDeepEqual } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/simple-toast";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ShortLinkSelector } from "./short-link-selector";

interface CustomDomainDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: CustomDomainFromRepository;
  userShortLinks: ShortLinkFromRepository[];
}

export function CustomDomainDialog({
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  initialData,
  userShortLinks,
}: CustomDomainDialogProps) {
  const [showLinkSelector, setShowLinkSelector] = useState(false);

  const [internalOpen, setInternalOpen] = useState(
    controlledOpen === undefined ? false : controlledOpen,
  );
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen || setInternalOpen;

  const initialFormValuesRef = useRef<CreateCustomDomainInput | null>(null);

  const calculateFormValues = (
    data: CustomDomainFromRepository | undefined,
  ): CreateCustomDomainInput => {
    return {
      domain: data?.domain ?? "",
      isLinkHubEnabled: data?.isLinkHubEnabled ?? false,
      linkHubTitle: data?.linkHubTitle ?? null,
      linkHubDescription: data?.linkHubDescription ?? null,
      shortLinkIds: data?.shortLinks?.map((link) => link.id) ?? [],
    };
  };

  const form = useForm<CreateCustomDomainInput>({
    resolver: zodResolver(createCustomDomainSchema),
    mode: "onTouched",
    defaultValues: useMemo(
      () => calculateFormValues(initialData),
      [initialData],
    ),
  });

  const {
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { isSubmitting, isDirty },
  } = form;

  const formValues = watch();

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setInternalOpen(controlledOpen);
    }
  }, [controlledOpen]);

  useEffect(() => {
    if (isOpen) {
      const values = calculateFormValues(initialData);
      reset(values);
      initialFormValuesRef.current = values;
    } else {
      initialFormValuesRef.current = null;
      setShowLinkSelector(false);
    }
  }, [initialData, isOpen, reset]);

  const onSubmit = async (formData: CreateCustomDomainInput) => {
    try {
      const { success, error } = !!initialData
        ? await updateCustomDomain({ id: initialData.id, ...formData }).then(
            (res) => getSafeActionResponse(res),
          )
        : await createCustomDomain(formData).then((res) =>
            getSafeActionResponse(res),
          );

      toast({
        title: success ? "Success!" : "Error",
        description: success ? "Your custom domain has been saved" : error,
        type: success ? "success" : "error",
      });

      if (success) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error saving custom domain:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save custom domain",
        type: "error",
      });
    }
  };

  const selectedFullLinks = useMemo(() => {
    const selectedIds = formValues.shortLinkIds ?? [];
    return userShortLinks.filter((link) => selectedIds.includes(link.id));
  }, [userShortLinks, formValues.shortLinkIds]);

  const isTrulyDirty = useMemo(() => {
    if (!initialData) {
      return isDirty || (formValues.shortLinkIds ?? []).length > 0;
    }

    if (!initialFormValuesRef.current) {
      return isDirty;
    }

    const current = formValues;
    const initial = initialFormValuesRef.current;

    if (current.domain !== initial.domain) return true;
    if (current.isLinkHubEnabled !== initial.isLinkHubEnabled) return true;
    if ((current.linkHubTitle ?? null) !== (initial.linkHubTitle ?? null))
      return true;
    if (
      (current.linkHubDescription ?? null) !==
      (initial.linkHubDescription ?? null)
    )
      return true;

    const currentLinkIdsSorted = (current.shortLinkIds ?? []).slice().sort();
    const initialLinkIdsSorted = (initial.shortLinkIds ?? []).slice().sort();

    if (!isDeepEqual(currentLinkIdsSorted, initialLinkIdsSorted)) return true;

    return false;
  }, [formValues, initialData, initialFormValuesRef.current, isDirty]);

  const handleRemoveLink = (linkId: string) => {
    const currentIds = formValues.shortLinkIds ?? [];
    setValue(
      "shortLinkIds",
      currentIds.filter((id) => id !== linkId),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      {!!children && <CredenzaTrigger asChild>{children}</CredenzaTrigger>}
      <CredenzaContent className="max-w-full md:max-w-[500px]">
        <CredenzaHeader>
          <CredenzaTitle>
            {!!initialData ? "Edit" : "Create"} Custom Domain
          </CredenzaTitle>
        </CredenzaHeader>

        <CredenzaBody>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subdomain Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="my-subdomain"
                        autoComplete="off"
                        minLength={2}
                        maxLength={12}
                        showMaxLength="inside"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2 rounded-lg border p-4">
                <div className="flex flex-col items-start gap-1">
                  <Label className="text-base">Short Links</Label>
                  <div className="text-[0.8rem] text-muted-foreground">
                    These links will appear in your Link Hub if activated.
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    iconLeft={<ListCheck />}
                    iconAnimation="zoomIn"
                    onClick={() => setShowLinkSelector(true)}
                    className="ml-auto mt-2 h-8"
                  >
                    Select links{" "}
                    {selectedFullLinks.length > 0
                      ? `(${selectedFullLinks.length})`
                      : ""}
                  </Button>
                </div>

                <div className="rounded border">
                  <Table>
                    {selectedFullLinks.length > 0 && (
                      <TableHeader>
                        <TableRow>
                          <TableHead>Short Code</TableHead>
                          <TableHead>Original URL</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                    )}

                    <TableBody>
                      {selectedFullLinks.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center italic text-muted-foreground"
                          >
                            There are no short links associated with this
                            Subdomain.
                          </TableCell>
                        </TableRow>
                      ) : (
                        selectedFullLinks.map((link) => (
                          <TableRow key={link.id}>
                            <TableCell className="max-w-[100px] truncate text-xs text-foreground/80">
                              {link.shortCode}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              <span
                                data-tooltip-id="url-tooltip"
                                data-tooltip-content={link.originalUrl}
                              >
                                {link.originalUrl}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                  >
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleRemoveLink(link.id)}
                                    className="group text-destructive focus:text-white"
                                  >
                                    <Ban className="mr-2 size-4 group-hover:scale-105" />{" "}
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  <ReactTooltip
                    id="url-tooltip"
                    className="lg:max-xl max-w-sm whitespace-normal break-words md:max-w-md"
                  />
                </div>
              </div>

              <FormField
                control={control}
                name="isLinkHubEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-col rounded-lg border p-4">
                    <section className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Link Hub</FormLabel>
                        <FormDescription>
                          Enable a link hub for this subdomain.{" "}
                          <Popover>
                            <PopoverTrigger>
                              <InfoIcon className="mb-1 inline size-4 text-primary" />
                            </PopoverTrigger>
                            <PopoverContent>
                              {" "}
                              <div className="space-y-2 rounded-md border bg-muted/30 p-4 shadow-md">
                                <p className="text-sm text-muted-foreground">
                                  A link hub is a personalized page that
                                  displays all your shortened links in one
                                  place. It can be shared with others, allowing
                                  them to access all your links easily.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  This feature is useful for sharing multiple
                                  links with a single URL, such as in social
                                  media bios or email signatures.
                                </p>{" "}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                    </section>

                    {form.watch("isLinkHubEnabled") && (
                      <section className="ml-3 space-y-4 border-l border-dashed pl-3 pt-2">
                        <FormField
                          control={control}
                          name="linkHubTitle"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Link Hub Title</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value ?? ""}
                                  maxLength={25}
                                  showMaxLength="inside"
                                  placeholder="Ingresa un título para tu link hub"
                                  autoComplete="off"
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormDescription>
                                This title will be displayed on your link hub
                                page.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name="linkHubDescription"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Link Hub Description</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value ?? ""}
                                  maxLength={100}
                                  showMaxLength="inside"
                                  placeholder="Ingresa una descripción para tu link hub"
                                  autoComplete="off"
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormDescription>
                                This description will be displayed on your link
                                hub page.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </section>
                    )}
                  </FormItem>
                )}
              />

              <div className="flex w-full flex-col-reverse justify-end gap-2 pb-3 pt-6 md:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full md:w-fit"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="w-full md:w-fit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting || !isTrulyDirty}
                >
                  {isSubmitting
                    ? "Processing..."
                    : initialData?.id
                      ? "Update Custom Domain"
                      : "Create Custom Domain"}
                </Button>
              </div>
            </form>
          </Form>
        </CredenzaBody>
      </CredenzaContent>

      {showLinkSelector && (
        <ShortLinkSelector
          userShortLinks={userShortLinks}
          selectedLinkIds={formValues.shortLinkIds ?? []}
          onSelectLinks={(ids) =>
            setValue("shortLinkIds", ids, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          open={showLinkSelector}
          onClose={() => setShowLinkSelector(false)}
        />
      )}
    </Credenza>
  );
}
