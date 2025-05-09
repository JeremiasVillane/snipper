import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
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
import { RegisterForm } from "@/components/register/register-form";

export const generateMetadata = async () => {
  const title = "Create Account - Snipper | Sign Up Free";
  const description =
    "Sign up for Snipper to start creating custom short links, track clicks with detailed analytics and use the UTM builder.";

  return constructMetadata({
    title,
    description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: generateOgImageUrl({
            title: "Snipper Sign Up",
            type: "website",
          }),
          width: 1200,
          height: 630,
          alt: "Snipper Account Registration Page",
        },
      ],
    },
  });
};

export default async function RegisterPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
          <Button variant="outline" className="w-full md:hidden" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
