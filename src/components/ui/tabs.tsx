"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  // prettier-ignore
  variant?: "default" | "underlined" | "brutalist" | "pill-filled" | "pill-outlined" | "pill-boxed" | "segmented" | "bootstrap" | "vercel"
}

interface TabsContextValue {
  variant: TabsProps["variant"]
  positions: { value: string; left: number; width: number }[]
  setPositions: React.Dispatch<
    React.SetStateAction<{ value: string; left: number; width: number }[]>
  >
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
  hoveredTab: number | null
  setHoveredTab: React.Dispatch<React.SetStateAction<number | null>>
}

const TabsContext = React.createContext<TabsContextValue>({
  variant: "default",
  positions: [],
  setPositions: () => {},
  activeTab: "",
  setActiveTab: () => {},
  hoveredTab: null,
  setHoveredTab: () => {}
})

const tabsListVariants = cva(
  "inline-flex h-8 items-center w-full p-0 bg-background justify-start rounded-none",
  {
    variants: {
      variant: {
        default:
          "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        underlined: "text-muted-foreground border-b h-10",
        brutalist: "border-b",
        "pill-filled": "h-auto gap-1",
        "pill-outlined": "h-auto gap-1",
        "pill-boxed": "rounded-2xl p-1 h-auto gap-1 border",
        segmented: "rounded-md border overflow-hidden divide-x",
        bootstrap: "",
        vercel: "relative h-[30px]"
      }
    },
    defaultVariants: { variant: "default" }
  }
)

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-full rounded-none",
  {
    variants: {
      variant: {
        default:
          "rounded-md w-full py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
        underlined:
          "h-10 border-b-2 border-transparent px-4 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-primary data-[state=active]:shadow-none",
        brutalist:
          "rounded-none bg-background data-[state=active]:shadow-none border border-b-[3px] border-transparent data-[state=active]:border-primary",
        "pill-filled":
          "rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        "pill-outlined":
          "rounded-2xl border border-transparent data-[state=active]:border-border data-[state=active]:shadow-none",
        "pill-boxed":
          "rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        segmented:
          "w-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        bootstrap:
          "-mb-[2px] rounded-t border border-transparent border-b-border px-5 py-2.5 data-[state=active]:border-border data-[state=active]:border-b-background data-[state=active]:text-foreground text-foreground/60",
        vercel:
          "relative px-3 py-2 text-muted-foreground data-[state=active]:text-foreground transition-colors z-20"
      }
    },
    defaultVariants: { variant: "default" }
  }
)

const Tabs = ({ variant = "default", ...props }: TabsProps) => {
  const [positions, setPositions] = React.useState<
    { value: string; left: number; width: number }[]
  >([])
  const [hoveredTab, setHoveredTab] = React.useState<number | null>(null)
  const [activeTab, setActiveTab] = React.useState<string>(
    (props.defaultValue as string) || (props.value as string) || ""
  )

  return (
    <TabsContext.Provider
      value={{
        variant: variant || "default",
        positions,
        setPositions,
        activeTab,
        setActiveTab,
        hoveredTab,
        setHoveredTab
      }}
    >
      <TabsPrimitive.Root
        onValueChange={(val) => setActiveTab(val)}
        {...props}
      />
    </TabsContext.Provider>
  )
}

type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, ...props }, ref) => {
  const { variant, positions, activeTab, hoveredTab } =
    React.useContext(TabsContext)

  const activePosition = positions.find((pos) => pos.value === activeTab)
  const hoverPosition = hoveredTab !== null ? positions[hoveredTab] : null

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      {props.children}

      {variant === "vercel" && (
        <>
          <div
            className="absolute h-[30px] rounded-[6px] bg-[#0e0f1114] transition-all duration-300 dark:bg-[#ffffff1a]"
            style={{
              width: hoverPosition?.width ?? 0,
              left: hoverPosition?.left ?? 0,
              opacity: hoveredTab !== null ? 1 : 0
            }}
          />

          <div
            className="absolute bottom-[-6px] h-[2px] bg-[#0e0f11] transition-all duration-300 dark:bg-white"
            style={{
              width: activePosition?.width ?? 0,
              left: activePosition?.left ?? 0
            }}
          />
        </>
      )}
    </TabsPrimitive.List>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

type TabsTriggerProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
>

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, value, ...props }, ref) => {
  const { variant, setPositions, setHoveredTab } = React.useContext(TabsContext)
  const tabRef = React.useRef<HTMLButtonElement>(null)
  const index = React.useRef<number>(-1)

  React.useEffect(() => {
    if (variant === "vercel" && tabRef.current) {
      const updatePosition = () => {
        const parentRect =
          tabRef.current?.parentElement?.getBoundingClientRect()
        const rect = tabRef.current?.getBoundingClientRect()

        if (rect && parentRect && index.current !== -1 && value) {
          setPositions((prev) => {
            const newPositions = [...prev]
            newPositions[index.current] = {
              value: value,
              left: rect.left - parentRect.left,
              width: rect.width
            }
            return newPositions
          })
        }
      }

      updatePosition()
      const observer = new ResizeObserver(updatePosition)
      observer.observe(tabRef.current)

      return () => observer.disconnect()
    }
  }, [variant, value, setPositions])

  return (
    <TabsPrimitive.Trigger
      ref={(el) => {
        if (el) {
          tabRef.current = el
          index.current = Array.from(el.parentNode?.children || [])
            .filter((child) => child instanceof HTMLElement)
            .indexOf(el)
        }
        if (typeof ref === "function") ref(el)
        else if (ref) ref.current = el
      }}
      className={cn(tabsTriggerVariants({ variant }), className)}
      onMouseEnter={() => variant === "vercel" && setHoveredTab(index.current)}
      onMouseLeave={() => variant === "vercel" && setHoveredTab(null)}
      value={value}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
export type { TabsProps }
