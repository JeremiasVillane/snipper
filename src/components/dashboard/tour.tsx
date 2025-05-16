"use client";

import { useEffect, useState } from "react";
import { onboardingSteps } from "@/data/onboarding-steps";

import { IntroDisclosure } from "@/components/ui/intro-disclosure";
import { toast } from "@/components/ui/simple-toast";

export function Tour() {
  const [open, setOpen] = useState(true);

  useEffect(() => setOpen(true), []);

  return (
    <IntroDisclosure
      open={open}
      setOpen={setOpen}
      steps={onboardingSteps}
      featureId="app-tour"
      showProgressBar
      onComplete={() =>
        toast({
          title: "Tour completed",
          type: "success",
          showProgressBar: false,
          showCloseButton: false,
        })
      }
      onSkip={() =>
        toast({
          title: "Tour skipped",
          showProgressBar: false,
          showCloseButton: false,
        })
      }
    />
  );
}
