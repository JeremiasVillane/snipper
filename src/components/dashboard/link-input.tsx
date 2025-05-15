import { useState } from "react";
import { publicUrl } from "@/env.mjs";
import { CustomDomain } from "@prisma/client";
import { ChevronDown, Pencil, Plus, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { CreateLinkFormData } from "@/lib/schemas";
import { ShortLinkFromRepository } from "@/lib/types";
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
  const [open, setOpen] = useState(false);

  const renderTemp = () => {
    return (
      newCustomDomain && (
        <div className="mt-2 flex cursor-default items-center justify-between gap-4 border-t pt-2 text-sm">
          <span className="flex items-center gap-0.5 text-foreground/80">
            <X
              role="button"
              onClick={() => {
                form.setValue("customDomain", null);
                setNewCustomDomain(null);
                setOpen(false);
              }}
              className="mr-1 size-[0.9rem] text-foreground hover:text-destructive"
              data-tooltip-id="subdomain-delete"
              data-tooltip-content="Remove custom subdomain"
            />
            <span>
              {newCustomDomain}.{currentHost}
            </span>
          </span>

          <span className="text-xs italic text-muted-foreground/80">
            pending
          </span>
          <ReactTooltip id="subdomain-delete" />
        </div>
      )
    );
  };

  const renderDomainSelection = () => {
    if (userCustomDomains.length > 0) {
      return (
        <>
          {userCustomDomains.map((domain) => (
            <span
              key={domain.id}
              className="group flex cursor-pointer items-center gap-0.5 text-sm"
            >
              <X
                role="button"
                onClick={() => {
                  form.setValue("customDomain", "");
                  setOpen(false);
                }}
                className="mr-1 size-[0.9rem] text-foreground hover:text-destructive"
                data-tooltip-id="subdomain-delete"
                data-tooltip-content="Remove custom subdomain"
              />
              <span
                role="button"
                onClick={() => {
                  form.setValue("customDomain", domain.domain);
                  setNewCustomDomain(null);
                  setOpen(false);
                }}
                className="text-foreground/80 group-hover:text-foreground"
              >
                {domain.domain}.{currentHost}
              </span>
            </span>
          ))}
          {renderTemp()}
          <ReactTooltip id="subdomain-delete" />
        </>
      );
    }

    return (
      <>
        <span className="select-none pt-1 text-sm text-muted-foreground">
          No custom subdomains available.
        </span>
        {renderTemp()}
      </>
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
                <PopoverContent align="start" className="w-auto px-2.5 py-2">
                  {isCustomDomain ? (
                    <div className="flex flex-col gap-2">
                      <Input
                        value={newCustomDomain ?? ""}
                        onChange={(e) => setNewCustomDomain(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            domainField.onChange(newCustomDomain);
                            handleClose();
                          }
                        }}
                        placeholder="my-subdomain"
                        autoComplete="off"
                        autoFocus
                        minLength={2}
                        maxLength={12}
                        showMaxLength="inside"
                        className="w/full h-8"
                      />
                      <div className="flex w-full flex-col gap-1 md:flex-row">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            domainField.onChange(newCustomDomain);
                            handleClose();
                          }}
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
                      {renderDomainSelection()}
                      <Separator className="my-2" />
                      <Button
                        size="sm"
                        variant="outline"
                        iconLeft={!!newCustomDomain ? <Pencil /> : <Plus />}
                        iconAnimation="zoomIn"
                        onClick={() => setIsCustomDomain(true)}
                        className="h-8 w-full [&_svg]:size-[0.9rem]"
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
