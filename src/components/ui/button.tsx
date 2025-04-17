import * as React from "react"
import { Slot, Slottable } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

interface ButtonProps extends BaseButtonProps {
  /** @default "default" */
  // prettier-ignore
  variant?: "default" | "destructive" | "success" | "warning" | "outline" | "secondary" | "ghost" | "link"
  /** @default "default" */
  size?: "default" | "sm" | "xs" | "lg" | "icon"
  /**
   * Indicates if the button is in a loading state. When true, it disables the button and shows a loading spinner, replacing the left icon if present, or prepending it otherwise.
   * @default false */
  isLoading?: boolean
  /** @default false */
  disabled?: boolean
  /** Element to display as an icon to the left of the button's content. Will be replaced by a loading spinner if `isLoading` is true. */
  iconLeft?: React.ReactElement
  /** Element to display as an icon to the right of the button's content. */
  iconRight?: React.ReactElement
  /**
   * Specifies the type of animation to apply to the icon(s) on hover, based on `iconAnimationTarget`.
   * @default "none" */
  // prettier-ignore
  iconAnimation?: "none" | "translateXRight" | "translateXLeft" | "translateYUp" | "translateYDown" | "spinLeft" | "spinRight" | "spinUp" | "spinDown" | "zoomIn" | "zoomOut" | "bounce" | "ping" | "pulse" | "spin"
  /**
   * Determines which icon(s) the `iconAnimation` should target. 'left' targets `iconLeft`, 'right' targets `iconRight`, 'both' targets both, and 'none' applies no animation.
   * @default "none" */
  iconAnimationTarget?: "right" | "left" | "both" | "none"
}

const buttonVariants = cva(
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:opacity-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        success:
          "bg-emerald-500 dark:bg-emerald-600 text-white hover:bg-emerald-500/90 dark:hover:bg-emerald-600/90",
        warning:
          "bg-amber-500 dark:bg-amber-600 text-white hover:bg-amber-500/90 dark:hover:bg-amber-600/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline h-auto px-0 py-0"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        xs: "h-6 rounded-md px-1.5 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
)

const groupSegmentVariants = cva("relative focus-visible:z-10 rounded-none", {
  variants: {
    isFirst: { true: "rounded-l-md" },
    isLast: { true: "rounded-r-md" },
    isOutlineGroup: { true: "", false: "" }
  },
  compoundVariants: [
    // Add divider ONLY if NOT outline AND NOT the first segment
    {
      isFirst: false,
      isOutlineGroup: false,
      className: "border-l border-border"
    },
    // Add negative margin overlap ONLY IF outline AND NOT the first segment
    {
      isFirst: false,
      isOutlineGroup: true,
      className: "-ml-px"
    }
  ]
})

const animationClasses = {
  none: "",
  translateXRight: "transition-transform group-hover:translate-x-0.5",
  translateXLeft: "transition-transform group-hover:-translate-x-0.5",
  translateYUp: "transition-transform group-hover:-translate-y-0.5",
  translateYDown: "transition-transform group-hover:translate-y-0.5",
  spinLeft: "transition-transform group-hover:-rotate-45",
  spinRight: "transition-transform group-hover:rotate-45",
  spinUp: "transition-transform group-hover:-rotate-90",
  spinDown: "transition-transform group-hover:rotate-90",
  zoomIn: "transition-transform group-hover:scale-105",
  zoomOut: "transition-transform group-hover:scale-95",
  bounce: "transition-transform group-hover:animate-bounce",
  ping: "transition-transform group-hover:animate-ping",
  pulse: "transition-transform group-hover:animate-pulse opacity-90",
  spin: "transition-transform group-hover:animate-spin"
}

type BaseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}

const createInsetButton = (name: string) => {
  const Component: React.FC<BaseButtonProps> = () => null
  Component.displayName = name
  return Component
}

const LeftInsetButton = createInsetButton("LeftInsetButton")
const RightInsetButton = createInsetButton("RightInsetButton")

const isInsetButton = (component: React.FC, node: React.ReactNode) =>
  React.isValidElement(node) &&
  typeof node.type !== "string" &&
  (node.type as React.FC).displayName === component.displayName

const Button = React.forwardRef<
  HTMLButtonElement | HTMLDivElement,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      iconLeft,
      iconRight,
      iconAnimation = "none",
      iconAnimationTarget = "none",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const [leftInset, rightInset, centerChildren] = (() => {
      const left: React.ReactElement<BaseButtonProps>[] = []
      const right: React.ReactElement<BaseButtonProps>[] = []
      const center: React.ReactNode[] = []

      React.Children.forEach(children, (child) => {
        if (
          React.isValidElement(child) &&
          isInsetButton(LeftInsetButton, child)
        )
          left.push(child as React.ReactElement<BaseButtonProps>)
        else if (
          React.isValidElement(child) &&
          isInsetButton(RightInsetButton, child)
        )
          right.push(child as React.ReactElement<BaseButtonProps>)
        else center.push(child)
      })

      return [left[0], right[0], center]
    })()

    const isGroup = !!leftInset || !!rightInset
    const isDisabled = isLoading || disabled
    const animationClass =
      iconAnimation !== "none" ? animationClasses[iconAnimation] : ""
    const shouldAnimate = (side: "left" | "right") =>
      [side, "both"].includes(iconAnimationTarget) ||
      !(!!iconLeft && !!iconRight)

    const renderIcon = (
      icon: React.ReactElement<any, any> | undefined,
      side: "left" | "right"
    ) =>
      icon &&
      React.cloneElement(icon, {
        className: cn(
          "shrink-0",
          icon.props.className,
          shouldAnimate(side) && animationClass
        )
      })

    if (isGroup) {
      const isOutline = variant === "outline"
      const hasCenter = centerChildren.length > 0

      const renderSegment = (
        segmentProps: BaseButtonProps & { className?: string },
        segmentConfig: {
          isFirst: boolean
          isLast: boolean
          isOutlineGroup: boolean
          content: React.ReactNode
        }
      ) => {
        const { isFirst, isLast, isOutlineGroup, content } = segmentConfig
        const {
          asChild: segmentAsChild,
          disabled: segmentDisabled,
          ...restSegmentProps
        } = segmentProps
        const Comp = segmentAsChild ? Slot : "button"
        const finalDisabled = segmentDisabled ?? isDisabled

        return React.createElement(
          Comp,
          {
            type: "button",
            ...restSegmentProps,
            ...(!segmentAsChild && { disabled: finalDisabled }),
            className: cn(
              buttonVariants({ variant, size }),
              groupSegmentVariants({ isFirst, isLast, isOutlineGroup }),
              restSegmentProps.className
            )
          },
          content
        )
      }

      return (
        <div
          className={cn(
            "inline-flex items-stretch overflow-hidden rounded-md shadow-sm",
            className
          )}
          ref={ref as React.Ref<HTMLDivElement>}
          role="group"
        >
          {leftInset &&
            renderSegment(leftInset.props, {
              isFirst: true,
              isLast: !hasCenter && !rightInset,
              isOutlineGroup: isOutline,
              content: leftInset.props.children
            })}
          {hasCenter &&
            renderSegment(props, {
              isFirst: !leftInset,
              isLast: !rightInset,
              isOutlineGroup: isOutline,
              content: (
                <>
                  {isLoading && (
                    <Loader2 className="size-4 shrink-0 animate-spin" />
                  )}
                  {!isLoading && renderIcon(iconLeft, "left")}
                  <Slottable>{centerChildren}</Slottable>
                  {renderIcon(iconRight, "right")}
                </>
              )
            })}
          {rightInset &&
            renderSegment(rightInset.props, {
              isFirst: !leftInset && !hasCenter,
              isLast: true,
              isOutlineGroup: isOutline,
              content: rightInset.props.children
            })}
        </div>
      )
    }

    const Comp: React.ElementType = asChild ? Slot : "button"
    const shouldShowIcons = variant !== "link" && size !== "icon"
    const loader = isLoading && (
      <Loader2 className="size-4 shrink-0 animate-spin" />
    )

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={isDisabled}
        {...props}
      >
        {shouldShowIcons && (isLoading ? loader : renderIcon(iconLeft, "left"))}
        <Slottable>{children}</Slottable>
        {shouldShowIcons && renderIcon(iconRight, "right")}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants, LeftInsetButton, RightInsetButton }
export type { ButtonProps, BaseButtonProps as InsetButtonProps }
