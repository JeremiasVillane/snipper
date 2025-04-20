export function buildShortUrl(shortCode: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}/${shortCode}`;
}
