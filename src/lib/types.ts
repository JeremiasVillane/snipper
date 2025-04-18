import { Tag } from "@prisma/client";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
}

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
