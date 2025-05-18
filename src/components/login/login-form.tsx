"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { env } from "@/env.mjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { loginFormSchema, LoginFormValues } from "@/lib/schemas";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/simple-toast";

export function LoginForm() {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      turnstileToken: null,
    },
  });

  const onTurnstileVerify = (token: string) => {
    form.setValue("turnstileToken", token);
    console.info("Turnstile verified");
  };

  const onTurnstileExpire = () => {
    form.setValue("turnstileToken", null);
    console.info("Turnstile expired");
    toast({
      title: "CAPTCHA expired",
      description: "Please re-verify.",
      type: "warning",
    });
    turnstileRef.current?.reset();
  };

  async function onSubmit(values: LoginFormValues) {
    if (!values.turnstileToken) {
      toast({
        title: "CAPTCHA Required",
        description: "Please complete the CAPTCHA challenge.",
        type: "error",
      });
      return;
    }

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        turnstileToken: values.turnstileToken,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Login error",
          description:
            result.error === "CredentialsSignin"
              ? "Invalid email or password."
              : result.error === "TurnstileVerificationFailed"
                ? "CAPTCHA verification failed. Please try again."
                : "An unexpected error occurred.",
          type: "error",
        });
        form.resetField("password");
        turnstileRef.current?.reset();
        form.setValue("turnstileToken", null);
        return;
      }

      if (result?.ok && !result?.error) {
        toast({
          title: "Success!",
          description: "You are successfully logged in.",
          type: "success",
        });
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Could not log in. Please try again.",
        type: "error",
      });
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Google Sign-In error:", error);
      toast({
        title: "Error",
        description: "Could not sign in with Google.",
        type: "error",
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || form.formState.isSubmitting}
          className="w-full"
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Sign in with Google
        </Button>
      </div>

      <div className="py-2">
        <Separator
          label="Or continue with"
          className="w-full"
          labelClassName="text-muted-foreground text-xs uppercase"
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
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
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                    tabIndex={-1}
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full items-center justify-center py-4">
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
            disabled={
              form.formState.isSubmitting ||
              isGoogleLoading ||
              !form.watch("turnstileToken")
            }
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
