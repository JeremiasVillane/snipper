"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

interface CheckboxProps {
  /** @default "default" */
  // prettier-ignore
  variant?: "default" | "appear" | "flip" | "impulse" | "fill"
}

const checkboxVariants = cva(
  "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        appear: [
          "transition-colors duration-300",
          "data-[state=checked]:shadow-md data-[state=checked]:shadow-primary/30",
          "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        ],
        flip: "flex items-center justify-center overflow-hidden",
        impulse: "flex items-center justify-center overflow-hidden",
        fill: "relative overflow-hidden",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const checkIconVariants = cva("h-4 w-4", {
  variants: {
    variant: {
      default: "",
      appear: [
        "animate-check-appear",
        "opacity-0 scale-50 data-[state=checked]:opacity-100 data-[state=checked]:scale-100",
      ],
      flip: "data-[state=checked]:animate-check-flip data-[state=unchecked]:animate-check-unflip bg-primary text-primary-foreground",
      impulse: "animate-check-impulse bg-primary text-primary-foreground",
      fill: "data-[state=checked]:animate-check-fill data-[state=unchecked]:animate-check-unfill",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & CheckboxProps
>(({ className, variant = "default", ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ variant, className }))}
    {...props}
  >
    <CheckboxPrimitive.Indicator asChild>
      {variant === "fill" ? (
        <div
          className={cn(checkIconVariants({ variant }), "bg-primary size-9")}
        />
      ) : (
        <Check className={checkIconVariants({ variant })} />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
export type { CheckboxProps };
