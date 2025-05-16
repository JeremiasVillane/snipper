"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { env } from "@/env.mjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { registerFormSchema, RegisterFormValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/simple-toast";

export function RegisterForm() {
  const router = useRouter();
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      turnstileToken: null,
    },
  });

  const onTurnstileVerify = (token: string) => {
    form.setValue("turnstileToken", token);
    console.log("Register Turnstile verified, token:", token);
  };

  const onTurnstileExpire = () => {
    form.setValue("turnstileToken", null);
    console.log("Register Turnstile expired");
    toast({
      title: "CAPTCHA expired",
      description: "Please re-verify.",
      type: "warning",
    });
    turnstileRef.current?.reset();
  };

  async function onSubmit(values: RegisterFormValues) {
    if (!values.turnstileToken) {
      toast({
        title: "CAPTCHA Required",
        description: "Please complete the CAPTCHA challenge.",
        type: "error",
      });
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          turnstileToken: values.turnstileToken,
        }),
      });

      const data = await res.json();

      if (data?.error === "CAPTCHA_FAILED") {
        toast({
          title: "Registration Error",
          description: "CAPTCHA verification failed. Please try again.",
          type: "error",
        });
        form.setValue("turnstileToken", null);
        turnstileRef.current?.reset();
        return;
      }

      if (data?.autocorrect.length > 0) {
        toast({
          title: data.error || "Email autocorrected",
          description: `Did you mean ${data.autocorrect}?`,
          type: "warning",
          position: "top-center",
          enterAnimationType: "zoom-in",
          showProgressBar: false,
          duration: 5000,
        });
        form.setValue("email", data.autocorrect);
        form.setValue("turnstileToken", null);
      } else if (!data?.success) {
        toast({
          title: data.error || "Registration Error",
          description: "Failed to create account. Please try again.",
          type: "error",
        });
        form.resetField("password");
        form.resetField("confirmPassword");
        form.setValue("turnstileToken", null);
        turnstileRef.current?.reset();
      } else {
        toast({
          title: "Success!",
          description: "Your account has been created successfully.",
          type: "success",
        });

        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      toast({
        title: "Registration Error",
        description: `Network error or failed to process response: ${errorMessage}`,
        type: "error",
      });
      form.resetField("password");
      form.resetField("confirmPassword");
      form.setValue("turnstileToken", null);
      turnstileRef.current?.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="py-4 flex w-full items-center justify-center">
          <Turnstile
            ref={turnstileRef}
            siteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onSuccess={onTurnstileVerify}
            onExpire={onTurnstileExpire}
            onError={(err) =>
              toast({
                title: "Authentication error",
                description: err,
                type: "error",
              })
            }
            className="mx-auto"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
}
