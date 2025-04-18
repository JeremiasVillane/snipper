import { PasswordProtection } from "@/components/shortCode/password-protection";
import { shortLinksRepository } from "@/lib/db/repositories";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

interface PasswordPageProps {
  params: Promise<{
    shortCode: string;
  }>;
}

export default async function PasswordPage({ params }: PasswordPageProps) {
  const { shortCode } = await params;

  const shortLink = await shortLinksRepository.findByShortCode(shortCode);

  if (!shortLink) notFound();

  if (shortLink.expiresAt && shortLink.expiresAt < new Date()) {
    notFound();
  }

  if (!shortLink.password) {
    redirect(`/${shortCode}`);
  }

  return <PasswordProtection shortCode={shortCode} />;
}
