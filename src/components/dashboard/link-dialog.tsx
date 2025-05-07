"use client";

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
import { createShortLink, updateShortLink } from "@/lib/actions/short-links";
import {
  CreateLinkFormData,
  createLinkSchema,
  UtmSetFormData,
} from "@/lib/schemas";
import { ShortLinkFromRepository } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { UtmSetDisplay } from "./utm-set-display";
import { UtmSetForm } from "./utm-set-form";
import { getSafeActionResponse } from "@/lib/actions/safe-action-helpers";

interface LinkDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: ShortLinkFromRepository;
}

export function LinkDialog({
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  initialData,
}: LinkDialogProps) {
  const router = useRouter();

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    controlledOpen !== undefined && setControlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? setControlledOpen : setInternalOpen;
  const [newTag, setNewTag] = useState("");
  const [editingUtmIndex, setEditingUtmIndex] = useState<number | null>(null);

  const calculateFormValues = (
    data: ShortLinkFromRepository | undefined
  ): CreateLinkFormData => {
    return {
      originalUrl: data?.originalUrl ?? "",
      shortCode: data?.shortCode ?? undefined,
      tags: data?.tags ?? [],
      isExpirationEnabled: !!data?.expiresAt,
      expiresAt: data?.expiresAt ?? undefined,
      isPasswordEnabled: !!data?.password,
      password: data?.password ?? undefined,
      utmSets:
        data?.utmParams?.map((p) => ({
          source: p.source,
          medium: p.medium,
          campaign: p.campaign,
          term: p.term,
          content: p.content,
        })) ?? [],
    };
  };

  const defaultValues = calculateFormValues(initialData);

  const form = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: defaultValues,
    mode: "onTouched",
  });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    reset,
    formState: { isSubmitting, errors },
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

  const isExpirationEnabled = watch("isExpirationEnabled");
  const isPasswordEnabled = watch("isPasswordEnabled");
  const currentTags = watch("tags");

  useEffect(() => {
    if (isOpen) {
      reset(calculateFormValues(initialData));
      setNewTag("");
      setEditingUtmIndex(null);
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
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: CreateLinkFormData) => {
    try {
      const dataToSubmit = {
        ...data,
        password: data.isPasswordEnabled ? data.password : null,
        expiresAt: data.isExpirationEnabled ? data.expiresAt : null,
        id: initialData?.id,
      };

      const result = !!initialData
        ? await updateShortLink({
            linkId: initialData?.id,
            formData: dataToSubmit,
          }).then((res) => getSafeActionResponse(res))
        : await createShortLink({ formData: dataToSubmit }).then((res) =>
            getSafeActionResponse(res)
          );

      toast({
        title: result.success ? "Success!" : "Error",
        description: result.success
          ? `Link ${
              result.data.shortCode ? "updated" : "created"
            } successfully.`
          : result.error,
        type: result.success ? "success" : "error",
      });

      onOpenChange(false);
      router.refresh();
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
    const existingNames = (getValues("utmSets") ?? []).map(
      (set) => set.campaign
    );
    if (existingNames.includes(newSet.campaign)) {
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
    const existingNames = (getValues("utmSets") ?? [])
      .filter((_, i) => i !== index)
      .map((set) => set.campaign);
    if (existingNames.includes(updatedSet.campaign)) {
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

  return (
    <Credenza open={isOpen} onOpenChange={onOpenChange}>
      {!!children && <CredenzaTrigger asChild>{children}</CredenzaTrigger>}
      <CredenzaContent className="max-w-full md:max-w-3xl max-h-full md:max-h-[90vh] overflow-hidden md:overflow-y-auto">
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

        <CredenzaBody className="overflow-y-auto flex-grow">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Tabs variant="segmented" defaultValue="basic">
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  <TabsTrigger value="tracking">UTM Tracking</TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                  <Card>
                    <CardHeader></CardHeader>
                    <CardContent className="space-y-4">
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
                                placeholder="https://example.com/your-very-long-url..."
                                autoComplete="off"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="shortCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Custom Alias</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="my-custom-link"
                                autoComplete="off"
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              Memorable link alias (3-15 alphanumeric chars
                              recommended). Leave blank for random.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <div className="flex flex-wrap gap-2 mb-2">
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
                                <X className="h-3 w-3 cursor-pointer" />
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
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
                                    setValue("expiresAt", null);
                                  }
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {isExpirationEnabled && (
                        <FormField
                          control={control}
                          name="expiresAt"
                          render={({ field }) => (
                            <FormItem className="flex flex-col ml-6 pt-2">
                              <FormLabel>Select Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={`w-full justify-start text-left font-normal ${
                                        !field.value && "text-muted-foreground"
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
                                  <Calendar
                                    mode="single"
                                    selected={field.value ?? new Date()}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date <
                                      new Date(new Date().setHours(0, 0, 0, 0))
                                    } // Disable past dates
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={control}
                        name="isPasswordEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
                                    setValue("password", "");
                                  }
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {isPasswordEnabled && (
                        <FormField
                          control={control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="ml-6 pt-2 space-y-2">
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
                          <h4 className="font-medium text-sm text-muted-foreground">
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
                        <p className="text-sm text-muted-foreground text-center py-4 italic">
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
              </Tabs>

              <div className="mt-6 flex">
                <Button
                  type="submit"
                  className="w-full md:w-fit m-0 md:ml-auto"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
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
