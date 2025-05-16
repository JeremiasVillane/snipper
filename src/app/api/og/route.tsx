// Code from https://github.com/akash3444/shadcn-ui-blocks
// Inspired by https://github.com/shadcn-ui/taxonomy/blob/main/app/api/og/route.tsx

import { publicUrl } from "@/env.mjs";
import { ImageResponse } from "@vercel/og";
import { z } from "zod";

export const runtime = "edge";

const ogImageSchema = z.object({
  heading: z.string(),
  type: z.string(),
  mode: z.enum(["light", "dark"]).default("dark"),
});

const dmSansSemibold = fetch(
  new URL("../../../../public/assets/DMSans-SemiBold.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

export async function GET(req: Request) {
  try {
    const fontSemibold = await dmSansSemibold;

    const url = new URL(req.url);
    const values = ogImageSchema.parse(Object.fromEntries(url.searchParams));
    const heading =
      values.heading.length > 140
        ? `${values.heading.substring(0, 140)}...`
        : values.heading;

    const { mode } = values;
    const paint = mode === "dark" ? "#fff" : "#000";

    const fontSize = heading.length > 100 ? "70px" : "80px";

    return new ImageResponse(
      (
        <div
          tw="flex relative flex-col p-12 w-full h-full items-start"
          style={{
            color: paint,
            background:
              mode === "dark"
                ? "linear-gradient(90deg, #000 0%, #111 100%)"
                : "white",
          }}
        >
          <div
            tw="flex items-center justify-center rounded-full h-12 w-12"
            style={{
              color: mode === "dark" ? "black" : "white",
              background:
                mode === "dark"
                  ? "white"
                  : "linear-gradient(90deg, #000 0%, #111 100%)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <circle cx="17.5" cy="17.5" r="3.5" />
            </svg>
          </div>
          <div tw="flex flex-col flex-1 py-10">
            <div
              tw="flex text-xl uppercase font-bold tracking-tight"
              style={{ fontFamily: "Inter", fontWeight: "normal" }}
            >
              {values.type}
            </div>
            <div
              tw="flex leading-[1.1] text-[80px] font-bold"
              style={{
                fontFamily: "DM Sans",
                fontWeight: "bold",
                marginLeft: "-3px",
                marginTop: 20,
                fontSize,
              }}
            >
              {heading}
            </div>
          </div>
          <div tw="flex items-center w-full justify-between">
            <div
              tw="flex text-xl"
              style={{ fontFamily: "DM Sans", fontWeight: "normal" }}
            >
              {new URL(publicUrl).hostname}
            </div>
            <div
              tw="flex items-center text-xl"
              style={{ fontFamily: "DM Sans", fontWeight: "normal" }}
            >
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                <path
                  d="M30 44v-8a9.6 9.6 0 0 0-2-7c6 0 12-4 12-11 .16-2.5-.54-4.96-2-7 .56-2.3.56-4.7 0-7 0 0-2 0-6 3-5.28-1-10.72-1-16 0-4-3-6-3-6-3-.6 2.3-.6 4.7 0 7a10.806 10.806 0 0 0-2 7c0 7 6 11 12 11a9.43 9.43 0 0 0-1.7 3.3c-.34 1.2-.44 2.46-.3 3.7v8"
                  stroke={paint}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 36c-9.02 4-10-4-14-4"
                  stroke={paint}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div tw="flex ml-2">github.com/JeremiasVillane/snipper</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "DM Sans",
            data: fontSemibold,
            weight: 400,
            style: "normal",
          },
          {
            name: "DM Sans",
            data: fontSemibold,
            weight: 600,
            style: "normal",
          },
        ],
      },
    );
  } catch {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
