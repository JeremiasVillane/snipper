"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { cva } from "class-variance-authority"
import { ChevronDown, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface AccordionProps {
  /** Specifies the display variant of the accordion.
   * @default "default" */
  variant?: "default" | "separated" | "contained" | "tabs"

  /** Determines the style variant for the accordion's appearance.
   *  @default "outline" */
  styleVariant?: "outline" | "fill"

  /** Specifies the icon used for the trigger.
   * @default "chevron" */
  trigger?: "chevron" | "plus-minus"

  /** Specifies the position of the trigger icon.
   * @default "right" */
  triggerPosition?: "right" | "left"

  /**  Indicates the accordion behavior. Use "single" to allow only one section to be open at a time,
   * or "multiple" to permit multiple sections to be open simultaneously.
   * @default "single" */
  type: "single" | "multiple"

  /** Enables or disables the ability for sections to be collapsed.
   *  @default true */
  collapsible?: boolean
}

interface AccordionContextValue {
  variant: AccordionProps["variant"]
  styleVariant: AccordionProps["styleVariant"]
  trigger: AccordionProps["trigger"]
  triggerPosition: AccordionProps["triggerPosition"]
}

const AccordionContext = React.createContext<AccordionContextValue>({
  variant: "default",
  styleVariant: "outline",
  trigger: "chevron",
  triggerPosition: "right"
})

const accordionVariants = cva("max-w-lg my-4 w-full", {
  variants: {
    variant: {
      default: "",
      separated: "space-y-2",
      contained: "",
      tabs: "space-y-2"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

const accordionItemVariants = cva("", {
  // Managed in compound
  variants: {
    variant: {
      default: "",
      separated: "",
      contained: "",
      tabs: ""
    },
    styleVariant: {
      outline: "",
      fill: ""
    }
  },
  compoundVariants: [
    { variant: "default", className: "border-b px-4" },
    {
      variant: "separated",
      styleVariant: "outline",
      className: "px-4 border rounded-md hover:border-muted-foreground/80"
    },
    {
      variant: "separated",
      styleVariant: "fill",
      className:
        "px-4 border-none rounded-md bg-secondary/80 hover:bg-secondary"
    },
    {
      variant: "contained",
      styleVariant: "outline",
      className:
        "px-4 border border-b-0 last:border-b first:rounded-t-md last:rounded-b-md"
    },
    {
      variant: "contained",
      styleVariant: "fill",
      className:
        "px-4 border-b last:border-none first:rounded-t-md last:rounded-b-md bg-secondary/80 hover:bg-secondary"
    },
    {
      variant: "tabs",
      styleVariant: "fill",
      className: "px-4 border-none rounded-md data-[state=open]:bg-secondary"
    },
    {
      variant: "tabs",
      styleVariant: "outline",
      className: "px-4 border rounded-md data-[state=closed]:border-none"
    }
  ],
  defaultVariants: {
    variant: "default",
    styleVariant: "outline"
  }
})

type AccordionPrimitiveRootProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Root
>

const Accordion = ({
  variant = "default",
  styleVariant = "outline",
  trigger = "chevron",
  triggerPosition = "right",
  className,
  children,
  ...props
}: AccordionPrimitiveRootProps & AccordionProps) => {
  return (
    <AccordionContext.Provider
      value={{ variant, styleVariant, trigger, triggerPosition }}
    >
      <AccordionPrimitive.Root
        className={cn(accordionVariants({ variant }), className)}
        {...props}
      >
        {children}
      </AccordionPrimitive.Root>
    </AccordionContext.Provider>
  )
}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  const { variant, styleVariant } = React.useContext(AccordionContext)
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(
        accordionItemVariants({ variant, styleVariant }),
        className
      )}
      {...props}
    />
  )
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    collapsible?: boolean
  }
>(({ className, children, collapsible = true, ...props }, ref) => {
  const { variant, trigger, triggerPosition } =
    React.useContext(AccordionContext)

  let hasTitle = false
  let hasSubtitle = false

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if ((child.type as any).isAccordionTitle) {
        hasTitle = true
      }
      if ((child.type as any).isAccordionSubtitle) {
        hasSubtitle = true
      }
    }
  })

  const applyMargin = hasTitle && hasSubtitle

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all [&[data-state=open]>svg]:rotate-180",
          variant === "tabs" ? "data-[state=closed]:py-2" : "",
          trigger === "plus-minus"
            ? "category>svg>path:last-child]:rotate-90 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg>path:last-child]:opacity-0 [&[data-state=open]>svg]:rotate-180"
            : "",
          triggerPosition === "left"
            ? "justify-start gap-3 [&>svg]:-order-1"
            : "",
          applyMargin ? "[&>svg]:-mt-4" : "",
          className
        )}
        onClick={(e) => !collapsible && e.preventDefault()}
        {...props}
      >
        <section className="flex flex-col items-start">{children}</section>
        {trigger === "chevron" ? (
          <ChevronDown
            size={16}
            className="shrink-0 opacity-60 transition-transform duration-200"
          />
        ) : (
          <PlusIcon
            size={16}
            className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
            aria-hidden="true"
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => {
  return (
    <h1
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between font-medium",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
})
AccordionTitle.displayName = "AccordionTitle"
;(AccordionTitle as any).isAccordionTitle = true

const AccordionSubtitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-sm font-normal", className)} {...props}>
    {children}
  </h2>
))
AccordionSubtitle.displayName = "AccordionSubtitle"
;(AccordionSubtitle as any).isAccordionSubtitle = true

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { triggerPosition } = React.useContext(AccordionContext)
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        "overflow-hidden text-sm text-muted-foreground transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        triggerPosition === "left" ? "ps-7" : "",
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </AccordionPrimitive.Content>
  )
})
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AccordionTitle,
  AccordionSubtitle
}
export type { AccordionProps }
