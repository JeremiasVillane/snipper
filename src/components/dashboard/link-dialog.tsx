"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomDomain } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon, InfoIcon, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { deleteImage, uploadImage } from "@/lib/actions/dashboard";
import { getSafeActionResponse } from "@/lib/actions/safe-action-helpers";
import { createShortLink, updateShortLink } from "@/lib/actions/short-links";
import {
  CreateLinkFormData,
  createLinkSchema,
  UtmSetFormData,
} from "@/lib/schemas";
import { ShortLinkFromRepository } from "@/lib/types";
import { isDeepEqual } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/simple-toast";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Separator } from "../ui/separator";
import { IconSelector } from "./icon-selector";
import { ShortLinkInput } from "./link-input";
import { OgPreviewCustomizer } from "./og-preview-customizer";
import { UtmSetDisplay } from "./utm-set-display";
import { UtmSetForm } from "./utm-set-form";

interface LinkDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: ShortLinkFromRepository;
  userCustomDomains: CustomDomain[];
}

export function LinkDialog({
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  initialData,
  userCustomDomains,
}: LinkDialogProps) {
  const router = useRouter();

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    controlledOpen !== undefined && setControlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? setControlledOpen : setInternalOpen;

  const [newTag, setNewTag] = useState("");
  const [editingUtmIndex, setEditingUtmIndex] = useState<number | null>(null);
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);

  const initialFormValuesRef = useRef<CreateLinkFormData | null>(null);

  const calculateFormValues = (
    data: ShortLinkFromRepository | undefined,
  ): CreateLinkFormData => {
    return {
      originalUrl: data?.originalUrl ?? "",
      shortCode: data?.shortCode ?? undefined,
      title: data?.title ?? null,
      tags: data?.tags ?? [],
      isExpirationEnabled: !!data?.expiresAt,
      expiresAt: data?.expiresAt ?? undefined,
      expirationUrl: data?.expirationUrl ?? undefined,
      isPasswordEnabled: !!data?.isPasswordEnabled,
      password: "",
      utmSets:
        data?.utmParams?.map((p) => ({
          source: p.source ?? "",
          medium: p.medium ?? "",
          campaign: p.campaign ?? "",
          term: p.term ?? "",
          content: p.content ?? "",
        })) ?? [],
      isCustomOgEnabled: data?.isCustomOgEnabled,
      customOgTitle: data?.customOgTitle ?? null,
      customOgDescription: data?.customOgDescription ?? null,
      customOgImageUrl: data?.customOgImageUrl ?? null,
      customDomain: data?.customDomain?.domain ?? null,
      isLinkHubEnabled: data?.isLinkHubEnabled ?? false,
      linkHubTitle: data?.linkHubTitle ?? null,
      linkHubDescription: data?.linkHubDescription ?? null,
      shortLinkIcon: data?.shortLinkIcon ?? null,
    };
  };

  const form = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
    mode: "onTouched",
  });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    reset,
    formState: { isSubmitting, isDirty, errors },
  } = form;

  const {
    fields: utmSetFields,
    append: appendUtmSet,
    remove: removeUtmSet,
    update: updateUtmSet,
  } = useFieldArray({
    control,
    name: "utmSets",
  });

  const formValues = watch();
  const currentTags = watch("tags");

  const initialFormValues = useMemo(() => {
    return calculateFormValues(initialData);
  }, [initialData]);

  useEffect(() => {
    if (isOpen) {
      const values = initialFormValues;
      reset(values);
      initialFormValuesRef.current = values;
      setNewTag("");
      setEditingUtmIndex(null);
    } else {
      initialFormValuesRef.current = null;
    }
  }, [initialData, isOpen, reset]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      const trimmedTag = newTag.trim();
      const currentTagsValue = getValues("tags") || [];
      if (!currentTagsValue.includes(trimmedTag)) {
        setValue("tags", [...currentTagsValue, trimmedTag], {
          shouldValidate: true,
        });
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTagsValue = getValues("tags") || [];
    setValue(
      "tags",
      currentTagsValue.filter((tag) => tag !== tagToRemove),
      { shouldValidate: true },
    );
  };

  const onSubmit = async (data: CreateLinkFormData) => {
    try {
      let customOgImageUrl: string | null = null;

      if (data.isCustomOgEnabled && !!ogImageFile) {
        const customFile = new File(
          [ogImageFile],
          `custom-og-image-${getValues("shortCode")}`,
          { type: ogImageFile.type },
        );
        const { data, success, error } = await uploadImage({
          file: customFile,
        }).then((res) => getSafeActionResponse(res));

        if (error) {
          console.error("Error uploading image:", error);
          toast({
            title: "Error uploading image. Try again later.",
            type: "error",
          });
        }

        if (success) customOgImageUrl = data;
      }

      if (
        (!data.isCustomOgEnabled || !ogImageFile) &&
        initialData?.customOgImageUrl
      ) {
        const imgsToRemove = initialData.customOgImageUrl
          .split("/")
          .at(-1) as string;
        const { data, success, error } = await deleteImage({
          imgsToRemove,
        }).then((res) => getSafeActionResponse(res));

        if (error) {
          console.error("Error deleting image:", error);
          toast({
            title: "Error deleting image. Try again later.",
            type: "error",
          });
        }

        if (success) toast({ title: data.message });
      }

      const dataToSubmit = {
        ...data,
        id: initialData?.id,
        password: data.isPasswordEnabled ? data.password : undefined,
        ...(!data.isExpirationEnabled
          ? {
              expiresAt: null,
              expirationUrl: null,
            }
          : {}),
        customOgImageUrl,
        ...(!data.isCustomOgEnabled
          ? {
              customOgTitle: null,
              customOgDescription: null,
              customOgImageUrl: null,
            }
          : {}),
        ...(!data.isLinkHubEnabled
          ? {
              linkHubTitle: null,
              linkHubDescription: null,
              shortLinkTitle: null,
              shortLinkIcon: null,
            }
          : {}),
      };

      const result = !!initialData
        ? await updateShortLink({
            linkId: initialData.id,
            formData: dataToSubmit,
          }).then((res) => getSafeActionResponse(res))
        : await createShortLink({ formData: dataToSubmit }).then((res) =>
            getSafeActionResponse(res),
          );

      toast({
        title: result.success ? "Success!" : "Error",
        description: result.success
          ? `Link ${!!initialData ? "updated" : "created"} successfully.`
          : result.error,
        type: result.success ? "success" : "error",
        duration: result.success ? 3000 : 9000,
      });

      if (result.success) {
        initialFormValuesRef.current = calculateFormValues(result.data);
        onOpenChange(false);
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save link.",
        type: "error",
      });
    }
  };

  const handleStartEditUtm = (index: number) => {
    setEditingUtmIndex(index);
  };

  const handleCancelEditUtm = () => {
    setEditingUtmIndex(null);
  };

  const handleAddUtmSet = (newSet: UtmSetFormData) => {
    const existingCampaigns = (getValues("utmSets") ?? []).map((set) =>
      set.campaign?.toLowerCase(),
    );
    if (existingCampaigns.includes(newSet.campaign?.toLowerCase())) {
      toast({
        title: "Duplicate Campaign Name",
        description: `A set with campaign name "${newSet.campaign}" already exists.`,
        type: "warning",
      });
      return;
    }

    appendUtmSet(newSet);
    toast({ title: `Campaign "${newSet.campaign}" added.`, type: "success" });
  };

  const handleUpdateUtmSet = (index: number, updatedSet: UtmSetFormData) => {
    const existingCampaigns = (getValues("utmSets") ?? [])
      .filter((_, i) => i !== index)
      .map((set) => set.campaign?.toLowerCase());

    if (existingCampaigns.includes(updatedSet.campaign?.toLowerCase())) {
      toast({
        title: "Duplicate Campaign Name",
        description: `Another set with campaign name "${updatedSet.campaign}" already exists.`,
        type: "warning",
      });
      return;
    }
    updateUtmSet(index, updatedSet);
    setEditingUtmIndex(null);
    toast({
      title: `Campaign "${updatedSet.campaign}" updated.`,
      type: "success",
    });
  };

  const currentEditData =
    editingUtmIndex !== null ? getValues(`utmSets.${editingUtmIndex}`) : null;

  const isTrulyDirty = initialData
    ? !isDeepEqual(formValues, initialFormValuesRef.current)
    : isDirty;

  return (
    <Credenza open={isOpen} onOpenChange={onOpenChange}>
      {!!children && <CredenzaTrigger asChild>{children}</CredenzaTrigger>}
      <CredenzaContent className="max-h-full max-w-full overflow-hidden md:max-h-[90vh] md:max-w-3xl md:overflow-y-auto">
        <CredenzaHeader>
          <CredenzaTitle>
            {initialData?.id ? "Edit Link" : "Create New Link"}
          </CredenzaTitle>
          <CredenzaDescription>
            {initialData?.id
              ? "Update your shortened URL properties"
              : "Enter details for your new shortened URL"}
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaBody className="flex-grow overflow-y-auto">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Tabs variant="segmented" defaultValue="basic">
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  <TabsTrigger value="tracking">Tracking</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                  <Card>
                    <CardContent className="mt-5 space-y-4">
                      <FormField
                        control={control}
                        name="originalUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Original URL{" "}
                              <span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value?.replace(/^https?:\/\//, "")}
                                onChange={(e) =>
                                  field.onChange(`https://${e.target.value}`)
                                }
                                startInline="https://"
                                placeholder="example.com/your-very-long-url..."
                                autoComplete="off"
                                autoFocus
                                disabled={!!initialData}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <ShortLinkInput
                        {...{ form, userCustomDomains, initialData }}
                      />

                      {form.watch("customDomain") && (
                        <FormField
                          control={control}
                          name="isLinkHubEnabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <section className="flex flex-row items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Link Hub
                                  </FormLabel>
                                  <FormDescription>
                                    Enable a link hub for this subdomain.{" "}
                                    <Popover>
                                      <PopoverTrigger>
                                        <InfoIcon className="mb-1 inline size-4 text-primary" />
                                      </PopoverTrigger>

                                      <PopoverContent>
                                        <div className="space-y-2 rounded-md border bg-muted/30 p-4 shadow-md">
                                          <p className="text-sm text-muted-foreground">
                                            A link hub is a personalized page
                                            that displays all your shortened
                                            links in one place. It can be shared
                                            with others, allowing them to access
                                            all your links easily.
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            This feature is useful for sharing
                                            multiple links with a single URL,
                                            such as in social media bios or
                                            email signatures.
                                          </p>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
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
                                            placeholder="Enter a title for your link hub"
                                            autoComplete="off"
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          This title will be displayed on your
                                          link hub page.
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
                                        <FormLabel>
                                          Link Hub Description
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            maxLength={100}
                                            showMaxLength="inside"
                                            placeholder="Enter a description for your link hub"
                                            autoComplete="off"
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          This description will be displayed on
                                          your link hub page.
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <Separator />

                                  <FormField
                                    control={control}
                                    name="title"
                                    render={({ field }) => (
                                      <FormItem className="space-y-2">
                                        <FormLabel>Short Link Title</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            maxLength={50}
                                            showMaxLength="inside"
                                            placeholder="Enter a title for your short link"
                                            autoComplete="off"
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          This will be the title of this current
                                          short link when listed in the link
                                          hub.
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={control}
                                    name="shortLinkIcon"
                                    render={({ field }) => (
                                      <FormItem className="space-y-2">
                                        <FormLabel>Short Link Icon</FormLabel>
                                        <FormControl>
                                          <IconSelector
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          This icon will be displayed next to
                                          the short link in the link hub.
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
                      )}

                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <div
                          className={
                            !!currentTags && currentTags?.length > 0
                              ? "mb-2 flex flex-wrap gap-2"
                              : ""
                          }
                        >
                          {(currentTags || []).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                aria-label={`Remove tag ${tag}`}
                              >
                                <X className="size-3 cursor-pointer" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <FormControl>
                          <Input
                            placeholder="Add tags (press Enter)"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={handleAddTag}
                          />
                        </FormControl>
                        <FormDescription>
                          Tags help you organize your links.
                        </FormDescription>
                        <FormMessage>{errors.tags?.message}</FormMessage>
                      </FormItem>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="advanced">
                  <Card>
                    <CardHeader>
                      <CardTitle>Advanced Options</CardTitle>
                      <CardDescription>
                        Set additional options for your short link
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={control}
                        name="isExpirationEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-col rounded-lg border p-4">
                            <section className="flex flex-row items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Expiration Date
                                </FormLabel>
                                <FormDescription>
                                  Set an expiration date for this link.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                    if (!checked) {
                                      setValue("expiresAt", undefined);
                                      setValue("expirationUrl", undefined);
                                      form.clearErrors("expirationUrl");
                                    }
                                  }}
                                />
                              </FormControl>
                            </section>

                            {form.watch("isExpirationEnabled") && (
                              <section>
                                <FormField
                                  control={control}
                                  name="expiresAt"
                                  render={({ field }) => (
                                    <FormItem className="ml-3 space-y-2 border-l border-dashed pl-3 pt-2">
                                      <FormLabel>Select Date</FormLabel>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <FormControl>
                                            <Button
                                              variant={"outline"}
                                              className={`w-full justify-start text-left font-normal ${
                                                !field.value &&
                                                "text-muted-foreground"
                                              }`}
                                            >
                                              <CalendarIcon className="mr-2 h-4 w-4" />
                                              {field.value ? (
                                                format(field.value, "PPP")
                                              ) : (
                                                <span>Pick a date</span>
                                              )}
                                            </Button>
                                          </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                          className="w-auto p-0"
                                          align="start"
                                        >
                                          <div className="flex max-sm:flex-col">
                                            <Calendar
                                              mode="single"
                                              selected={
                                                field.value ?? undefined
                                              }
                                              onSelect={field.onChange}
                                              disabled={(date) =>
                                                date <
                                                new Date(
                                                  new Date().setHours(
                                                    0,
                                                    0,
                                                    0,
                                                    0,
                                                  ),
                                                )
                                              } // Disable past dates
                                              initialFocus
                                            />
                                            <div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
                                              <div className="h-full sm:border-s">
                                                <div className="flex flex-col items-start px-2">
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                      field.onChange(
                                                        new Date(
                                                          Date.now() +
                                                            1 *
                                                              24 *
                                                              60 *
                                                              60 *
                                                              1000,
                                                        ),
                                                      )
                                                    }
                                                  >
                                                    In 1 Day
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                      field.onChange(
                                                        new Date(
                                                          Date.now() +
                                                            7 *
                                                              24 *
                                                              60 *
                                                              60 *
                                                              1000,
                                                        ),
                                                      )
                                                    }
                                                  >
                                                    In 1 Week
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                      field.onChange(
                                                        new Date(
                                                          Date.now() +
                                                            14 *
                                                              24 *
                                                              60 *
                                                              60 *
                                                              1000,
                                                        ),
                                                      )
                                                    }
                                                  >
                                                    In 2 Weeks
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                      field.onChange(
                                                        new Date(
                                                          new Date().setMonth(
                                                            new Date().getMonth() +
                                                              1,
                                                          ),
                                                        ),
                                                      )
                                                    }
                                                  >
                                                    In 1 Month
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                      field.onChange(
                                                        new Date(
                                                          new Date().setMonth(
                                                            new Date().getMonth() +
                                                              6,
                                                          ),
                                                        ),
                                                      )
                                                    }
                                                  >
                                                    In 1 Semester
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                      field.onChange(
                                                        new Date(
                                                          new Date().setFullYear(
                                                            new Date().getFullYear() +
                                                              1,
                                                          ),
                                                        ),
                                                      )
                                                    }
                                                  >
                                                    In 1 Year
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="border-t border-border p-2">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() =>
                                                field.onChange(undefined)
                                              }
                                              disabled={!field.value}
                                            >
                                              Clear selection
                                            </Button>
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                {!!form.watch("expiresAt") && (
                                  <FormField
                                    control={control}
                                    name="expirationUrl"
                                    render={({ field }) => (
                                      <FormItem className="ml-3 space-y-2 border-l border-dashed pl-3 pt-4">
                                        <FormLabel>
                                          Expiration URL{" "}
                                          <Popover>
                                            <PopoverTrigger>
                                              <InfoIcon className="mb-1 inline size-4 text-primary" />
                                            </PopoverTrigger>

                                            <PopoverContent>
                                              <div className="space-y-2 rounded-md border bg-muted/30 p-4 shadow-md">
                                                <p className="text-sm text-muted-foreground">
                                                  When the link expires, users
                                                  will be redirected to this
                                                  URL.
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                  If you leave it blank a "Not
                                                  Found" page will be shown.
                                                </p>
                                              </div>
                                            </PopoverContent>
                                          </Popover>
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            value={field.value?.replace(
                                              /^https?:\/\//,
                                              "",
                                            )}
                                            onChange={(e) => {
                                              if (e.target.value.length === 0) {
                                                field.onChange("");
                                              } else {
                                                field.onChange(
                                                  `https://${e.target.value}`,
                                                );
                                              }
                                            }}
                                            startInline="https://"
                                            placeholder="some-redirect-url.com"
                                            autoComplete="off"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                )}
                              </section>
                            )}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="isPasswordEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-col rounded-lg border p-4">
                            <section className="flex flex-row items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Password Protection
                                </FormLabel>
                                <FormDescription>
                                  Require a password to access this link.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                    if (!checked) {
                                      setValue("password", undefined);
                                    }
                                  }}
                                />
                              </FormControl>
                            </section>

                            {form.watch("isPasswordEnabled") &&
                              !(
                                initialData?.isPasswordEnabled &&
                                initialFormValues.password === ""
                              ) && (
                                <FormField
                                  control={control}
                                  name="password"
                                  render={({ field }) => (
                                    <FormItem className="ml-3 space-y-2 border-l border-dashed pl-3 pt-2">
                                      <FormLabel>Password</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="password"
                                          placeholder="Enter a password"
                                          {...field}
                                          value={field.value ?? ""}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tracking">
                  <Card>
                    <CardHeader>
                      <CardTitle>UTM Campaign Sets</CardTitle>
                      <CardDescription>
                        Define reusable UTM parameter sets. Add sets below. The
                        generated links can be copied from the main links table.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {utmSetFields.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            {initialData ? "Saved Sets" : "Added Sets"} (
                            {utmSetFields.length}):
                          </h4>
                          {utmSetFields.map((field, index) => (
                            <UtmSetDisplay
                              key={field.id}
                              index={index}
                              utmSet={getValues(`utmSets.${index}`)}
                              onRemove={removeUtmSet}
                              onEdit={handleStartEditUtm}
                            />
                          ))}
                        </div>
                      )}
                      {utmSetFields.length === 0 && (
                        <p className="py-4 text-center text-sm italic text-muted-foreground">
                          No UTM sets added yet.
                        </p>
                      )}

                      <UtmSetForm
                        editingIndex={editingUtmIndex}
                        editingSet={currentEditData}
                        onAddSet={handleAddUtmSet}
                        onUpdateSet={handleUpdateUtmSet}
                        onCancelEdit={handleCancelEditUtm}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preview">
                  <OgPreviewCustomizer
                    {...{
                      control,
                      setValue,
                      getValues,
                      errors,
                      setOgImageFile,
                    }}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex pb-3 pt-6">
                <Button
                  type="submit"
                  className="m-0 w-full md:ml-auto md:w-fit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting || !isTrulyDirty}
                >
                  {isSubmitting
                    ? "Processing..."
                    : initialData?.id
                      ? "Update Link"
                      : "Create Link"}
                </Button>
              </div>
            </form>
          </Form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
