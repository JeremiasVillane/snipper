import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /**
   * Optional icon to display as a marker. It has priority over the List icon.
   */
  icon?: React.ReactNode
  /**
   * Contents of the list item.
   */
  children: React.ReactNode
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, children, icon, ...props }, ref) => {
    const hasIcon = icon != null
    const paddingClass = hasIcon ? "pl-6" : ""

    return (
      <li
        ref={ref}
        className={cn("relative", paddingClass, className)}
        data-list-item-host="true"
        {...props}
      >
        {hasIcon && (
          <span
            className="absolute left-0 top-[0.2em] flex h-5 w-5 items-center justify-center"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        {children}
      </li>
    )
  }
)
ListItem.displayName = "ListItem"
;(ListItem as any).__IS_LIST_ITEM = true

const listVariants = cva("text-base text-foreground my-2", {
  variants: {
    variant: {
      default: "list-disc list-outside [&>li]:pl-1.5 ml-5",
      numbered: "list-decimal list-outside [&>li]:pl-2.5 ml-5",
      "upper-alpha": "list-[upper-alpha] list-outside [&>li]:pl-2.5 ml-5",
      "lower-alpha": "list-[lower-alpha] list-outside [&>li]:pl-2.5 ml-5",
      "upper-roman": "list-[upper-roman] list-outside [&>li]:pl-2.5 ml-5",
      "lower-roman": "list-[lower-roman] list-outside [&>li]:pl-2.5 ml-5",
      arrow:
        "list-none [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0 [&>li]:before:content-['⮞'] [&>li]:before:text-foreground/80",
      bullet:
        "list-none [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:-top-1 [&>li]:before:content-['•'] [&>li]:before:text-foreground/80 [&>li]:before:text-2xl",
      "bullet-outline":
        "list-none [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:-top-1 [&>li]:before:content-['◦'] [&>li]:before:text-foreground/80 [&>li]:before:text-2xl",
      triangle:
        "list-none [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:-top-1.5 [&>li]:before:content-['‣'] [&>li]:before:text-foreground/80 [&>li]:before:text-3xl",
      square:
        "list-none [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0 [&>li]:before:content-['▪'] [&>li]:before:text-foreground/80",
      dash: "list-none [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0 [&>li]:before:content-['-'] [&>li]:before:text-foreground/80",
      check:
        "list-none [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0 [&>li]:before:content-['✓'] [&>li]:before:text-primary",
      x: "list-none [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0 [&>li]:before:content-['✗'] [&>li]:before:text-primary",
      none: "list-none p-0"
    },
    spacing: {
      default: "[&>li]:mb-1.5",
      tight: "[&>li]:mb-0.5",
      relaxed: "[&>li]:mb-2",
      loose: "[&>li]:mb-3",
      none: "[&>li]:mb-0"
    }
  },
  defaultVariants: {
    variant: "default",
    spacing: "default"
  },
  compoundVariants: [{ variant: "none", className: "my-0" }]
})

interface ListProps
  extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement>,
    VariantProps<typeof listVariants> {
  /**
   * Optional icon to use as a marker for ALL child ListItems.
   * A child ListItem can override this icon by defining its own ‘icon’ prop.
   */
  icon?: React.ReactNode
  /** @default "default" */
  // prettier-ignore
  variant?: "default" | "numbered" | "upper-alpha" | "lower-alpha" | "upper-roman" | "lower-roman" | "arrow" | "bullet" | "bullet-outline" | "triangle" | "square" | "dash" | "check" | "x" | "none"
  /** @default "default" */
  spacing?: "default" | "tight" | "relaxed" | "loose" | "none"
  /**
   * Child elements of the list. **Expected to be `<ListItem>` components.**
   * Other types of children will be filtered out.
   */
  children?: React.ReactNode
}

const List = React.forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
  ({ className, variant, spacing, icon, children, ...props }, ref) => {
    const ListComponent =
      !!variant &&
      [
        "numbered",
        "upper-alpha",
        "lower-alpha",
        "upper-roman",
        "lower-roman"
      ].includes(variant)
        ? "ol"
        : "ul"
    const hasCustomIcon = icon != null
    const effectiveVariant = hasCustomIcon ? "none" : variant

    const processedChildren = React.Children.map(children, (child) => {
      if (
        React.isValidElement<ListItemProps>(child) &&
        (child.type as any)?.__IS_LIST_ITEM === true
      ) {
        return React.cloneElement(child, {
          icon: child.props.icon ?? icon
        })
      }

      if (child != null && child !== false && typeof child !== "boolean") {
        if (!React.isValidElement(child)) {
          console.warn(
            "List component received a direct child that is not a ListItem component. It will be ignored:",
            child
          )
        } else if (!(child.type as any)?.__IS_LIST_ITEM) {
          console.warn(
            "List component received a direct child of an invalid type. Only <ListItem> components are rendered. It will be ignored."
          )
        }
      }

      return null
    })

    return (
      <ListComponent
        ref={ref as any}
        className={cn(
          listVariants({ variant: effectiveVariant, spacing }),
          "[li[data-list-item-host=true]>_&]:my-1.5",
          className
        )}
        {...props}
      >
        {processedChildren}
      </ListComponent>
    )
  }
)
List.displayName = "List"

export { List, ListItem, listVariants }
export type { ListProps, ListItemProps }
