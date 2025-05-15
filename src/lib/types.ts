import {
  ClickEvent,
  CustomDomain,
  Plan,
  UserRole,
  UTMParam,
} from "@prisma/client";

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
  definedCampaigns: UTMParam[];
  clicksByCampaign: Record<string, number>;
  clicksBySource: Record<string, number>;
  clicksByMedium: Record<string, number>;
  clicksByTerm: Record<string, number>;
  clicksByContent: Record<string, number>;
};

interface ShortLinkBaseResponse {
  id: string;
  originalUrl: string;
  shortCode: string;
  userId: string | null;
  clicks: number;
  tags: string[];
  utmParams: UTMParam[];
  customOgImageUrl: string | null;
  customOgTitle: string | null;
  customOgDescription: string | null;
  customDomain: CustomDomain | null;
  createdAt: Date;
  expiresAt: Date | null;
}

export interface ShortLinkFromRepository extends ShortLinkBaseResponse {
  isPasswordEnabled: boolean;
  isExpirationEnabled: boolean;
  isCustomOgEnabled: boolean;
}

export type authorizationMiddlewareProps =
  | {
      plans: Plan["name"][] | "ALL";
      roles: UserRole[] | "ALL";
    }
  | {
      plans?: never;
      roles?: never;
    };

///------ API Endpoints Types ------///

export interface APIGetLink {
  link: Omit<ShortLinkBaseResponse, "customDomain"> & {
    shortUrl: string;
    qrCodeUrl: string;
  };
  remaining: number;
}

export type APIGetAllLinks = {
  links: Omit<APIGetLink["link"], "qrCodeUrl">[];
  remaining: number;
};

export type APIPostLink = {
  link: Omit<
    APIGetLink["link"],
    | "userId"
    | "clicks"
    | "customOgImageUrl"
    | "customOgTitle"
    | "customOgDescription"
  >;
  remaining: number;
};

export type APIDeleteLink = { success: boolean; remaining: number };

export type APIGetLinkAnalytics = {
  analytics: Omit<ShortLinkAnalyticsData, "recentClicks" | "definedCampaigns">;
  remaining: number;
};
