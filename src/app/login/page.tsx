import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { appName } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import { generateOgImageUrl } from "@/lib/og";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/login/login-form";

export const generateMetadata = async () => {
  const title = `Login - ${appName} Account | Access your Links`;
  const description = `Log in to your ${appName} account to access your dashboard, manage your shortened URLs and view click-through analytics.`;

  return constructMetadata({
    title,
    description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: generateOgImageUrl({
            title: `${appName} Login`,
            type: "website",
          }),
          width: 1200,
          height: 630,
          alt: `${appName} Login Page`,
        },
      ],
    },
  });
};

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>

          <div className="mt-6 flex h-9 w-full items-center justify-center rounded-md bg-muted">
            <p className="text-center text-sm text-muted-foreground">
              <strong>Demo Account:</strong> demo@example.com / password123
            </p>
          </div>
          <Button variant="outline" className="w-full md:hidden" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
