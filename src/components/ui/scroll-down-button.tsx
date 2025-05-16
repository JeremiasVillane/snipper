"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

interface ScrollDownButtonProps
  extends Omit<React.HTMLAttributes<HTMLAnchorElement>, "children" | "color">,
    VariantProps<typeof scrollDownLinkVariants> {
  /** @default "fading-arrow" */
  // prettier-ignore
  variant?: "fading-arrow" | "bouncing-arrow" | "spinning-arrow" | "multi-arrow" | "arrow-simple" | "arrow-in-circle" | "pulsing-circle" | "mouse-animated" | "mouse-simple" | "mouse-arrow"
  /**
   * The ID of the element to scroll to (without the '#').
   * Example: "section05"
   */
  targetId: string
  /**
   * Optional additional CSS classes for the button.
   */
  iconContainerClassName?: string
  /**
   * Optional additional CSS classes for the icon element.
   */
  iconElementClassName?: string
  /**
   * Optional text to display alongside the button.
   */
  text?: string
  /**
   * Additional CSS classes applied to the text element.
   */
  textClassName?: string
  /**
   * Offset in pixels to account for fixed headers or other elements.
   * Example: 80 (for an 80px header).
   *
   * @default 80 */
  offset?: number
}

const scrollDownIconVariants = cva("absolute top-0 left-1/2 transform", {
  variants: {
    variant: {
      "fading-arrow":
        "-ml-3 w-6 h-6 border-l border-b border-foreground bg-transparent -rotate-45 animate-fading-arrow",
      "bouncing-arrow":
        "-ml-3 w-6 h-6 border-l border-b border-foreground bg-transparent -rotate-45 animate-bouncing-arrow",
      "spinning-arrow":
        "-ml-3 w-6 h-6 border-l border-b border-foreground bg-transparent -rotate-45 animate-spinning-arrow",
      "multi-arrow": "-ml-3 h-[calc(32px+24px)] w-6",
      "arrow-simple":
        "-ml-3 w-6 h-6 border-l border-b border-foreground bg-transparent -rotate-45",
      "arrow-in-circle":
        "-ml-[23px] w-[46px] h-[46px] border border-foreground rounded-full",
      "pulsing-circle":
        "-ml-[23px] w-[46px] h-[46px] border border-foreground rounded-full",
      "mouse-animated":
        "-ml-[15px] w-[30px] h-[50px] border-2 border-foreground rounded-[50px]",
      "mouse-simple":
        "-ml-[15px] w-[30px] h-[50px] border-2 border-foreground rounded-[50px]",
      "mouse-arrow":
        "-ml-[15px] w-[30px] h-[50px] border-2 border-foreground rounded-[50px]"
    }
  }
})

const scrollDownLinkVariants = cva(
  "relative inline-block cursor-pointer group focus-visible:outline-0 text-foreground",
  {
    variants: {
      variant: {
        "fading-arrow": "pt-[70px]",
        "bouncing-arrow": "pt-[60px]",
        "spinning-arrow": "pt-[70px]",
        "multi-arrow": "pt-[80px]",
        "arrow-simple": "pt-[60px]",
        "arrow-in-circle": "pt-[60px]",
        "pulsing-circle": "pt-[60px]",
        "mouse-animated": "pt-[60px]",
        "mouse-simple": "pt-[60px]",
        "mouse-arrow": "pt-[80px]"
      }
    },
    defaultVariants: {
      variant: "bouncing-arrow"
    }
  }
)

const ScrollDownButton = React.forwardRef<
  HTMLAnchorElement,
  ScrollDownButtonProps
>(
  (
    {
      className,
      variant = "fading-arrow",
      targetId,
      text,
      iconContainerClassName,
      iconElementClassName,
      textClassName,
      offset = 80,
      ...props
    },
    ref
  ) => {
    const handleSmoothScroll = (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" })
      } else {
        console.warn(`Smooth scroll target not found: #${targetId}`)
      }
    }

    const renderIconInternal = () => {
      const commonInternalArrow = cn(
        "absolute w-4 h-4 border-l border-b border-foreground bg-transparent transform -rotate-45",
        iconElementClassName
      )
      const commonInternalDot = cn(
        "absolute w-[6px] h-[6px] rounded-full bg-foreground",
        iconElementClassName
      )

      switch (variant) {
        case "arrow-in-circle":
          return (
            <span
              className={cn(
                commonInternalArrow,
                "left-1/2 top-1/2 -ml-2 -mt-3"
              )}
            />
          )
        case "pulsing-circle":
          return (
            <>
              <span className="animate-pulsing-circle absolute left-0 top-0 -z-10 h-[44px] w-[44px] rounded-full opacity-0 shadow-[0_0_0_0_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_0_60px_rgba(255,255,255,0.1)]" />
              <span
                className={cn(
                  commonInternalArrow,
                  "left-1/2 top-1/2 -ml-2 -mt-3"
                )}
              />
            </>
          )
        case "multi-arrow":
          const multiArrowBase =
            "absolute w-6 h-6 opacity-0 box-border -ml-3 border-l-foreground border-b-foreground border-l border-solid border-b left-2/4 top-0 -rotate-45 animate-multi-arrow opacity-0"
          return (
            <>
              <span
                className={cn(
                  multiArrowBase,
                  "top-0 [animation-delay:0s]",
                  iconElementClassName
                )}
              />
              <span
                className={cn(
                  multiArrowBase,
                  "top-[16px] [animation-delay:.15s]",
                  iconElementClassName
                )}
              />
              <span
                className={cn(
                  multiArrowBase,
                  "top-[32px] [animation-delay:.3s]",
                  iconElementClassName
                )}
              />
            </>
          )
        case "mouse-simple":
          return (
            <span
              className={cn(commonInternalDot, "left-1/2 top-[10px] -ml-[3px]")}
            />
          )
        case "mouse-arrow":
          return (
            <>
              <span
                className={cn(
                  commonInternalDot,
                  "left-1/2 top-[10px] -ml-[3px]"
                )}
              />
              <span
                className={cn(
                  "absolute bottom-[-18px] left-1/2 -ml-[9px] h-[18px] w-[18px] -rotate-45 transform border-b border-l border-foreground bg-transparent",
                  iconElementClassName
                )}
              />
            </>
          )
        case "mouse-animated":
          return (
            <span
              className={cn(
                commonInternalDot,
                "animate-mouse-animated left-1/2 top-[10px] -ml-[3px] opacity-0"
              )}
            />
          )

        default:
          return null
      }
    }

    return (
      <a
        ref={ref}
        className={cn(
          scrollDownLinkVariants({ variant }),
          className,
          iconElementClassName
        )}
        href={`#${targetId}`}
        onClick={handleSmoothScroll}
        aria-label={`Scroll down to ${targetId}`}
        {...props}
      >
        <span
          className={cn(
            scrollDownIconVariants({ variant }),
            iconContainerClassName
          )}
        >
          {renderIconInternal()}
        </span>

        {!!text && (
          <span
            className={cn(
              "absolute -bottom-7 left-1/2 -translate-x-1/2 text-lg",
              textClassName ?? "text-foreground/80"
            )}
          >
            {text}
          </span>
        )}
      </a>
    )
  }
)
ScrollDownButton.displayName = "ScrollDownButton"

export { ScrollDownButton, scrollDownIconVariants, scrollDownLinkVariants }
export type { ScrollDownButtonProps }
