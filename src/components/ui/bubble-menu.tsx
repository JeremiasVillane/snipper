"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"

export const dynamic = "auto"

interface BubbleMenuProps {
  /**
   * The content of the bubble menu, typically interactive elements like buttons or links.
   */
  children?: React.ReactNode
  /**
   * The distance of the child elements from the center button in pixels.
   * @default 60 */
  radius?: number
  /**
   * The size (width and height) of the main toggle button in pixels.
   * @default 40 */
  buttonSize?: number
  /**
   * The size (width and height) of the individual child action buttons in pixels.
   * @default 35 */
  subButtonSize?: number
}

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void
) {
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref?.current && !ref?.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, callback])
}

function BubbleMenu({
  children,
  radius = 60,
  buttonSize = 30,
  subButtonSize = 40,
  className,
  ...props
}: BubbleMenuProps & React.ComponentPropsWithRef<"div">) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)

  const totalChildren = React.Children.count(children)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  useClickOutside(menuRef, () => {
    if (isOpen) setIsOpen(false)
  })

  if (!isMounted) {
    return (
      <div
        className={cn("relative", className)}
        style={{ width: `${buttonSize}px`, height: `${buttonSize}px` }}
        {...props}
      />
    )
  }

  return (
    <div
      ref={menuRef}
      className={cn("relative", className)}
      style={{ width: `${buttonSize}px`, height: `${buttonSize}px` }}
      {...props}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-md transition-[transform,shadow] duration-200 hover:bg-gray-200 hover:shadow-lg active:scale-90 dark:hover:bg-gray-800 ${isOpen ? "bg-background shadow-sm" : ""} `}
        style={{ width: `${buttonSize}px`, height: `${buttonSize}px` }}
        aria-label="Toggle bubble menu"
      >
        <Plus
          className={cn(
            "size-4 transition-transform duration-200 ease-in-out",
            isOpen ? "-rotate-45" : ""
          )}
        />
      </button>

      <div className="pointer-events-none absolute left-0 top-0 z-50 size-full">
        {React.Children.map(children, (child, index) => {
          const angle = (index * 360) / totalChildren
          const radians = (angle * Math.PI) / 180
          const x = Math.cos(radians) * radius
          const y = Math.sin(radians) * radius

          return (
            <div
              className={`absolute flex items-center justify-center rounded-full bg-muted shadow-md transition-[opacity,transform] duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800 ${
                isOpen
                  ? "pointer-events-auto scale-100 opacity-100"
                  : "pointer-events-none scale-50 opacity-0"
              }`}
              style={{
                width: `${subButtonSize}px`,
                height: `${subButtonSize}px`,
                left: `calc(50% - ${subButtonSize / 2}px)`,
                top: `calc(50% - ${subButtonSize / 2}px)`,
                transform: isOpen
                  ? `translate(${x}px, ${y}px)`
                  : "translate(0, 0)",
                transitionDelay: `${isOpen ? index * 0.1 : 0}s`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex size-full items-center justify-center transition-colors duration-100 ease-in-out">
                {child}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { BubbleMenu }
export type { BubbleMenuProps }
