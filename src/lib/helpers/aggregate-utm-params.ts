import { ClickEvent } from "@prisma/client";

export function aggregateUtmParam(
  clicks: ClickEvent[],
  paramKey: keyof Pick<
    ClickEvent,
    "utmCampaign" | "utmSource" | "utmMedium" | "utmTerm" | "utmContent"
  >,
): Record<string, number> {
  return clicks.reduce(
    (acc, click) => {
      const value = click[paramKey];
      if (value !== null && value !== undefined && value !== "") {
        acc[value] = (acc[value] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );
}
