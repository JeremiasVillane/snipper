import { UAParser } from "ua-parser-js";

interface ParsedUAInfo {
  browser: string;
  os: string;
  device: string;
  browserVersion?: string;
  osVersion?: string;
  deviceVendor?: string;
  deviceModel?: string;
}

export function parseUserAgentImproved(userAgent: string): ParsedUAInfo {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const browser = result.browser.name || "Unknown";
  const os = result.os.name || "Unknown";

  return {
    browser,
    os,
    device: result.device.type ?? "Unknown",
    browserVersion: result.browser.version,
    osVersion: result.os.version,
    deviceVendor: result.device.vendor,
    deviceModel: result.device.model,
  };
}
