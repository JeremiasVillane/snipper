"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Optional React element to be displayed as an icon at the beginning of the input,
   * inside the border. Typically an SVG or an icon component.
   */
  startIcon?: React.ReactElement<HTMLElement | SVGElement | unknown>

  /**
   * Optional React element to be displayed as an icon at the end of the input,
   * inside the border. Typically an SVG or an icon component.
   */
  endIcon?: React.ReactElement<HTMLElement | SVGElement | unknown>

  /**
   * Optional string content displayed inline at the start of the input,
   * after the start icon (if present), inside the border. Useful for prefixes like units or symbols.
   */
  startInline?: string

  /**
   * Optional string content displayed inline at the end of the input,
   * before the end icon or character counter (if present), inside the border. Useful for suffixes.
   */
  endInline?: string

  /**
   * Optional React node displayed as an addon before the input field,
   * visually attached but outside the input's main container/border.
   * Useful for labels, buttons, or dropdown triggers associated with the input.
   */
  startAddon?: React.ReactNode

  /**
   * Optional React node displayed as an addon after the input field,
   * visually attached but outside the input's main container/border.
   * Useful for labels, buttons, or dropdown triggers associated with the input.
   */
  endAddon?: React.ReactNode

  /**
   * Determines if and where the character count (current/maxLength) is displayed.
   * Requires the 'maxLength' prop (from HTMLInputElement attributes) to be set.
   * - 'inside': Show counter inside the input field border, near the end.
   * - 'outside': Show counter below the input field.
   * - 'false': Do not show the counter (default).
   * @default "false"
   */
  showMaxLength?: "inside" | "outside" | "false"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startIcon,
      endIcon,
      startInline,
      endInline,
      startAddon,
      endAddon,
      showMaxLength = "false",
      value,
      onChange,
      defaultValue,
      maxLength,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = maxLength
        ? e.target.value.slice(0, maxLength)
        : e.target.value
      if (!isControlled) setInternalValue(newValue)
      onChange?.(e)
    }

    const characterCount = String(currentValue).length
    const hasAddons = startAddon || endAddon

    const renderInline = (content: React.ReactNode, side: "start" | "end") => (
      <span
        className={cn(
          "flex select-none items-center bg-background text-sm text-muted-foreground",
          side === "start"
            ? "order-after-icon pl-2"
            : "order-before-counter pr-2"
        )}
      >
        {content}
      </span>
    )

    return (
      <div className="w-full">
        <div
          className={cn(
            "flex items-stretch rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring",
            hasAddons && "overflow-hidden"
          )}
        >
          {startAddon && (
            <div className="flex select-none items-center border-r border-input bg-muted/60 px-3 text-foreground/80">
              {startAddon}
            </div>
          )}

          <div className="relative flex flex-1 items-center">
            {startIcon && (
              <div className="pl-3 text-muted-foreground/80">
                {React.cloneElement(
                  startIcon as React.ReactElement<HTMLElement | SVGElement>,
                  {
                    className: cn(
                      "size-4",
                      (
                        startIcon?.props as React.HTMLProps<
                          HTMLElement | SVGElement
                        >
                      )?.className
                    )
                  }
                )}
              </div>
            )}

            {startInline && renderInline(startInline, "start")}

            <input
              type={type}
              className={cn(
                "w-full min-w-0 flex-1 bg-transparent py-2 text-sm",
                "placeholder:text-muted-foreground focus-visible:outline-none",
                "file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:opacity-50",
                startIcon ? "pl-2" : "pl-3",
                endIcon || endInline || showMaxLength === "inside"
                  ? "pr-2"
                  : "pr-3",
                !hasAddons && "rounded-md",
                className
              )}
              ref={ref}
              value={currentValue ?? ""}
              onChange={handleChange}
              maxLength={maxLength}
              {...props}
            />

            {endInline && renderInline(endInline, "end")}

            {showMaxLength === "inside" && maxLength && (
              <span className="select-none pr-2 text-xs text-muted-foreground/80">
                {characterCount}/{maxLength}
              </span>
            )}

            {endIcon && (
              <div className="pr-3 text-muted-foreground/80">
                {React.cloneElement(
                  endIcon as React.ReactElement<HTMLElement | SVGElement>,
                  {
                    className: cn(
                      "size-4",
                      (
                        endIcon?.props as React.HTMLProps<
                          HTMLElement | SVGElement
                        >
                      )?.className
                    )
                  }
                )}
              </div>
            )}
          </div>

          {endAddon && (
            <div className="flex select-none items-center border-l border-input bg-accent px-3">
              {endAddon}
            </div>
          )}
        </div>

        {showMaxLength === "outside" && maxLength && (
          <div className="mt-1 flex justify-end text-xs text-muted-foreground">
            {characterCount}/{maxLength}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
export type { InputProps }
