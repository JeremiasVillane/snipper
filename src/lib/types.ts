import {
  ClickEvent,
  CustomDomain,
  Plan,
  ShortLink,
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
  title: string | null;
  userId: string | null;
  clicks: number;
  tags: string[];
  utmParams: UTMParam[];
  customOgImageUrl: string | null;
  customOgTitle: string | null;
  customOgDescription: string | null;
  customDomain: CustomDomain | null;
  isLinkHubEnabled: boolean;
  linkHubTitle: string | null;
  linkHubDescription: string | null;
  shortLinkIcon: string | null;
  createdAt: Date;
  expiresAt: Date | null;
  expirationUrl: string | null;
}

export interface ShortLinkFromRepository extends ShortLinkBaseResponse {
  isPasswordEnabled: boolean;
  isExpirationEnabled: boolean;
  isCustomOgEnabled: boolean;
}

export interface CustomDomainFromRepository extends CustomDomain {
  shortLinks: ShortLink[];
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

interface LimiterResponse {
  remaining: number;
}

export interface APIGetLink extends LimiterResponse {
  link: Omit<
    ShortLinkBaseResponse,
    | "customDomain"
    | "isLinkHubEnabled"
    | "linkHubTitle"
    | "linkHubDescription"
    | "shortLinkIcon"
  > & {
    shortUrl: string;
    qrCodeUrl: string;
  };
}

export interface APIGetAllLinks extends LimiterResponse {
  links: Omit<
    APIGetLink["link"],
    | "qrCodeUrl"
    | "isLinkHubEnabled"
    | "linkHubTitle"
    | "linkHubDescription"
    | "shortLinkIcon"
  >[];
}

export interface APIPostLink extends LimiterResponse {
  link: Omit<
    APIGetLink["link"],
    | "userId"
    | "clicks"
    | "customOgImageUrl"
    | "customOgTitle"
    | "customOgDescription"
    | "isLinkHubEnabled"
    | "linkHubTitle"
    | "linkHubDescription"
    | "shortLinkIcon"
  >;
}

export interface APIDeleteLink extends LimiterResponse {
  success: boolean;
}

export interface APIGetLinkAnalytics extends LimiterResponse {
  analytics: Omit<ShortLinkAnalyticsData, "recentClicks" | "definedCampaigns">;
}
