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

const GEO_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/refs/heads/master/geojson/ne_110m_admin_0_countries.geojson";

const colorScale = scaleQuantize<string>()
  .domain([1, 1000])
  .range([
    "#C3B6E3",
    "#B9A8E3",
    "#AD99E2",
    "#A38CE1",
    "#9678E1",
    "#8967E1",
    "#7851D8",
    "#6039C5",
    "#4316B7",
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
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.NAME;
                const countryCode =
                  geo.properties.ISO_A2 === "-99"
                    ? geo.properties.ISO_A2_EH
                    : geo.properties.ISO_A2;
                const countryData = data[countryCode];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      const clicks = countryData || 0;
                      setTooltipContent(`${countryName}: ${clicks} clics`);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    style={{
                      default: {
                        fill: countryData ? colorScale(countryData) : "#B7CBE1",
                        outline: "none",
                        stroke: "#FFF",
                        strokeWidth: 0.5,
                      },
                      hover: {
                        fill: countryData ? colorScale(countryData) : "#9AACC0",
                        outline: "none",
                        stroke: "#FFF",
                        strokeWidth: 0.5,
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#AAA",
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
      <ReactTooltip id="country-tooltip" />
    </div>
  );
}
