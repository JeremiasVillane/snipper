"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CopyToClipboardButton } from "@/components/ui/copy-to-clipboard-button";
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
import { createApiKey } from "@/lib/actions/api-keys";
import {
  CreateApiKeyFormData,
  createApiKeySchema,
} from "@/lib/schemas/api-key-schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface CreateApiKeyDialogProps {
  children: React.ReactNode;
}

export default function CreateApiKeyDialog({
  children,
}: CreateApiKeyDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const form = useForm<CreateApiKeyFormData>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: "",
      expiresAt: undefined,
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        reset({ name: "", expiresAt: undefined });
        setCreatedKey(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open, reset]);

  const onSubmit = async (data: CreateApiKeyFormData) => {
    try {
      const result = await createApiKey(data);
      setCreatedKey(result.key);
      toast({
        title: "Success!",
        description: "Your API key has been created",
        type: "success",
      });
    } catch (error) {
      console.error("Error creating API key:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create API key",
        type: "error",
      });
    }
  };

  const handleDone = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>{children}</CredenzaTrigger>
      <CredenzaContent className="max-w-full md:max-w-[500px]">
        <CredenzaHeader>
          <CredenzaTitle>
            {createdKey ? "API Key Created" : "Create API Key"}
          </CredenzaTitle>
          <CredenzaDescription>
            {createdKey
              ? "Your API key has been created. Make sure to copy it now as you won't be able to see it again."
              : "Create a new API key for programmatic access to the URL shortener."}
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaBody>
          {!createdKey ? (
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="My API Key"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for your key.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiration date (optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              iconLeft={
                                <CalendarIcon className="mr-2 pb-0.5" />
                              }
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>No expiration</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                          <div className="p-3 border-t border-border">
                            <Button
                              type="button"
                              variant="ghost"
                              className="w-full justify-center text-sm"
                              onClick={() => field.onChange(undefined)}
                            >
                              Clean (No expiration)
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        The key will no longer work after this date.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CredenzaFooter className="mt-6 px-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create API Key"}
                  </Button>
                </CredenzaFooter>
              </form>
            </Form>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="api-key"
                    value={createdKey}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <CopyToClipboardButton
                    size="icon"
                    variant="outline"
                    content={createdKey}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2 px-1">
                  This key will only be shown once. Make sure to copy it now.
                </p>
              </div>
              <CredenzaFooter className="mt-6 px-0">
                <Button onClick={handleDone}>Done</Button>
              </CredenzaFooter>
            </div>
          )}
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
