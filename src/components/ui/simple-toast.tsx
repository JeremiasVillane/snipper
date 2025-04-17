"use client"

import * as React from "react"
import {
  CheckCircle,
  InfoIcon,
  LucideProps,
  TriangleAlert,
  XCircle,
  XIcon
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

const EXIT_ANIMATION_DURATION = 150

const ENTER_ANIMATION_TYPES = [
  "fade-in",
  "slide-down",
  "slide-up",
  "slide-left",
  "slide-right",
  "zoom-in"
] as const

const EXIT_ANIMATION_TYPES = [
  "fade-out",
  "slide-out-up",
  "slide-out-down",
  "slide-out-right",
  "slide-out-left",
  "zoom-out"
] as const

type ToastEnterAnimationType = (typeof ENTER_ANIMATION_TYPES)[number]
type ToastExitAnimationType = (typeof EXIT_ANIMATION_TYPES)[number]

type ToastType = "info" | "success" | "warning" | "error"

type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center"

interface ToastAction {
  label: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

interface ToastProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  id: string
  type?: ToastType
  title: React.ReactNode
  description?: React.ReactNode
  /** Duration in ms. `Infinity` to disable auto-close. */
  duration?: number
  position?: ToastPosition
  /** @default "fade-in" */
  enterAnimationType?: ToastEnterAnimationType
  /** @default "fade-out" */
  exitAnimationType?: ToastExitAnimationType
  /** Custom icon that replaces the default icon of the type. */
  customIcon?: React.ReactNode
  /** Primary Action (Button with 'default' variant). */
  primaryAction?: ToastAction
  /** Secondary Action (Button with 'outline' variant). */
  secondaryAction?: ToastAction
  /** Callback on discard (manual, per action or per time). */
  onDismiss?: (toast: ToastProps) => void
  /** Specific callback when closing automatically by time. */
  onAutoClose?: (toast: ToastProps) => void
  /** Displays an 'X' button to close manually. */
  showCloseButton?: boolean
  /** Displays a progress bar indicating the remaining time. */
  showProgressBar?: boolean
  isExiting?: boolean
}

interface ToasterProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultDuration?: number
  defaultPosition?: ToastPosition
  defaultEnterAnimationType?: ToastEnterAnimationType
  defaultExitAnimationType?: ToastExitAnimationType
  defaultShowCloseButton?: boolean
  defaultShowProgressBar?: boolean
  gap?: number
}

type ToastOptions = Omit<ToastProps, "id" | "isExiting">

interface ToastState {
  toasts: ToastProps[]
}
let memoryState: ToastState = { toasts: [] }
const listeners: Array<(state: ToastState) => void> = []

const setState = (newState: Partial<ToastState>) => {
  memoryState = { ...memoryState, ...newState }
  listeners.forEach((listener) => listener(memoryState))
}

const toast = (options: ToastOptions) => {
  const id = Date.now().toString()
  // `duration: 0` is treated as Infinity for self-closing logic.
  const duration = options.duration === 0 ? Infinity : options.duration
  const newToast: ToastProps = { ...options, id, duration, isExiting: false }

  setState({ toasts: [...memoryState.toasts, newToast] })
  return id
}
const dismiss = (id: string) => {
  const toastToDismiss = memoryState.toasts.find((t) => t.id === id)

  if (!toastToDismiss || toastToDismiss.isExiting) return

  if (toastToDismiss.onDismiss) {
    toastToDismiss.onDismiss({ ...toastToDismiss, isExiting: true })
  }

  setState({
    toasts: memoryState.toasts.map((t) =>
      t.id === id ? { ...t, isExiting: true } : t
    )
  })

  setTimeout(() => {
    setState({
      toasts: memoryState.toasts.filter((t) => t.id !== id)
    })
  }, EXIT_ANIMATION_DURATION)

  return toastToDismiss
}

const useToast = () => {
  const [state, setStateReact] = React.useState<ToastState>(memoryState)
  React.useEffect(() => {
    listeners.push(setStateReact)
    return () => {
      const index = listeners.indexOf(setStateReact)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])
  return { ...state, toast, dismiss }
}

const enterAnimationClasses: Record<ToastEnterAnimationType, string> = {
  "fade-in": "animate-toast-fade-in",
  "slide-down": "animate-toast-slide-down",
  "slide-up": "animate-toast-slide-up",
  "slide-left": "animate-toast-slide-left",
  "slide-right": "animate-toast-slide-right",
  "zoom-in": "animate-toast-zoom-in"
}

const exitAnimationClasses: Record<ToastExitAnimationType, string> = {
  "fade-out": "animate-toast-fade-out",
  "slide-out-up": "animate-toast-slide-out-up",
  "slide-out-down": "animate-toast-slide-out-down",
  "slide-out-right": "animate-toast-slide-out-right",
  "slide-out-left": "animate-toast-slide-out-left",
  "zoom-out": "animate-toast-zoom-out"
}

const colorVariants: Record<ToastType, string> = {
  success: "emerald-500",
  error: "destructive",
  info: "primary",
  warning: "amber-500"
}

const iconProps: LucideProps = {
  size: 16,
  "aria-hidden": true,
  className: "mt-0.5 shrink-0"
}
const iconVariants: Record<ToastType, React.ReactNode> = {
  success: (
    <CheckCircle
      {...iconProps}
      className={cn(iconProps.className, `text-${colorVariants.success}`)}
    />
  ),
  error: (
    <XCircle
      {...iconProps}
      className={cn(iconProps.className, `text-${colorVariants.error}`)}
    />
  ),
  info: (
    <InfoIcon
      {...iconProps}
      className={cn(iconProps.className, `text-${colorVariants.info}`)}
    />
  ),
  warning: (
    <TriangleAlert
      {...iconProps}
      className={cn(iconProps.className, `text-${colorVariants.warning}`)}
    />
  )
}

const ToastPrimitive = React.forwardRef<
  HTMLDivElement,
  ToastProps & {
    effectiveDuration: number | null
    resolvedEnterAnimationType: ToastEnterAnimationType
    resolvedExitAnimationType: ToastExitAnimationType
  }
>(
  (
    {
      id,
      type = "info",
      title,
      description,
      className,
      style,
      resolvedEnterAnimationType,
      resolvedExitAnimationType,
      customIcon,
      primaryAction,
      secondaryAction,
      showCloseButton = false,
      showProgressBar = false,
      effectiveDuration,
      isExiting,
      // *** destructured to avoid passing them to the div
      enterAnimationType,
      exitAnimationType,
      onDismiss,
      onAutoClose,
      // *** //
      ...rest
    },
    ref
  ) => {
    const iconToRender = customIcon ?? iconVariants[type]
    const enterAnimationClass =
      enterAnimationClasses[resolvedEnterAnimationType]
    const exitAnimationClass = exitAnimationClasses[resolvedExitAnimationType]
    const animationClass = isExiting ? exitAnimationClass : enterAnimationClass

    const shouldShowProgressBar =
      showProgressBar &&
      effectiveDuration !== null &&
      effectiveDuration !== Infinity &&
      !isExiting

    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-auto relative w-full max-w-[400px] overflow-hidden rounded-md border bg-background p-4 shadow-lg",
          animationClass,
          className
        )}
        style={style}
        data-state={isExiting ? "exiting" : "visible"}
        {...rest}
      >
        <div className="flex items-start gap-3">
          {iconToRender}
          <div className="flex-1 space-y-3 pr-3">
            <div className="space-y-1">
              {typeof title === "string" ? (
                <p className="text-sm font-medium">{title}</p>
              ) : (
                title
              )}
              {description &&
                (typeof description === "string" ? (
                  <p className="text-sm text-muted-foreground">{description}</p>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {description}
                  </div>
                ))}
            </div>

            {(primaryAction || secondaryAction) && (
              <div className="mt-2 flex flex-row-reverse justify-start gap-2">
                {primaryAction && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      primaryAction.onClick(e)
                      dismiss(id)
                    }}
                  >
                    {primaryAction.label}
                  </Button>
                )}
                {secondaryAction && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      secondaryAction.onClick(e)
                      dismiss(id)
                    }}
                  >
                    {secondaryAction.label}
                  </Button>
                )}
              </div>
            )}
          </div>

          {showCloseButton && (
            <button
              type="button"
              onClick={() => dismiss(id)}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "absolute right-1 top-1 h-7 w-7 rounded-full p-1 text-foreground/50 opacity-80 hover:text-foreground hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
              )}
              aria-label="Close"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {shouldShowProgressBar && (
          <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden bg-muted">
            <div
              className={cn(
                "animate-toast-progress-bar h-full",
                `bg-${colorVariants[type]}`
              )}
              style={{ animationDuration: `${effectiveDuration}ms` }}
            ></div>
          </div>
        )}
      </div>
    )
  }
)
ToastPrimitive.displayName = "ToastPrimitive"

const Toaster: React.FC<ToasterProps> = ({
  defaultDuration = 5000,
  defaultPosition = "bottom-right",
  defaultEnterAnimationType = "fade-in",
  defaultExitAnimationType = "fade-out",
  defaultShowCloseButton = false,
  defaultShowProgressBar = false,
  gap = 16,
  className,
  ...props
}) => {
  const { toasts } = useToast()
  const [positions, setPositions] = React.useState<
    Record<ToastPosition, ToastProps[]>
  >({
    "top-left": [],
    "top-right": [],
    "top-center": [],
    "bottom-left": [],
    "bottom-right": [],
    "bottom-center": []
  })

  React.useEffect(() => {
    const newPositions: Record<ToastPosition, ToastProps[]> = {
      "top-left": [],
      "top-right": [],
      "top-center": [],
      "bottom-left": [],
      "bottom-right": [],
      "bottom-center": []
    }
    toasts.forEach((toast) => {
      const position = toast.position || defaultPosition
      newPositions[position].push(toast)
    })
    setPositions(newPositions)
  }, [toasts, defaultPosition])

  React.useEffect(() => {
    const timers = toasts
      .filter((toast) => !toast.isExiting)
      .map((toast) => {
        const effectiveDuration =
          toast.duration === Infinity
            ? null
            : (toast.duration ?? defaultDuration)

        if (effectiveDuration !== null) {
          const timerId = setTimeout(() => {
            dismiss(toast.id)
            if (toast.onAutoClose) {
              toast.onAutoClose(toast)
            }
          }, effectiveDuration)
          return timerId
        }
        return null
      })
    return () => {
      timers.forEach((timerId) => {
        if (timerId) clearTimeout(timerId)
      })
    }
  }, [toasts, defaultDuration])

  const positionClasses: Record<ToastPosition, string> = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "top-center": "top-0 left-1/2 -translate-x-1/2",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2"
  }

  return (
    <>
      {Object.entries(positions)
        .filter(([, toastsInPosition]) => toastsInPosition.length > 0)
        .map(([pos, toastsInPosition]) => (
          <div
            key={pos}
            className={cn(
              "pointer-events-none fixed z-[100] m-4 flex flex-col",
              positionClasses[pos as ToastPosition],
              className
            )}
            style={{ gap: `${gap}px` }}
            {...props}
          >
            {toastsInPosition.map((toastProps) => {
              const effectiveDuration =
                toastProps.duration === Infinity
                  ? null
                  : (toastProps.duration ?? defaultDuration)

              const resolvedEnterAnimationType =
                toastProps.enterAnimationType ?? defaultEnterAnimationType
              let resolvedExitAnimationType: ToastExitAnimationType

              if (toastProps.exitAnimationType) {
                resolvedExitAnimationType = toastProps.exitAnimationType
              } else {
                const enterIndex = ENTER_ANIMATION_TYPES.indexOf(
                  resolvedEnterAnimationType
                )
                if (enterIndex !== -1) {
                  resolvedExitAnimationType = EXIT_ANIMATION_TYPES[enterIndex]
                } else {
                  resolvedExitAnimationType = defaultExitAnimationType
                }
              }

              return (
                <ToastPrimitive
                  key={toastProps.id}
                  {...toastProps}
                  resolvedEnterAnimationType={resolvedEnterAnimationType}
                  resolvedExitAnimationType={resolvedExitAnimationType}
                  showCloseButton={
                    toastProps.showCloseButton ?? defaultShowCloseButton
                  }
                  showProgressBar={
                    toastProps.showProgressBar ?? defaultShowProgressBar
                  }
                  effectiveDuration={effectiveDuration}
                />
              )
            })}
          </div>
        ))}
    </>
  )
}
Toaster.displayName = "Toaster"

export { ToastPrimitive, Toaster, toast, dismiss, useToast }
export type {
  ToastType,
  ToastPosition,
  ToastEnterAnimationType,
  ToastExitAnimationType,
  ToastProps,
  ToasterProps,
  ToastOptions,
  ToastAction
}
