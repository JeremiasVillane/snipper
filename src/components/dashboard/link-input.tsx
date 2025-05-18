import { useState } from "react";
import { publicUrl } from "@/env.mjs";
import { CustomDomain } from "@prisma/client";
import { ChevronDown, Pencil, Plus, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { deleteCustomDomain } from "@/lib/actions/custom-domains";
import { getSafeActionResponse } from "@/lib/actions/safe-action-helpers";
import { CreateLinkFormData } from "@/lib/schemas";
import { ShortLinkFromRepository } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { toast } from "../ui/simple-toast";

const currentHost = new URL(publicUrl).host;

interface ShortLinkInputProps {
  form: UseFormReturn<CreateLinkFormData>;
  userCustomDomains: CustomDomain[];
  initialData?: ShortLinkFromRepository;
}

const SubDomainField = ({
  form,
  userCustomDomains,
}: Omit<ShortLinkInputProps, "initialData">) => {
  const [newCustomDomain, setNewCustomDomain] = useState<string | null>(null);
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [customDomainToDelete, setCustomDomainToDelete] = useState<
    string | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [open, setOpen] = useState(false);

  const renderTemp = () => {
    return (
      newCustomDomain && (
        <div className="mt-2 flex cursor-default items-center justify-between gap-4 border-t pt-2 text-sm">
          <span className="flex items-center gap-0.5 overflow-hidden text-foreground/80">
            <X
              role="button"
              onClick={() => {
                form.setValue("customDomain", null);
                setNewCustomDomain(null);
                setOpen(false);
              }}
              className="mr-1 size-[0.9rem] shrink-0 text-foreground hover:text-destructive"
              data-tooltip-id="temp-subdomain-delete"
              data-tooltip-content="Remove custom subdomain"
            />
            <span className="truncate">
              {newCustomDomain}.{currentHost}
            </span>
          </span>

          <span className="text-xs italic text-muted-foreground/80">
            pending
          </span>
          <ReactTooltip id="temp-subdomain-delete" />
        </div>
      )
    );
  };

  const renderDeleteConfirmation = () => {
    return (
      <div className="mt-2 flex flex-col items-center justify-between gap-4 border-t pt-2 text-sm">
        <span className="text-foreground/80">
          Are you sure you want to delete <br />
          this custom subdomain?
        </span>
        <div className="flex w-full flex-col gap-1 md:flex-row">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setCustomDomainToDelete(null);
              setOpen(false);
            }}
            className="h-8 w-full"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              setIsDeleting(true);
              const { data, success, error } = await deleteCustomDomain({
                domainId: customDomainToDelete as string,
              }).then((res) => getSafeActionResponse(res));

              if (success) {
                toast({
                  title: "Success",
                  description: data.message,
                  type: "success",
                });
                form.setValue("customDomain", null);
              } else {
                toast({
                  title: "Error",
                  description: error,
                  type: "error",
                });
              }

              setIsDeleting(false);
              setCustomDomainToDelete(null);
              setOpen(false);
            }}
            className="h-8 w-full"
            isLoading={isDeleting}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>
    );
  };

  const renderDomainSelection = () => {
    if (userCustomDomains.length > 0) {
      return (
        <>
          {userCustomDomains.map((domain) => (
            <span
              key={domain.id}
              className="group flex cursor-pointer items-center gap-0.5 overflow-hidden text-sm"
            >
              <X
                role="button"
                onClick={() =>
                  !isDeleting && setCustomDomainToDelete(domain.id)
                }
                className={cn(
                  "mr-1 size-[0.9rem] text-foreground hover:text-destructive",
                  customDomainToDelete === domain.id &&
                    "text-destructive hover:text-destructive",
                  isDeleting && "cursor-not-allowed opacity-50",
                )}
                data-tooltip-id="subdomain-delete"
                data-tooltip-content="Remove custom subdomain"
              />
              <span
                role="button"
                onClick={() => {
                  if (!isDeleting) {
                    form.setValue("customDomain", domain.domain);
                    form.setValue("isLinkHubEnabled", domain.isLinkHubEnabled);
                    form.setValue("linkHubTitle", domain.linkHubTitle);
                    form.setValue(
                      "linkHubDescription",
                      domain.linkHubDescription,
                    );
                    setNewCustomDomain(null);
                    setOpen(false);
                  }
                }}
                className={cn(
                  "truncate",
                  "text-foreground/80 group-hover:text-foreground",
                  customDomainToDelete === domain.id &&
                    "text-destructive group-hover:text-destructive",
                  isDeleting && "cursor-not-allowed opacity-50",
                )}
              >
                {domain.domain}.{currentHost}/
              </span>
            </span>
          ))}
          {renderTemp()}
          <ReactTooltip id="subdomain-delete" />
        </>
      );
    }

    return (
      <div>
        <span className="select-none pt-1 text-sm text-muted-foreground">
          No custom subdomains available.
        </span>
        {renderTemp()}
      </div>
    );
  };

  return (
    <FormField
      control={form.control}
      name="customDomain"
      render={({ field: domainField }) => {
        const handleClose = () => {
          setIsCustomDomain(false);
          setOpen(false);
        };

        const handleSetTempDomain = () => {
          domainField.onChange(newCustomDomain);
          form.setValue("linkHubTitle", null);
          form.setValue("linkHubDescription", null);
          handleClose();
        };

        return (
          <FormItem>
            <FormControl>
              <Popover
                open={open}
                onOpenChange={(isOpen) => {
                  setIsCustomDomain(false);
                  setOpen(isOpen);
                }}
              >
                <PopoverTrigger className="group" asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    iconLeft={
                      <ChevronDown className="transition-transform group-data-[state=open]:rotate-180" />
                    }
                    className="flex gap-2 border-0 px-0 font-semibold focus-within:ring-0 hover:bg-transparent hover:text-foreground focus-visible:ring-0 data-[state=open]:text-foreground"
                    onClick={() => {
                      setIsCustomDomain(true);
                      setOpen(true);
                    }}
                  >
                    {domainField.value
                      ? `${domainField.value}.${currentHost}/`
                      : `${currentHost}/`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-56 px-2.5 py-2">
                  {isCustomDomain ? (
                    <div className="flex flex-col gap-2">
                      <Input
                        value={newCustomDomain ?? ""}
                        onChange={(e) => setNewCustomDomain(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSetTempDomain();
                        }}
                        placeholder="my-subdomain"
                        autoComplete="off"
                        autoFocus
                        minLength={2}
                        maxLength={12}
                        showMaxLength="inside"
                        className="h-8 w-full"
                      />
                      <div className="flex w-full flex-col gap-1 md:flex-row">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetTempDomain()}
                          className="h-8 w-full"
                          disabled={!newCustomDomain}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleClose}
                          className="h-8 w-full"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span
                        role="button"
                        onClick={() => {
                          if (!isDeleting) {
                            form.setValue("customDomain", null);
                            setNewCustomDomain(null);
                            setOpen(false);
                          }
                        }}
                        className={`${userCustomDomains.length > 0 ? "ml-5" : "ml-0"} text-sm text-foreground/80 ${
                          isDeleting
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:text-foreground"
                        }`}
                      >
                        {new URL(publicUrl).host}/
                      </span>
                      {renderDomainSelection()}
                      {customDomainToDelete && renderDeleteConfirmation()}
                      <Separator className="my-2" />
                      <Button
                        size="sm"
                        variant="outline"
                        iconLeft={!!newCustomDomain ? <Pencil /> : <Plus />}
                        iconAnimation="zoomIn"
                        onClick={() => setIsCustomDomain(true)}
                        className="h-8 w-full [&_svg]:size-[0.9rem]"
                        disabled={isDeleting}
                      >
                        {!!newCustomDomain ? "Edit" : "Add new"}
                      </Button>
                    </>
                  )}
                </PopoverContent>
              </Popover>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export function ShortLinkInput({
  form,
  userCustomDomains,
  initialData,
}: ShortLinkInputProps) {
  return (
    <FormField
      control={form.control}
      name="shortCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel
            className={
              form.getFieldState("customDomain").error ? "text-destructive" : ""
            }
          >
            Custom Alias
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="my-custom-link"
              autoComplete="off"
              value={field.value ?? ""}
              minLength={3}
              maxLength={15}
              showMaxLength="inside"
              startAddon={<SubDomainField {...{ form, userCustomDomains }} />}
              disabled={!!initialData}
            />
          </FormControl>
          {!form.getFieldState("shortCode").error &&
            !form.getFieldState("customDomain").error && (
              <FormDescription>
                Memorable link alias (3-15 characters). Leave blank for random.
              </FormDescription>
            )}

          <p className="text-[0.8rem] font-medium text-destructive">
            {form.getFieldState("shortCode").error?.message}
          </p>
          <p className="text-[0.8rem] font-medium text-destructive">
            {form.getFieldState("customDomain").error?.message}
          </p>
        </FormItem>
      )}
    />
  );
}
