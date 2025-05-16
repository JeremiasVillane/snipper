"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

interface AccordionProps {
  /** @default "default" */
  variant?: "default" | "separated" | "contained" | "tabs"
  /** @default "outline" */
  styleVariant?: "outline" | "fill"
  type: "single" | "multiple"
  /** @default false */
  collapsible?: boolean
}

interface AccordionContextValue {
  variant: AccordionProps["variant"]
  styleVariant: AccordionProps["styleVariant"]
}

const AccordionContext = React.createContext<AccordionContextValue>({
  variant: "default",
  styleVariant: "outline"
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
      className: "px-4 border rounded-md"
    },
    {
      variant: "separated",
      styleVariant: "fill",
      className: "px-4 border-none rounded-md bg-secondary"
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
        "px-4 border-b last:border-none first:rounded-t-md last:rounded-b-md bg-muted"
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
  className,
  children,
  ...props
}: AccordionPrimitiveRootProps & AccordionProps) => {
  return (
    <AccordionContext.Provider value={{ variant, styleVariant }}>
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
  React.ComponentRef<typeof AccordionPrimitive.Item>,
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
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { variant } = React.useContext(AccordionContext)
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          variant === "tabs" ? "data-[state=closed]:py-2" : "",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
export type { AccordionProps }
