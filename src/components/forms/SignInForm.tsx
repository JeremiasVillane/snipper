"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "..";

export default function SignInForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 1000);
  }, []);

  if (session && session.user) {
    router.replace("/profile");
  } else if (mounted)
    return (
      <section className="auth-card mt-12 flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto"
            src="/authjs.webp"
            alt="logo"
            width={44}
            height={44}
            style={{ width: "auto", height: "auto" }}
          />
          <h2 className="mt-5 mb-6 text-center text-2xl font-semibold leading-9 tracking-tight text-gray-600 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
          <Image
            className="mr-6 drop-shadow-lg"
            src="/google.svg"
            alt="Google Logo"
            width={24}
            height={24}
          />
          Sign in with Google
        </Button>
        {/* <button onClick={() => signIn("github", { callbackUrl: "/" })}>
          <Image
            src="/github.svg"
            alt="Github Logo"
            className="dark:invert"
            width={24}
            height={24}
          />
          Sign in with Github
        </button> */}
      </section>
    );
}
