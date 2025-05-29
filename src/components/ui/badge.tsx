import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

interface BadgeProps {
  /** Controls the visual style of the badge
   * @default "default" */
  // prettier-ignore
  variant?: "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline";

  /** Determines the size of the badge
   * @default "sm" */
  size?: "xs" | "sm" | "md" | "lg" | "xl"

  /** Controls the border radius of the badge
   * @default "pill" */
  shape?: "base" | "tag" | "rounded" | "square" | "pill" | "circle"

  /** Element to display as an icon to the left. */
  leftElement?: React.ReactElement

  /** Element to display as an icon to the right. */
  rightElement?: React.ReactElement

  /** If true, disable any interactive element rendered as `leftElement` or `rightElement`
   * @default false */
  disabled?: boolean
}

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-default select-none text-nowrap w-fit",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        success:
          "border-transparent bg-emerald-600 text-white hover:bg-emerald-600/80",
        warning:
          "border-transparent bg-amber-600 text-white hover:bg-amber-600/80",
        info: "border-transparent bg-blue-600 text-white hover:bg-blue-600/80",
        outline: "text-foreground"
      },
      size: {
        xs: "text-xs h-5 px-2",
        sm: "text-xs h-6",
        md: "text-sm h-8",
        lg: "text-base h-9 px-3",
        xl: "text-lg h-10 px-4"
      },
      shape: {
        base: "rounded-sm",
        tag: "rounded-md",
        rounded: "rounded-lg",
        square: "rounded-none",
        pill: "rounded-full",
        circle:
          "rounded-full p-0 flex items-center justify-center overflow-hidden"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      shape: "pill"
    },
    compoundVariants: [
      { size: "xs", shape: "circle", className: "size-3" },
      { size: "sm", shape: "circle", className: "size-4" },
      { size: "md", shape: "circle", className: "size-5" },
      { size: "lg", shape: "circle", className: "size-6" },
      { size: "xl", shape: "circle", className: "size-7" }
    ]
  }
)

const iconVariants = cva("shrink-0", {
  variants: {
    badgeSize: {
      xs: "size-3",
      sm: "size-3",
      md: "size-4",
      lg: "size-5",
      xl: "size-6"
    },
    side: {
      left: "",
      right: ""
    }
  },
  compoundVariants: [
    { badgeSize: "xs", side: "left", className: "mr-0.5" },
    { badgeSize: "sm", side: "left", className: "mr-1" },
    { badgeSize: "md", side: "left", className: "mr-1.5" },
    { badgeSize: "lg", side: "left", className: "mr-2" },
    { badgeSize: "xl", side: "left", className: "mr-2.5" },

    { badgeSize: "xs", side: "right", className: "ml-0.5" },
    { badgeSize: "sm", side: "right", className: "ml-1" },
    { badgeSize: "md", side: "right", className: "ml-1.5" },
    { badgeSize: "lg", side: "right", className: "ml-2" },
    { badgeSize: "xl", side: "right", className: "ml-2.5" }
  ]
})

const renderElement = (
  iconElement: React.ReactElement | undefined,
  badgeSize: NonNullable<BadgeProps["size"]>,
  side: "left" | "right"
): React.ReactNode => {
  if (!iconElement) {
    return null
  }
  return React.cloneElement(iconElement as React.ReactElement<any>, {
    className: cn(
      iconVariants({ badgeSize, side }),
      (iconElement.props as any).className
    )
  })
}

function Badge({
  className,
  variant,
  size = "sm",
  shape,
  leftElement,
  rightElement,
  disabled,
  children,
  ...props
}: BadgeProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, "disabled"> &
  VariantProps<typeof badgeVariants>) {
  return (
    <div
      {...props}
      inert={disabled}
      className={cn(
        badgeVariants({ variant, size, shape }),
        "flex items-center",
        className,
        disabled && "opacity-60"
      )}
    >
      {renderElement(leftElement, size, "left")}
      {children}
      {renderElement(rightElement, size, "right")}
    </div>
  )
}

export { Badge, badgeVariants, iconVariants }
export type { BadgeProps }
