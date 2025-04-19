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
  qrCodeUrl: string | null;
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
  /** date (string) and count (number) */
  clicksByDate: Record<string, number>;
  /** country (string) and count (number) */
  clicksByCountry: Record<string, number>;
  /** device (string) and count (number) */
  clicksByDevice: Record<string, number>;
  /** browser (string) and count (number) */
  clicksByBrowser: Record<string, number>;
  /** OS (string) and count (number) */
  clicksByOS: Record<string, number>;
  recentClicks: ClickEvent[];
};

export type ShortLinkFromRepository = {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  expiresAt: Date | null;
  password: string | null;
  userId: string | null;
  qrCodeUrl: string | null;
  clicks: number;
  linkTags: Array<{
    linkId: string;
    tagId: string;
    tag: Tag;
  }>;
  tags: string[];
};

export interface UtmParams {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

export interface CreateLinkFormData {
  originalUrl: string;
  customAlias?: string;
  expiresAt?: Date;
  password?: string;
  tags?: string[];
  utmParams?: UtmParams;
}

export interface EditLinkFormData extends CreateLinkFormData {
  id: string;
}
