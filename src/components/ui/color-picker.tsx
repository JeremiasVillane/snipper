"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { HexAlphaColorPicker, HexColorPicker } from "react-colorful"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface ColorPickerProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "value" | "onChange"> {
  /** Optional additional class names for styling. */
  className?: string

  /** Optional current color value. */
  value?: string

  /** Optional callback invoked when the color value changes. */
  onChange?: (value: string) => void

  /** Optional callback triggered when a new color is added. */
  onAddColor?: (value: string) => void

  /** Optional custom trigger element for the color picker. */
  trigger?: React.ReactNode

  /** Optional side of the popover, derived from PopoverContent's side property.
   * @default "bottom" */
  popoverSide?: "top" | "right" | "bottom" | "left"

  /** Optional alignment of the popover, derived from PopoverContent's align property.
   * @default "center" */
  popoverAlign?: "start" | "center" | "end"

  /** Optional initial default color. */
  defaultColor?: string

  /** Optional array of preset color strings available for selection. */
  presetColors?: string[]

  /** Optional flag to enable alpha (transparency) control.
   * @default false */
  withAlpha?: boolean

  /** Optional format display option for color representation.
   * @default { hex: true, rgb: true, hsl: true } */
  showFormat?: ColorPickerFormatOption

  /** Optional title for the color selector. */
  selectorTitle?: React.ReactNode
}

type ColorPickerFormatOption = {
  hex?: boolean
  rgb?: boolean
  hsl?: boolean
}

type ColorFormat = "hex" | "rgb" | "hsl"

// Color Conversion Utilities
interface RgbaColor {
  r: number
  g: number
  b: number
  a: number
}
interface HslaColor {
  h: number
  s: number
  l: number
  a: number
}

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout>
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }) as T
}

function rgbaToHex(r: number, g: number, b: number, a: number = 1): string {
  const toHex = (n: number) => {
    let hex = Math.round(n).toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }
  const alphaVal = Math.round(a * 255)
  const alphaHex =
    a === 1 || isNaN(a) || alphaVal === 255 ? "" : toHex(alphaVal)
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`.toUpperCase()
}

function hexToRgba(hex: string | null | undefined): RgbaColor | null {
  if (!hex) return null
  hex = hex.replace(/^#/, "")
  let r: number,
    g: number,
    b: number,
    alpha: number = 1

  if (hex.length === 3 || hex.length === 4) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
    if (hex.length === 4) alpha = parseInt(hex[3] + hex[3], 16) / 255
  } else if (hex.length === 6 || hex.length === 8) {
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
    if (hex.length === 8) alpha = parseInt(hex.substring(6, 8), 16) / 255
  } else {
    return null
  }
  if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(alpha)) return null
  return { r, g, b, a: alpha }
}

function hexToHsla(hex: string | null | undefined): HslaColor | null {
  const rgba = hexToRgba(hex)
  if (!rgba) return null
  let { r, g, b, a } = rgba
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s: number,
    l = (max + min) / 2
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a
  }
}

function hslaToHex(h: number, s: number, l: number, a: number = 1): string {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const chrom = s * Math.min(l, 1 - l)
  const f = (n: number) =>
    l - chrom * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return rgbaToHex(
    Math.round(255 * f(0)),
    Math.round(255 * f(8)),
    Math.round(255 * f(4)),
    a
  )
}

function toSixDigitHex(hex: string | null | undefined): string {
  if (!hex) return "#000000"
  const rgba = hexToRgba(hex)
  if (!rgba) return "#000000"
  return rgbaToHex(rgba.r, rgba.g, rgba.b, 1).substring(0, 7)
}

const DefaultColorPickerTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { colorValue: string }
>(({ className, colorValue, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      className={cn(
        "h-10 w-10 self-center border p-0 text-foreground",
        className
      )}
      style={{ backgroundColor: colorValue }}
      {...props}
    ></Button>
  )
})
DefaultColorPickerTrigger.displayName = "DefaultColorPickerTrigger"

const ColorValueTag = ({ valueName }: { valueName: string }) => (
  <span className="text-sm font-medium text-muted-foreground">{valueName}</span>
)

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      className,
      name,
      value: controlledValue,
      onChange: controlledOnChange,
      onAddColor,
      trigger,
      popoverSide = "bottom",
      popoverAlign = "center",
      defaultColor: providedDefaultColor,
      presetColors,
      withAlpha = false,
      showFormat = { hex: true, rgb: true, hsl: true },
      selectorTitle,
      ...triggerProps
    }: ColorPickerProps,
    ref
  ) => {
    const initialDefaultColor =
      providedDefaultColor || (withAlpha ? "#333333FF" : "#333333")

    const [internalColor, setInternalColor] = React.useState<string>(
      withAlpha ? initialDefaultColor : toSixDigitHex(initialDefaultColor)
    )

    const isControlled = controlledValue !== undefined

    const currentColor = React.useMemo(() => {
      const colorSource = isControlled ? controlledValue : internalColor
      let baseColor = colorSource || (withAlpha ? "#000000FF" : "#000000")
      baseColor = withAlpha ? baseColor : toSixDigitHex(baseColor)
      return (
        hexToRgba(baseColor) ? baseColor : withAlpha ? "#000000FF" : "#000000"
      ).toUpperCase()
    }, [isControlled, controlledValue, internalColor, withAlpha])

    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

    const [localHexInput, setLocalHexInput] =
      React.useState<string>(currentColor)

    React.useEffect(() => {
      if (currentColor !== localHexInput) {
        setLocalHexInput(currentColor)
      }
    }, [currentColor])

    const availableFormats = React.useMemo(() => {
      const formats: ColorFormat[] = []
      if (showFormat?.hex) formats.push("hex")
      if (showFormat?.rgb) formats.push("rgb")
      if (showFormat?.hsl) formats.push("hsl")
      if (formats.length === 0) return ["hex" as ColorFormat] // Default to hex if none are enabled
      return formats
    }, [showFormat])

    const [displayFormat, setDisplayFormat] = React.useState<ColorFormat>(
      availableFormats[0]
    )

    React.useEffect(() => {
      // Ensure displayFormat is always one of the available formats
      if (!availableFormats.includes(displayFormat)) {
        setDisplayFormat(availableFormats[0])
      }
    }, [availableFormats, displayFormat])

    const setColorState = React.useCallback(
      (newColor: string) => {
        let processedColor = newColor.toUpperCase()
        processedColor = withAlpha
          ? processedColor
          : toSixDigitHex(processedColor)
        processedColor = hexToRgba(processedColor)
          ? processedColor
          : withAlpha
            ? "#000000FF"
            : "#000000"
        if (isControlled) {
          controlledOnChange?.(processedColor)
        } else {
          setInternalColor(processedColor)
        }
      },
      [isControlled, controlledOnChange, withAlpha, setInternalColor]
    )

    const debouncedSetColorState = React.useMemo(
      () => debounce(setColorState, 100),
      [setColorState]
    )

    const directSetColorState = React.useCallback(
      (newColor: string) => {
        setColorState(newColor)
      },
      [setColorState]
    )

    const handlePickerChange = (newHex: string) => {
      debouncedSetColorState(newHex)
    }

    const currentRgba = React.useMemo(
      () => hexToRgba(currentColor) || { r: 0, g: 0, b: 0, a: 1 },
      [currentColor]
    )
    const currentHsla = React.useMemo(
      () => hexToHsla(currentColor) || { h: 0, s: 0, l: 0, a: 1 },
      [currentColor]
    )

    const handleLocalHexInputChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const userInput = e.target.value
      setLocalHexInput(userInput.toUpperCase())
      const plainHex = userInput.startsWith("#")
        ? userInput.substring(1)
        : userInput
      const targetLength = withAlpha ? 8 : 6

      if (plainHex.length === targetLength) {
        const parsedRgba = hexToRgba(userInput)
        if (parsedRgba) {
          directSetColorState(
            rgbaToHex(parsedRgba.r, parsedRgba.g, parsedRgba.b, parsedRgba.a)
          )
        }
      }
    }

    const handleLocalHexInputBlur = () => {
      const parsedRgba = hexToRgba(localHexInput)
      if (parsedRgba) {
        directSetColorState(
          rgbaToHex(parsedRgba.r, parsedRgba.g, parsedRgba.b, parsedRgba.a)
        )
      } else {
        setLocalHexInput(currentColor)
      }
    }

    const handleRgbChannelChange = (
      channel: keyof RgbaColor,
      value: string
    ) => {
      const numericValue =
        channel === "a" ? parseFloat(value) : parseInt(value, 10)
      if (isNaN(numericValue)) return
      let { r, g, b, a } = currentRgba
      if (channel === "r") r = Math.min(255, Math.max(0, numericValue))
      else if (channel === "g") g = Math.min(255, Math.max(0, numericValue))
      else if (channel === "b") b = Math.min(255, Math.max(0, numericValue))
      else if (channel === "a" && withAlpha)
        a = Math.min(1, Math.max(0, parseFloat(value)))
      directSetColorState(rgbaToHex(r, g, b, withAlpha ? a : 1))
    }
    const handleHslaChannelChange = (
      channel: keyof HslaColor,
      value: string
    ) => {
      const numericValue =
        channel === "a" ? parseFloat(value) : parseInt(value, 10)
      if (isNaN(numericValue)) return
      let { h, s, l, a } = currentHsla
      if (channel === "h") h = Math.min(360, Math.max(0, numericValue))
      else if (channel === "s") s = Math.min(100, Math.max(0, numericValue))
      else if (channel === "l") l = Math.min(100, Math.max(0, numericValue))
      else if (channel === "a" && withAlpha)
        a = Math.min(1, Math.max(0, numericValue))
      directSetColorState(hslaToHex(h, s, l, withAlpha ? a : 1))
    }

    const displayAlphaValue = (withAlpha ? currentRgba.a : 1).toFixed(2)

    const PickerComponent = withAlpha ? HexAlphaColorPicker : HexColorPicker

    return (
      <>
        <input type="hidden" name={name} value={currentColor} readOnly />
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger className={className} asChild>
            {trigger ? (
              React.isValidElement(trigger) ? (
                React.cloneElement(
                  trigger as React.ReactElement<React.ComponentProps<"button">>,
                  {
                    ...triggerProps,
                    style: {
                      ...((
                        trigger as React.ReactElement<{
                          style?: React.CSSProperties
                        }>
                      ).props.style || {}),
                      backgroundColor: toSixDigitHex(currentColor)
                    }
                  }
                )
              ) : (
                trigger
              )
            ) : (
              <DefaultColorPickerTrigger
                colorValue={toSixDigitHex(currentColor)}
                {...triggerProps}
              />
            )}
          </PopoverTrigger>

          <PopoverContent
            ref={ref}
            side={popoverSide}
            align={popoverAlign}
            className="w-[19rem] p-4"
          >
            <div className="flex flex-col items-center gap-3">
              {!!selectorTitle &&
                (typeof selectorTitle === "string" ? (
                  <h3 className="mb-1 text-lg font-medium text-foreground">
                    {selectorTitle}
                  </h3>
                ) : (
                  selectorTitle
                ))}
              <PickerComponent
                color={currentColor}
                onChange={handlePickerChange}
                className="aspect-square !h-auto !w-full rounded-md border-0 shadow-sm hover:cursor-crosshair"
              />
              {presetColors && presetColors.length > 0 && (
                <div className="w-full pb-1 pt-2">
                  <div className="flex flex-wrap justify-start gap-1.5">
                    {presetColors.map((color, index) => (
                      <button
                        key={`default-${color}-${index}`}
                        type="button"
                        title={color.toUpperCase()}
                        aria-label={`Select color ${color.toUpperCase()}`}
                        className="shadow-xs h-5 w-5 rounded-full border border-gray-300 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 dark:border-gray-700"
                        style={{ backgroundColor: toSixDigitHex(color) }}
                        onClick={() => directSetColorState(color)}
                      />
                    ))}
                  </div>
                </div>
              )}
              {availableFormats.length > 1 && ( // Only show toggle if there's more than one format enabled
                <ToggleGroup
                  type="single"
                  value={displayFormat}
                  variant="outline"
                  size="sm"
                  onValueChange={(value: ColorFormat) =>
                    value && setDisplayFormat(value)
                  }
                  className="w-full"
                >
                  {availableFormats.map((format) => (
                    <ToggleGroupItem
                      key={format}
                      value={format}
                      aria-label={format.toUpperCase()}
                      className="h-7 w-full"
                    >
                      {format.toUpperCase()}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
              <div className="grid w-full grid-cols-2 gap-2 pt-1">
                {displayFormat === "hex" && showFormat?.hex && (
                  <>
                    <div className="col-span-2 flex items-center gap-2">
                      <Input
                        id="hex-input-field"
                        value={localHexInput}
                        startAddon={<ColorValueTag valueName="HEX" />}
                        onChange={handleLocalHexInputChange}
                        onBlur={handleLocalHexInputBlur}
                        className="h-7 flex-1 text-sm uppercase tracking-wider"
                        placeholder={withAlpha ? "#RRGGBBAA" : "#RRGGBB"}
                        autoComplete="off"
                        spellCheck="false"
                      />
                    </div>
                    {withAlpha && (
                      <div className="col-span-2 flex items-center gap-2">
                        <Input
                          id="hex-alpha-input"
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          value={displayAlphaValue}
                          startAddon={<ColorValueTag valueName="Alpha" />}
                          onChange={(e) =>
                            handleRgbChannelChange("a", e.target.value)
                          }
                          className="h-7 flex-1 text-sm tracking-wider"
                        />
                      </div>
                    )}
                  </>
                )}

                {displayFormat === "rgb" && showFormat?.rgb && (
                  <>
                    {(["r", "g", "b"] as const).map((channel) => (
                      <div
                        className="flex items-center gap-2"
                        key={`rgb-${channel}`}
                      >
                        <Input
                          id={`rgb-${channel}-input`}
                          type="number"
                          min="0"
                          max="255"
                          step="1"
                          startAddon={
                            <ColorValueTag valueName={channel.toUpperCase()} />
                          }
                          value={currentRgba[channel]}
                          onChange={(e) =>
                            handleRgbChannelChange(channel, e.target.value)
                          }
                          className="h-7 flex-1 text-sm tracking-wider"
                        />
                      </div>
                    ))}
                    {withAlpha && (
                      <div className="flex items-center gap-2">
                        <Input
                          id="rgb-alpha-input"
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          startAddon={<ColorValueTag valueName="Alpha" />}
                          value={displayAlphaValue}
                          onChange={(e) =>
                            handleRgbChannelChange("a", e.target.value)
                          }
                          className="h-7 flex-1 text-sm tracking-wider"
                        />
                      </div>
                    )}
                  </>
                )}
                {displayFormat === "hsl" && showFormat?.hsl && (
                  <>
                    {(["h", "s", "l"] as const).map((channel) => (
                      <div
                        className="flex items-center gap-2"
                        key={`hsl-${channel}`}
                      >
                        <Input
                          id={`hsl-${channel}-input`}
                          type="number"
                          min="0"
                          max={channel === "h" ? 360 : 100}
                          step="1"
                          startAddon={
                            <ColorValueTag valueName={channel.toUpperCase()} />
                          }
                          value={currentHsla[channel]}
                          onChange={(e) =>
                            handleHslaChannelChange(channel, e.target.value)
                          }
                          className="h-7 flex-1 text-sm tracking-wider"
                        />
                      </div>
                    ))}
                    {withAlpha && (
                      <div className="flex items-center gap-2">
                        <Input
                          id="hsl-alpha-input"
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          startAddon={<ColorValueTag valueName="Alpha" />}
                          value={displayAlphaValue}
                          onChange={(e) =>
                            handleHslaChannelChange("a", e.target.value)
                          }
                          className="h-7 flex-1 text-sm tracking-wider"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
              {onAddColor && (
                <Button
                  className="mt-2 w-full gap-2"
                  onClick={() => {
                    if (currentColor) onAddColor(currentColor)
                    setIsPopoverOpen(false)
                  }}
                >
                  <Plus className="h-4 w-4" /> Add New Color
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </>
    )
  }
)
ColorPicker.displayName = "ColorPicker"

export { ColorPicker }
export type { ColorPickerProps }
