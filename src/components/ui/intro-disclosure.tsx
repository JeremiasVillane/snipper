"use client";

import * as React from "react";
import Image from "next/image";
import { useMediaQuery } from "@/hooks";
import { CheckIcon, ExternalLinkIcon } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useAnimation,
  type PanInfo,
} from "motion/react";

import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";

function ImageCarousel({
  images,
  alt,
  interval = 2500,
}: {
  images: string[];
  alt?: string;
  interval?: number;
}) {
  const [current, setCurrent] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images.length, interval]);
  return (
    <div className="relative h-full w-full">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={current}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 h-full w-full"
        >
          <Image
            src={images[current]}
            alt={alt || ""}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>
      {/* Indicadores */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`h-2 w-2 rounded-full ${current === idx ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}

function useFeatureVisibility(featureId: string) {
  const [isVisible, setIsVisible] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const storedValue = localStorage.getItem(`feature_${featureId}`);
    setIsVisible(storedValue ? JSON.parse(storedValue) : true);
  }, [featureId]);

  const hideFeature = () => {
    localStorage.setItem(`feature_${featureId}`, JSON.stringify(false));
    setIsVisible(false);
  };

  return { isVisible: isVisible === null ? false : isVisible, hideFeature };
}

function useSwipe(onSwipe: (direction: "left" | "right") => void) {
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.x > 100) {
      onSwipe("right");
    } else if (info.offset.x < -100) {
      onSwipe("left");
    }
  };

  return { handleDragEnd };
}

const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
};

const slideInOut = (direction: 1 | -1) => ({
  initial: { opacity: 0, x: 20 * direction },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 * direction },
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
});

const hoverScale = {
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2 },
};

function StepPreview({ step, direction }: { step: Step; direction: 1 | -1 }) {
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2, duration: 0.3 },
    });
  }, [controls, step]);

  return (
    <motion.div
      {...slideInOut(direction)}
      className="rounded-rb-lg relative h-full w-full overflow-hidden rounded-sm rounded-tl-xl ring-2 ring-black/10 ring-offset-8 dark:ring-black/10 dark:ring-offset-black"
    >
      {step.media ? (
        <div className="relative h-full w-full bg-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            className="h-full max-h-[700px] w-full"
          >
            {step.media.type === "image" ? (
              Array.isArray(step.media.src) ? (
                <ImageCarousel images={step.media.src} alt={step.media.alt} />
              ) : (
                <Image
                  src={step.media.src || "/placeholder.svg"}
                  alt={step.media.alt || ""}
                  fill
                  className="object-cover"
                />
              )
            ) : (
              <video
                src={step.media.src as string}
                controls
                className="h-full w-full object-cover"
              />
            )}
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            className="absolute bottom-0 left-0 right-0 p-6"
          >
            <h3 className="mb-2 text-2xl font-semibold text-white">
              {step.title}
            </h3>
            <p className="hidden text-white md:block">
              {step.full_description}
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            className="text-center"
          >
            <h3 className="mb-2 text-2xl font-semibold text-primary">
              {step.title}
            </h3>
            <p className="text-muted-foreground">{step.full_description}</p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

interface StepTabProps {
  step: Step;
  isActive: boolean;
  onClick: () => void;
  isCompleted: boolean;
}

function StepTab({ step, isActive, onClick, isCompleted }: StepTabProps) {
  return (
    <motion.button
      {...hoverScale}
      onClick={onClick}
      className={cn(
        "flex w-full flex-col items-start rounded-lg px-4 py-2 text-left transition-colors",
        isActive ? "border border-border bg-muted" : "hover:bg-muted/70",
        "relative",
      )}
      aria-current={isActive ? "step" : undefined}
      aria-label={`${step.title}${isCompleted ? " (completed)" : ""}`}
    >
      <div className="mb-1 text-sm font-medium">{step.title}</div>
      <div className="line-clamp-2 hidden text-xs text-muted-foreground md:block">
        {step.short_description}
      </div>
      {isCompleted && (
        <motion.div {...fadeInScale} className="absolute right-2 top-2">
          <div className="rounded-full bg-primary p-1">
            <CheckIcon className="h-2 w-2 text-primary-foreground" />
          </div>
        </motion.div>
      )}
    </motion.button>
  );
}

interface Step {
  title: string;
  short_description: string;
  full_description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  media?: {
    type: "image" | "video";
    src: string | string[];
    alt?: string;
  };
}

interface FeatureDisclosureProps {
  steps: Step[];
  featureId: string;
  onComplete?: () => void;
  onSkip?: () => void;
  showProgressBar?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  forceVariant?: "mobile" | "desktop";
}

interface StepContentProps {
  steps: Step[];
  currentStep: number;
  onSkip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hideFeature: () => void;
  completedSteps: number[];
  onStepSelect: (index: number) => void;
  direction: 1 | -1;
  isDesktop: boolean;
}

function StepContent({
  steps,
  currentStep,
  onSkip,
  onNext,
  onPrevious,
  hideFeature,
  completedSteps,
  onStepSelect,
  direction,
  isDesktop,
  stepRef,
}: StepContentProps & { stepRef: React.RefObject<HTMLButtonElement> }) {
  const [skipNextTime, setSkipNextTime] = React.useState(false);

  const renderActionButton = (action: Step["action"]) => {
    if (!action) return null;

    if (action.href) {
      return (
        <Button asChild className="w-full" size="sm" variant="link">
          <a href={action.href} target="_blank" rel="noopener noreferrer">
            <span className="flex items-center gap-2">
              {action.label}
              <ExternalLinkIcon className="h-4 w-4" />
            </span>
          </a>
        </Button>
      );
    }

    return (
      <Button
        className="w-full rounded-full"
        size="sm"
        variant="secondary"
        onClick={action.onClick}
      >
        {action.label}
      </Button>
    );
  };

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col">
      {isDesktop && (
        <div className="flex-1 px-2 py-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center justify-center space-y-2 px-1"
          >
            {steps.map((step, index) => (
              <StepTab
                key={index}
                step={step}
                isActive={currentStep === index}
                onClick={() => onStepSelect(index)}
                isCompleted={completedSteps.includes(index)}
              />
            ))}
          </motion.div>
        </div>
      )}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentStep}
          {...slideInOut(direction)}
          className="mt-6 space-y-4"
        >
          {!isDesktop && steps[currentStep]?.media && (
            <AspectRatio
              ratio={16 / 9}
              className="rounded-lg bg-muted lg:overflow-hidden"
            >
              {steps[currentStep]?.media?.type === "image" ? (
                <Image
                  src={
                    Array.isArray(steps[currentStep]?.media?.src)
                      ? steps[currentStep]?.media?.src[0] || "/placeholder.svg"
                      : steps[currentStep]?.media?.src || "/placeholder.svg"
                  }
                  alt={steps[currentStep]?.media?.alt || ""}
                  fill
                  className="object-cover"
                />
              ) : (
                <video
                  src={
                    Array.isArray(steps[currentStep]?.media?.src)
                      ? steps[currentStep]?.media?.src[0]
                      : steps[currentStep]?.media?.src
                  }
                  controls
                  className="h-full w-full object-cover"
                />
              )}
            </AspectRatio>
          )}

          {steps[currentStep]?.action ? (
            <div className="px-2">
              {renderActionButton(steps[currentStep]?.action)}
            </div>
          ) : (
            <div className="h-10" />
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pr-4">
            <Button
              variant="ghost"
              onClick={onSkip}
              className="rounded-full text-muted-foreground hover:bg-card"
            >
              Skip all
            </Button>
            <div className="space-x-2">
              {currentStep > 0 && (
                <Button
                  onClick={onPrevious}
                  size="sm"
                  variant="ghost"
                  className="rounded-full hover:bg-transparent"
                >
                  Previous
                </Button>
              )}
              <Button
                onClick={() => {
                  if (skipNextTime) {
                    hideFeature();
                  }
                  onNext();
                }}
                size="sm"
                ref={stepRef}
                className="rounded-full"
              >
                {currentStep === steps.length - 1 ? "Done" : "Next"}
              </Button>
            </div>
            {/* Don't show again checkbox */}
          </div>
          <div className="flex items-center space-x-2 px-4 pb-4">
            <Checkbox
              id="skipNextTime"
              variant="draw"
              checked={skipNextTime}
              onCheckedChange={(checked) => setSkipNextTime(checked as boolean)}
            />
            <label
              htmlFor="skipNextTime"
              className="select-none text-sm text-muted-foreground"
            >
              Don't show this again
            </label>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function IntroDisclosure({
  steps,
  open,
  setOpen,
  featureId,
  onComplete,
  onSkip,
  showProgressBar = true,
  forceVariant,
}: FeatureDisclosureProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([0]);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const isDesktopQuery = useMediaQuery("(min-width: 768px)");
  const isDesktop = forceVariant ? forceVariant === "desktop" : isDesktopQuery;
  const { isVisible, hideFeature } = useFeatureVisibility(featureId);
  const stepRef = React.useRef<HTMLButtonElement>(null);

  // Close the dialog if feature is hidden
  React.useEffect(() => {
    if (!isVisible) {
      setOpen(false);
    }
  }, [isVisible, setOpen]);

  // Focus management
  React.useEffect(() => {
    if (open && stepRef.current) {
      stepRef.current.focus();
    }
  }, [open, currentStep]);

  const handleNext = () => {
    setDirection(1);
    setCompletedSteps((prev) =>
      prev.includes(currentStep) ? prev : [...prev, currentStep],
    );
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setOpen(false);
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    setDirection(-1);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setOpen(false);
    onSkip?.();
  };

  const handleStepSelect = (index: number) => {
    setDirection(index > currentStep ? 1 : -1);
    // Mark all steps up to and including the selected step as completed
    setCompletedSteps((prev) => {
      const newCompletedSteps = new Set(prev);
      // If moving forward, mark all steps up to the selected one as completed
      if (index > currentStep) {
        for (let i = currentStep; i <= index; i++) {
          newCompletedSteps.add(i);
        }
      }
      return Array.from(newCompletedSteps);
    });
    setCurrentStep(index);
  };

  const handleSwipe = (swipeDirection: "left" | "right") => {
    if (swipeDirection === "left") {
      handleNext();
    } else {
      handlePrevious();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      handleNext();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      handlePrevious();
    }
  };

  const { handleDragEnd } = useSwipe(handleSwipe);

  if (!isVisible || !open) {
    return null;
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogDescription className="sr-only">Feature Tour</DialogDescription>
        <DialogContent
          className="max-w-7xl gap-0 overflow-hidden p-0"
          onKeyDown={handleKeyDown}
        >
          <DialogHeader className="space-y-2 border-b border-border bg-muted p-6">
            <DialogTitle>Feature Tour</DialogTitle>
            {showProgressBar && (
              <div className="mt-2 flex w-full justify-center">
                <Progress
                  value={((currentStep + 1) / steps.length) * 100}
                  className="h-1"
                />
              </div>
            )}
          </DialogHeader>

          <div className="grid h-full grid-cols-2">
            <div className="p-2 pr-[18px]">
              <StepContent
                steps={steps}
                currentStep={currentStep}
                onSkip={handleSkip}
                onNext={handleNext}
                onPrevious={handlePrevious}
                hideFeature={hideFeature}
                completedSteps={completedSteps}
                onStepSelect={handleStepSelect}
                direction={direction}
                isDesktop={isDesktop}
                stepRef={stepRef as React.RefObject<HTMLButtonElement>}
              />
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <StepPreview
                key={currentStep}
                step={steps[currentStep]}
                direction={direction}
              />
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[95vh] max-h-[95vh]">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          onKeyDown={handleKeyDown}
          className="mx-auto flex h-full max-w-3xl flex-col"
        >
          <DrawerHeader className="space-y-4 pb-4 text-left">
            {showProgressBar && (
              <Progress
                value={((currentStep + 1) / steps.length) * 100}
                className="mb-4"
              />
            )}
            <DrawerTitle>{steps[currentStep]?.title}</DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 p-4 pb-32">
              {/* Step tabs */}
              <div className="mb-6 grid grid-cols-2 gap-2">
                {steps.map((step, index) => (
                  <StepTab
                    key={index}
                    step={step}
                    isActive={currentStep === index}
                    onClick={() => handleStepSelect(index)}
                    isCompleted={completedSteps.includes(index)}
                  />
                ))}
              </div>
              {/* Preview */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg ring-2 ring-border ring-offset-8 ring-offset-background">
                <StepPreview step={steps[currentStep]} direction={direction} />
              </div>

              {/* Step content */}
              <div className="space-y-4 rounded-lg border border-border p-3">
                <p className="text-muted-foreground">
                  {steps[currentStep]?.short_description}
                </p>
                {steps[currentStep]?.action && (
                  <Button
                    asChild
                    className="w-full"
                    variant={
                      steps[currentStep]?.action?.href ? "outline" : "default"
                    }
                  >
                    {steps[currentStep]?.action?.href ? (
                      <a
                        href={steps[currentStep]?.action?.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        {steps[currentStep]?.action?.label}
                        <ExternalLinkIcon className="h-4 w-4" />
                      </a>
                    ) : (
                      <button onClick={steps[currentStep]?.action?.onClick}>
                        {steps[currentStep]?.action?.label}
                      </button>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Fixed bottom navigation */}
          <div className="absolute bottom-0 left-0 right-0 border-t bg-background">
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={onSkip}
                  className="rounded-full text-muted-foreground hover:bg-card"
                >
                  Skip all
                </Button>
                <div className="space-x-2">
                  {currentStep > 0 && (
                    <Button
                      onClick={handlePrevious}
                      size="sm"
                      variant="ghost"
                      className="rounded-full hover:bg-transparent"
                    >
                      Previous
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      handleNext();
                    }}
                    size="sm"
                    ref={stepRef}
                    className="rounded-full"
                  >
                    {currentStep === steps.length - 1 ? "Done" : "Next"}
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="skipNextTime"
                  onCheckedChange={(checked) => {
                    hideFeature();
                  }}
                />
                <label
                  htmlFor="skipNextTime"
                  className="text-sm text-muted-foreground"
                >
                  Don't show this again
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
}

export { IntroDisclosure };
export type { FeatureDisclosureProps, Step, StepContentProps, StepTabProps };
