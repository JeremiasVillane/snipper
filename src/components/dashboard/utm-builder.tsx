"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { CreateLinkFormData, UtmParams } from "@/lib/schemas";
import React from "react";
import type { Control, UseFormSetValue } from "react-hook-form";

interface UtmBuilderProps {
  control: Control<CreateLinkFormData>;
  setValue: UseFormSetValue<CreateLinkFormData>;
}

export function UtmBuilder({ control, setValue }: UtmBuilderProps) {
  const clearAll = () => {
    setValue("utmParams.source", "");
    setValue("utmParams.medium", "");
    setValue("utmParams.campaign", "");
    setValue("utmParams.term", "");
    setValue("utmParams.content", "");
  };

  const fieldName = (field: keyof UtmParams) => `utmParams.${field}` as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>UTM Parameters</CardTitle>
        <CardDescription>Add tracking parameters to your URL</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={fieldName("source")}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Source <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="facebook, google, newsletter"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    The referrer (e.g., google, newsletter)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={fieldName("medium")}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Medium <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="cpc, email, social"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Marketing medium (e.g., cpc, banner, email)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name={fieldName("campaign")}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Campaign <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="summer_sale, product_launch"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>The name of your campaign</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={fieldName("term")}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Term</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="running+shoes"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Identify paid search keywords
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={fieldName("content")}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="logolink, textlink"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Used to differentiate similar content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={clearAll}
            className="w-full md:w-fit flex ml-auto mt-6"
          >
            Clear All Parameters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
