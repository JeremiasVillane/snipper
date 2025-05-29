"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { createApiKey } from "@/lib/actions/api-keys";
import { getSafeActionResponse } from "@/lib/actions/safe-action-helpers";
import {
  CreateApiKeyFormData,
  createApiKeySchema,
} from "@/lib/schemas/api-key.schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CopyToClipboardButton } from "@/components/ui/copy-to-clipboard-button";
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
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/simple-toast";

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
      const result = await createApiKey({ data }).then((res) =>
        getSafeActionResponse(res),
      );

      toast({
        title: result.success ? "Success!" : "Error",
        description: result.success
          ? "Your API key has been created"
          : result.error,
        type: result.success ? "success" : "error",
      });

      result.success && setCreatedKey(result.data.key);
      // setOpen(false);
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
    <Modal
      open={open}
      onOpenChange={setOpen}
      mode={!createdKey ? "dialog" : "alertdialog"}
      separatedFooter
    >
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent className="">
        <ModalTitle>
          {createdKey ? "API Key Created" : "Create API Key"}
        </ModalTitle>
        <ModalDescription>
          {createdKey
            ? "Your API key has been created."
            : "Create a new API key for programmatic access to the URL shortener."}
        </ModalDescription>

        <ModalBody className="px-1">
          {!createdKey ? (
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 pb-4"
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
                                !field.value && "text-muted-foreground",
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
                          <div className="border-t border-border p-3">
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
              </form>
            </Form>
          ) : (
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
              <p className="mt-2 px-1 text-sm text-muted-foreground">
                You can always copy this key from the api keys table.
              </p>
            </div>
          )}
        </ModalBody>

        {!createdKey ? (
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create API Key"}
            </Button>
          </ModalFooter>
        ) : (
          <ModalFooter>
            <Button onClick={handleDone}>Done</Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
