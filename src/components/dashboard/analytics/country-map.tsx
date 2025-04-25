"use client";

import { ShortLinkAnalyticsData } from "@/lib/types";
import { scaleQuantize } from "d3-scale";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";
import geography from "@/data/world_countries.json";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CityPopoverInfo {
  countryName: string;
  cities: { [key: string]: number };
  position: { x: number; y: number };
}

interface CountryMapProps {
  data: ShortLinkAnalyticsData["clicksByCountryWithCities"];
}

export function CountryMap({ data }: CountryMapProps) {
  const [tooltipContent, setTooltipContent] = useState("");
  const [cityPopover, setCityPopover] = useState<CityPopoverInfo | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const maxClicks = useMemo(() => {
    if (!data || Object.keys(data).length === 0) {
      return 0;
    }

    const clicksArray = Object.values(data).map(
      (countryData) => countryData?.totalClicks || 0
    );

    return Math.max(...clicksArray);
  }, [data]);

  const domainMax = maxClicks < 10 ? 10 : maxClicks < 100 ? 100 : 1000;

  const colorScale = scaleQuantize<string>().domain([1, domainMax]).range([
    "#F5F3F9", // HSL(250, 30%, 95%) - Very pale lilac / Grayish
    "#DCD5E9", // HSL(250, 40%, 85%)
    "#C1B6DA", // HSL(250, 45%, 75%)
    "#A496C9", // HSL(250, 47%, 65%)
    "#8877B8", // HSL(250, 47%, 55%) - Close to primary
    "#6D59A6", // HSL(250, 48%, 45%)
    "#544088", // HSL(250, 48%, 35%)
    "#3C2A6A", // HSL(250, 50%, 25%)
    "#251940", // HSL(250, 50%, 15%) - Very dark violet
  ]);

  const handleCountryClick = (
    event: React.MouseEvent<SVGPathElement>,
    geo: any
  ) => {
    const countryName = geo.properties.NAME;
    const countryCode = geo.properties.ISO_A2;
    const countryData = data[countryCode];
    const cities = countryData?.cities;

    if (cities && Object.keys(cities).length > 0) {
      event.preventDefault();

      const clickX = event.clientX;
      const clickY = event.clientY;

      setCityPopover({
        countryName,
        cities,
        position: { x: clickX, y: clickY },
      });
    } else {
      setCityPopover(null);
    }
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node)
    ) {
      setCityPopover(null);
    }
  }, []);

  useEffect(() => {
    if (cityPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cityPopover, handleClickOutside]);

  return (
    <div className="border rounded-md overflow-hidden relative">
      <ComposableMap
        projectionConfig={{ rotate: [-20, 0, 0] }}
        data-tooltip-id="country-tooltip"
        className="m-0 lg:-my-16 focus:outline-none"
      >
        <ZoomableGroup center={[0, 0]} zoom={1}>
          <Geographies {...{ geography }}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.NAME;
                const countryCode = geo.properties.ISO_A2;
                const countryData = data[countryCode];
                const hasCityData =
                  countryData?.cities &&
                  Object.keys(countryData.cities).length > 0;
                const currentClicks = countryData?.totalClicks || 0;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={(e) => handleCountryClick(e, geo)}
                    onMouseEnter={() => {
                      const clicks = countryData?.totalClicks || 0;
                      setTooltipContent(`${countryName}: ${clicks} clicks`);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    style={{
                      default: {
                        fill:
                          currentClicks > 0
                            ? colorScale(currentClicks)
                            : "#CAC9CC",
                        outline: "none",
                        stroke: "#FFF",
                        strokeWidth: 0.5,
                      },
                      hover: {
                        fill:
                          currentClicks > 0
                            ? colorScale(currentClicks)
                            : "#B0AEB3",
                        outline: "none",
                        stroke: "#A79BB6",
                        strokeWidth: 0.5,
                        cursor: hasCityData ? "pointer" : "default",
                      },
                      pressed: {
                        fill: "#999",
                        outline: "none",
                      },
                    }}
                    data-tooltip-id="country-tooltip"
                    data-tooltip-content={tooltipContent}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {cityPopover && (
        <div
          ref={popoverRef}
          style={{
            position: "fixed",
            left: `${cityPopover.position.x}px`,
            top: `${cityPopover.position.y}px`,
            transform: "translate(10px, 10px)",
          }}
          className="relative bg-popover text-popover-foreground border rounded-md shadow-lg p-5 pr-7 w-auto max-w-xs z-50 animate-fade-in"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-popover-foreground">
              Cities in {cityPopover.countryName}
            </h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCityPopover(null)}
              className="absolute right-1 top-1 size-6"
              aria-label="Close popover"
            >
              <X className="size-4" />
            </Button>
          </div>

          <ul className="space-y-1 max-h-40 overflow-y-auto">
            {Object.entries(cityPopover.cities)
              .sort(([, a], [, b]) => b - a)
              .map(([city, clicks]) => (
                <li
                  key={city}
                  className="flex justify-between gap-2 text-popover-foreground/80 text-sm"
                >
                  <span>{city}:</span>
                  <span className="font-medium">{clicks} clicks</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      <ReactTooltip id="country-tooltip" float offset={15} />
    </div>
  );
}
