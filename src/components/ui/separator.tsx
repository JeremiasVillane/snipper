"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  /** @default "default" */
  variant?: "default" | "dotted" | "dashed" | "invisible"

  /** Optional text to display in the center of the separator. */
  label?: string

  /** If true, displays the label inside a "chip" (rounded capsule).
   * @default false */
  chip?: boolean

  /** @default "horizontal" */
  orientation?: "horizontal" | "vertical"
}

const separatorVariants = cva("shrink-0 bg-border", {
  variants: {
    variant: {
      default: "",
      dotted: "border border-dotted bg-transparent",
      dashed: "border border-dashed bg-transparent",
      invisible: "border-0 bg-transparent"
    },
    defaultVariants: {
      variant: "default"
    }
  }
})

const Separator = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      variant,
      label,
      chip = false,
      ...props
    },
    ref
  ) => {
    const isVertical = orientation === "vertical"

    const primitiveClasses = cn(
      "relative",
      isVertical
        ? `h-full ${variant === "default" ? "w-[1px]" : "w-px border-l border-t-0 border-b-0 border-r-0"}`
        : `w-full ${variant === "default" ? "h-[1px]" : "h-px border-t border-l-0 border-r-0 border-b-0"}`,
      separatorVariants({ variant })
    )

    const labelClasses = cn(
      "absolute bg-background px-2 text-center text-sm text-foreground/80 z-10",
      isVertical
        ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        : "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
      chip
        ? "flex h-8 min-w-8 items-center justify-center rounded-full border bg-muted p-1.5 text-center text-xs"
        : ""
    )

    if (!isVertical) {
      return (
        <SeparatorPrimitive.Root
          ref={ref}
          decorative={decorative}
          orientation={orientation}
          className={cn(primitiveClasses, className)}
          {...props}
        >
          {!!label && <div className={labelClasses}>{label}</div>}
        </SeparatorPrimitive.Root>
      )
    }

    return (
      <div className="flex justify-center self-stretch">
        <SeparatorPrimitive.Root
          ref={ref}
          decorative={decorative}
          orientation={orientation}
          className={cn(primitiveClasses, className)}
          {...props}
        >
          {!!label && <div className={labelClasses}>{label}</div>}
        </SeparatorPrimitive.Root>
      </div>
    )
  }
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
export type { SeparatorProps }
