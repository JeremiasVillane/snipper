"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cva } from "class-variance-authority"
import {
  AlertTriangle,
  CheckCircle,
  Info,
  InfoIcon,
  X,
  XCircle
} from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface AlertDialogProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root> {
  /** @default "default" */
  variant?: "default" | "success" | "destructive" | "warning" | "info"
  /** @default "left" */
  styleVariant?: "left" | "center"
  /** @default false */
  withIcon?: boolean
  customIcon?: React.ReactNode
  /** @default false */
  separatedHeader?: boolean
  /** @default false */
  separatedFooter?: boolean
}

interface AlertDialogContextValue {
  variant: AlertDialogProps["variant"]
  styleVariant: AlertDialogProps["styleVariant"]
  withIcon: boolean
  customIcon?: React.ReactNode
  separatedHeader: boolean
  separatedFooter: boolean
}

const AlertDialogContext = React.createContext<AlertDialogContextValue>({
  variant: "default",
  styleVariant: "left",
  withIcon: false,
  separatedHeader: false,
  separatedFooter: false
})

const alertDialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 sm:rounded-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
)

const headerVariantColors: Record<string, string> = {
  default: "",
  success: "text-green-600",
  destructive: "text-red-600",
  warning: "text-yellow-600",
  info: "text-blue-600"
}

// Specific bar/body layout for 'separated-header' is handled inside the component logic.
const alertDialogHeaderVariants = cva("flex flex-col space-y-2", {
  variants: {
    variant: headerVariantColors,
    styleVariant: {
      left: "text-left",
      center: "text-center"
    }
  },
  defaultVariants: {
    variant: "default",
    styleVariant: "left"
  }
})

const alertDialogTitleVariants = cva("text-lg font-semibold", {
  variants: {
    // Is an inline icon being rendered *by the title*? (Only for separated-header)
    hasInlineIcon: {
      true: "flex items-center gap-2",
      false: ""
    }
  },
  defaultVariants: {
    hasInlineIcon: false
  }
})

const alertDialogFooterVariants = cva(
  "flex flex-col-reverse sm:flex-row sm:space-x-2",
  {
    variants: {
      styleVariant: {
        left: "sm:justify-end",
        center: "sm:justify-center"
      }
    },
    defaultVariants: {
      styleVariant: "left"
    }
  }
)

const variantIcons = {
  default: <InfoIcon />,
  success: <CheckCircle className="text-green-600" />,
  destructive: <XCircle className="text-red-600" />,
  warning: <AlertTriangle className="text-yellow-600" />,
  info: <Info className="text-blue-600" />
}

type AlertDialogPrimitiveRootProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Root
>

const AlertDialog = ({
  variant = "default",
  styleVariant = "left",
  withIcon = false,
  customIcon,
  separatedHeader = false,
  separatedFooter = false,
  children,
  ...props
}: AlertDialogPrimitiveRootProps & AlertDialogProps) => (
  <AlertDialogContext.Provider
    value={{
      variant,
      styleVariant,
      withIcon,
      customIcon,
      separatedHeader,
      separatedFooter
    }}
  >
    <AlertDialogPrimitive.Root {...props}>{children}</AlertDialogPrimitive.Root>
  </AlertDialogContext.Provider>
)

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { separatedHeader } = React.useContext(AlertDialogContext)
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          alertDialogContentVariants(),
          separatedHeader ? "p-6 pt-4" : "p-6",
          className
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  )
})
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { variant, styleVariant, withIcon, customIcon, separatedHeader } =
    React.useContext(AlertDialogContext)

  // Prepare children arrays
  const titleElements: React.ReactNode[] = []
  const descriptionElements: React.ReactNode[] = []
  const otherElements: React.ReactNode[] = []

  // Sort children into categories
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (
        typeof child.type !== "string" &&
        (child.type as React.FC & { displayName?: string }).displayName ===
          AlertDialogTitle.displayName
      ) {
        titleElements.push(child)
      } else if (
        typeof child.type !== "string" &&
        (child.type as React.FC & { displayName?: string }).displayName ===
          AlertDialogDescription.displayName
      ) {
        descriptionElements.push(child)
      } else {
        otherElements.push(child)
      }
    } else {
      otherElements.push(child) // Keep text nodes, etc.
    }
  })

  const bodyIcon = customIcon ?? (variant ? variantIcons[variant] : null)

  if (separatedHeader) {
    // --- Separated Header Rendering ---
    return (
      <div ref={ref} className={cn("flex flex-col", className)} {...props}>
        {/* 1. Header Bar */}
        <div
          className={cn(
            "-mx-6 mb-0 flex items-center justify-between border-b px-6 pb-3",
            headerVariantColors[variant ?? "default"] || "text-foreground"
          )}
        >
          {/* Render Title(s) inside the bar */}
          <div
            className={cn(
              "flex min-w-0 flex-grow items-center",
              styleVariant === "center" ? "justify-center" : "justify-start"
            )}
          >
            {titleElements}
          </div>

          {/* Automatic Close Button */}
          <AlertDialogPrimitive.Cancel
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "icon",
                className: "!ml-4 !h-7 !w-7 flex-shrink-0"
              }),
              "text-muted-foreground hover:text-accent-foreground"
            )}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </AlertDialogPrimitive.Cancel>
        </div>

        {/* 2. Body Area (Description + Others) */}
        <div
          className={cn(
            "w-full pt-5",
            styleVariant === "center" ? "text-center" : "text-left"
          )}
        >
          {descriptionElements}
          {otherElements}
        </div>
      </div>
    )
  } else {
    // --- Standard Header Rendering ---
    return (
      <div
        ref={ref}
        className={cn(
          alertDialogHeaderVariants({ variant, styleVariant }),
          className
        )}
        {...props}
      >
        {withIcon && bodyIcon && (
          <div
            className={cn(
              "flex items-center justify-center rounded-full",
              styleVariant === "left"
                ? "mb-1 size-9 [&>svg]:size-5"
                : "mx-auto mb-2 size-14 [&>svg]:size-7",
              variant === "default" ? "bg-muted" : "",
              variant === "success" ? "bg-green-600/10" : "",
              variant === "destructive" ? "bg-destructive/10" : "",
              variant === "warning" ? "bg-yellow-600/10" : "",
              variant === "info" ? "bg-blue-600/10" : ""
            )}
          >
            {bodyIcon}
          </div>
        )}
        {children}
      </div>
    )
  }
})
AlertDialogHeader.displayName = "AlertDialogHeader"

// AlertDialogTitle: Handles inline icon rendering for separated header
const AlertDialogTitle = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, children, ...props }, ref) => {
  const { variant, withIcon, customIcon, separatedHeader } =
    React.useContext(AlertDialogContext)

  // Icon specifically for *inline* rendering in separated header title
  const inlineIconVariant = variant
  const inlineIcon =
    customIcon ?? (inlineIconVariant ? variantIcons[inlineIconVariant] : null)
  const showInlineIcon = !!(separatedHeader && withIcon && inlineIcon)

  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={cn(
        alertDialogTitleVariants({ hasInlineIcon: showInlineIcon }),
        className
      )}
      {...props}
    >
      {/* Render INLINE icon if separated */}
      {showInlineIcon &&
        React.isValidElement(inlineIcon) &&
        React.cloneElement(
          inlineIcon as React.ReactElement<{ className?: string }>,
          {
            className: cn(
              "h-5 w-5 flex-shrink-0",
              (inlineIcon as React.ReactElement<{ className?: string }>).props
                .className
            )
          }
        )}
      {/* The actual title text */}
      {children}
    </AlertDialogPrimitive.Title>
  )
})
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-balance text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { styleVariant, separatedFooter } = React.useContext(AlertDialogContext)
  return (
    <div
      ref={ref}
      className={cn(
        alertDialogFooterVariants({ styleVariant }),
        separatedFooter ? "-mx-6 -mb-6 border-t px-6 py-3" : "",
        className
      )}
      {...props}
    />
  )
})
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogAction = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger
}
export type { AlertDialogProps }
