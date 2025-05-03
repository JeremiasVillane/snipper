"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";
import { useFormStatus } from "react-dom";

import {
  verifyPasswordAndRecordClick,
  type VerifyPasswordState,
} from "@/lib/actions/short-links";
import { useActionState } from "react";

interface PasswordProtectionProps {
  shortCode: string;
  resolvedSearchParams: {
    [key: string]: string | string[] | undefined;
  };
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Verifying...
        </>
      ) : (
        "Continue"
      )}
    </Button>
  );
}

export function PasswordProtection({
  shortCode,
  resolvedSearchParams,
}: PasswordProtectionProps) {
  const initialState: VerifyPasswordState = { message: null, success: false };

  const verifyPasswordWithShortCode = verifyPasswordAndRecordClick.bind(
    null,
    shortCode,
    resolvedSearchParams
  );

  const [state, formAction] = useActionState(
    verifyPasswordWithShortCode,
    initialState
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Password Protected Link</CardTitle>
          <CardDescription>
            This link is password protected. Please enter the password to
            continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                required
              />
            </div>
            {state?.message && !state.success && (
              <p className="text-sm font-medium text-destructive">
                {state.message}
              </p>
            )}
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
