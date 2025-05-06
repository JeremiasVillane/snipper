import { Tag } from "@prisma/client";

export interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  expiresAt: Date | null;
  password: string | null;
  userId: string | null;
  tags: Tag[];
  clicks: number;
}

export interface ClickEvent {
  id: string;
  shortLinkId: string;
  timestamp: Date;
  ipAddress: string | null;
  userAgent: string | null;
  referrer: string | null;
  country: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
}

export type ShortLinkAnalyticsData = {
  totalClicks: number;
  /** Date (string), Count (number) */
  clicksByDate: Record<string, number>;
  /** Country (string), Count (number) */
  clicksByCountry: Record<string, number>;
  /** City (string), Count (number) */
  clicksByCity: Record<string, number>;
  /** City clicks (number), Cities (City[string], Count [number]) */
  clicksByCountryWithCities: Record<
    string,
    {
      totalClicks: number;
      cities: Record<string, number>; // City name -> click count
    }
  >;
  /** Device (string), Count (number) */
  clicksByDevice: Record<string, number>;
  /** Browser (string), Count (number) */
  clicksByBrowser: Record<string, number>;
  /** OS (string), Count (number) */
  clicksByOS: Record<string, number>;
  /** Referrer (string), Count (number) */
  clicksByReferrer: Record<string, number>;
  recentClicks: ClickEvent[];
  definedCampaigns: UTMParamData[];
  clicksByCampaign: Record<string, number>;
  clicksBySource: Record<string, number>;
  clicksByMedium: Record<string, number>;
  clicksByTerm: Record<string, number>;
  clicksByContent: Record<string, number>;
};

export type UTMParamData = {
  id: string;
  source: string | null;
  medium: string | null;
  campaign: string;
  term: string | null;
  content: string | null;
};

export type ShortLinkFromRepository = {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  expiresAt: Date | null;
  password: string | null;
  userId: string | null;
  clicks: number;
  linkTags: Array<{
    linkId: string;
    tagId: string;
    tag: Tag;
  }>;
  tags: string[];
  utmParams: UTMParamData[];
};

export type genericAuthorizationMiddlewareProps =
  | {
      // plans: Plan[] | "ALL";
      // roles: Role[] | "ALL";
    }
  | {
      plans?: never;
      roles?: never;
    };
