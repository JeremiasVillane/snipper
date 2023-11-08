import { SignInForm } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Snipper",
};

export default function SignInPage() {
  return <SignInForm />;
}
