"use client";

import { ShortLinkAnalyticsData } from "@/lib/types";
import { scaleQuantize } from "d3-scale";
import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";
import geography from "@/data/world_countries.json";

const colorScale = scaleQuantize<string>()
  .domain([1, 1000])
  .range([
    "#B7CBE1",
    "#A9C5E3",
    "#9BBCE2",
    "#89B3E2",
    "#73A6DF",
    "#5A98DD",
    "#4484CB",
    "#2C6BB0",
    "#1B4F88",
  ]);

interface CountryMapProps {
  data: ShortLinkAnalyticsData["clicksByCountry"];
}

export function CountryMap({ data }: CountryMapProps) {
  const [tooltipContent, setTooltipContent] = useState("");

  return (
    <div className="border rounded-md overflow-hidden">
      <ComposableMap
        projectionConfig={{ rotate: [-20, 0, 0] }}
        data-tooltip-id="country-tooltip"
        className="m-0 lg:-my-16"
      >
        <ZoomableGroup center={[0, 0]} zoom={1}>
          <Geographies {...{ geography }}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.NAME;
                const countryCode = geo.properties.ISO_A2;
                const countryData = data[countryCode];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      const clicks = countryData || 0;
                      setTooltipContent(`${countryName}: ${clicks} clicks`);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    style={{
                      default: {
                        fill: countryData ? colorScale(countryData) : "#CAC9CC",
                        outline: "none",
                        stroke: "#FFF",
                        strokeWidth: 0.5,
                      },
                      hover: {
                        fill: countryData ? colorScale(countryData) : "#B0AEB3",
                        outline: "none",
                        stroke: "#A79BB6",
                        strokeWidth: 0.5,
                        cursor: "pointer",
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
      <ReactTooltip id="country-tooltip" float offset={15} />
    </div>
  );
}
