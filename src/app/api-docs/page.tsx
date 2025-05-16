import Link from "next/link";
import { publicUrl } from "@/env.mjs";
import { ArrowLeft } from "lucide-react";

import { appName } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import { generateOgImageUrl } from "@/lib/og";
import { CreateLinkBodyAPI, UpdateLinkBodyAPI } from "@/lib/schemas";
import {
  APIDeleteLink,
  APIGetAllLinks,
  APIGetLink,
  APIGetLinkAnalytics,
  APIPostLink,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const generateMetadata = async () => {
  const title = `${appName} API Documentation | Automate Link Shortening`;

  const description = `Explore the official ${appName} API documentation. Learn how to programmatically create, manage, and retrieve analytics for your short links using your API key. Includes endpoint details, request/response examples, and authentication guides.`;

  return constructMetadata({
    title,
    description,
    keywords: [
      `${appName.toLowerCase()} api`,
      "url shortener api",
      "link shortener api docs",
      "rest api",
      "developer documentation",
      "programmatic links",
      "api key",
      "link management api",
    ],
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      images: [
        {
          url: generateOgImageUrl({
            title: `${appName} API Documentation`,
            type: "article",
          }),
          width: 1200,
          height: 630,
          alt: `${appName} API Documentation for Developers - Automate Link Creation`,
        },
      ],
    },
  });
};

export default function ApiDocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold">API Documentation</h1>
          </div>
        </div>
      </header>
      <main className="container flex-1 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {appName} API
              </h2>
              <p className="mt-2 text-muted-foreground">
                The {appName} API allows you to programmatically create, manage,
                and analyze short links.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Authentication</h3>
              <p>
                All API requests require authentication using an API key. You
                can create an API key in your{" "}
                <Link
                  href="/dashboard/api-keys"
                  className="text-primary hover:underline"
                >
                  dashboard
                </Link>
                .
              </p>
              <p>
                Include your API key in the Authorization header of your
                requests:
              </p>
              <pre className="overflow-x-auto rounded-md bg-muted p-4">
                <code>Authorization: Bearer your_api_key</code>
              </pre>
            </div>

            <Tabs variant="segmented" defaultValue="links">
              <TabsList>
                <TabsTrigger value="links">Links</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="links" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="font-mono rounded bg-primary/10 p-1 text-primary">
                      GET
                    </div>
                    <h4 className="text-lg font-semibold">/api/v1/links</h4>
                  </div>
                  <p>List all your short links.</p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Rate Limiting:</strong> Allow up to 5 requests per
                    15 seconds (capacity: 100).
                  </p>

                  <div className="space-y-2">
                    <h5 className="font-semibold">Response</h5>
                    <pre className="overflow-x-auto rounded-md bg-muted p-4">
                      <code>
                        {JSON.stringify(
                          {
                            links: [
                              {
                                id: "link_id",
                                userId: "user_id",
                                originalUrl: "https://example.com",
                                shortUrl: "https://snppr.link/abc123",
                                shortCode: "abc123",
                                createdAt: new Date("2025-01-01T00:00:00.000Z"),
                                expiresAt: null,
                                clicks: 42,
                                tags: ["marketing", "social"],
                                utmParams: [
                                  {
                                    id: "utm_param_id",
                                    source: "google",
                                    medium: "cpc",
                                    campaign: "newsletter_q3",
                                    term: "new+merch",
                                    content: "logo_link",
                                    shortLinkId: "link_id",
                                    createdAt: new Date(
                                      "2025-01-01T00:00:00.000Z",
                                    ),
                                    updatedAt: new Date(
                                      "2025-01-01T00:00:00.000Z",
                                    ),
                                  },
                                ],
                                customOgImageUrl: "https://imgurl.com",
                                customOgTitle: "Custom preview image title",
                                customOgDescription:
                                  "Custom preview image description",
                              },
                            ],
                            remaining: 100,
                          } satisfies APIGetAllLinks,
                          null,
                          2,
                        )}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="font-mono rounded bg-green-100 p-1 text-green-700 dark:bg-green-900 dark:text-green-300">
                      POST
                    </div>
                    <h4 className="text-lg font-semibold">/api/v1/links</h4>
                  </div>
                  <p>Create a new short link.</p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Rate Limiting:</strong> Allow up to 1 request per 10
                    seconds (capacity: 100).
                  </p>

                  <div className="space-y-2">
                    <h5 className="font-semibold">Request Body</h5>
                    <pre className="overflow-x-auto rounded-md bg-muted p-4">
                      <code>
                        {JSON.stringify(
                          {
                            originalUrl: "https://example.com",
                            shortCode: "my-link",
                            expiresAt: new Date("2025-12-31T23:59:59.999Z"),
                            password: "secret",
                            tags: ["marketing", "social"],
                            utmSets: [
                              {
                                source: "facebook",
                                medium: "social",
                                campaign: "summer_sale",
                                term: "running+shoes",
                                content: "logo_link",
                              },
                            ],
                          } satisfies CreateLinkBodyAPI,
                          null,
                          2,
                        )}
                      </code>
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold">Response</h5>
                    <pre className="overflow-x-auto rounded-md bg-muted p-4">
                      <code>
                        {JSON.stringify(
                          {
                            link: {
                              id: "link_id",
                              originalUrl: "https://example.com",
                              shortUrl: "https://snppr.link/my-link",
                              shortCode: "my-link",
                              createdAt: new Date("2025-01-01T00:00:00.000Z"),
                              expiresAt: new Date("2025-12-31T23:59:59.999Z"),
                              tags: ["marketing", "social"],
                              utmParams: [
                                {
                                  id: "utm_param_id",
                                  source: "facebook",
                                  medium: "social",
                                  campaign: "summer_sale",
                                  term: "running+shoes",
                                  content: "logo_link",
                                  shortLinkId: "link_id",
                                  createdAt: new Date(
                                    "2025-01-01T00:00:00.000Z",
                                  ),
                                  updatedAt: new Date(
                                    "2025-01-01T00:00:00.000Z",
                                  ),
                                },
                              ],
                              qrCodeUrl: "data:image/png;base64,...",
                            },
                            remaining: 100,
                          } satisfies APIPostLink,
                          null,
                          2,
                        )}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="font-mono rounded bg-primary/10 p-1 text-primary">
                      GET
                    </div>
                    <h4 className="text-lg font-semibold">/api/v1/links/:id</h4>
                  </div>
                  <p>Get details of a specific short link.</p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Rate Limiting:</strong> Allow up to 5 requests per
                    10 seconds (capacity: 100).
                  </p>

                  <div className="space-y-2">
                    <h5 className="font-semibold">Response</h5>
                    <pre className="overflow-x-auto rounded-md bg-muted p-4">
                      <code>
                        {JSON.stringify(
                          {
                            link: {
                              id: "link_id",
                              userId: "user_id",
                              originalUrl: "https://example.com",
                              shortUrl: "https://snppr.link/abc123",
                              shortCode: "abc123",
                              createdAt: new Date("2025-01-01T00:00:00.000Z"),
                              expiresAt: null,
                              clicks: 42,
                              tags: ["marketing", "social"],
                              utmParams: [
                                {
                                  id: "utm_param_id",
                                  source: "facebook",
                                  medium: "social",
                                  campaign: "summer_sale",
                                  term: "running+shoes",
                                  content: "logo_link",
                                  shortLinkId: "link_id",
                                  createdAt: new Date(
                                    "2025-01-01T00:00:00.000Z",
                                  ),
                                  updatedAt: new Date(
                                    "2025-01-01T00:00:00.000Z",
                                  ),
                                },
                              ],
                              qrCodeUrl: "data:image/png;base64,...",
                              customOgImageUrl: "https://imgurl.com",
                              customOgTitle: "Custom preview image title",
                              customOgDescription:
                                "Custom preview image description",
                            },
                            remaining: 100,
                          } satisfies APIGetLink,
                          null,
                          2,
                        )}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="font-mono rounded bg-blue-100 p-1 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      PATCH
                    </div>
                    <h4 className="text-lg font-semibold">/api/v1/links/:id</h4>
                  </div>
                  <p>Update a short link.</p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Rate Limiting:</strong> Allow up to 1 request per 10
                    seconds (capacity: 100).
                  </p>

                  <div className="space-y-2">
                    <h5 className="font-semibold">Request Body</h5>
                    <pre className="overflow-x-auto rounded-md bg-muted p-4">
                      <code>
                        {JSON.stringify(
                          {
                            shortCode: "new-alias",
                            expiresAt: new Date("2025-12-31T23:59:59.999Z"),
                            password: "new-secret",
                          } satisfies UpdateLinkBodyAPI,
                          null,
                          2,
                        )}
                      </code>
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold">Response</h5>
                    <pre className="overflow-x-auto rounded-md bg-muted p-4">
                      <code>
                        {JSON.stringify(
                          {
                            link: {
                              id: "link_id",
                              userId: "user_id",
                              originalUrl: "https://example.com",
                              shortUrl: "https://snppr.link/new-alias",
                              shortCode: "new-alias",
                              clicks: 120,
                              createdAt: new Date("2025-01-01T00:00:00.000Z"),
                              expiresAt: new Date("2025-12-31T23:59:59.999Z"),
                              tags: ["marketing", "social"],
                              utmParams: [
                                {
                                  id: "utm_param_id",
                                  source: "facebook",
                                  medium: "social",
                                  campaign: "summer_sale",
                                  term: "running+shoes",
                                  content: "logo_link",
                                  shortLinkId: "link_id",
                                  createdAt: new Date(
                                    "2025-01-01T00:00:00.000Z",
                                  ),
                                  updatedAt: new Date(
                                    "2025-01-01T00:00:00.000Z",
                                  ),
                                },
                              ],
                              qrCodeUrl: "data:image/png;base64,...",
                              customOgImageUrl: "https://imgurl.com",
                              customOgTitle: "Custom preview image title",
                              customOgDescription:
                                "Custom preview image description",
                            },
                            remaining: 100,
                          } satisfies APIGetLink,
                          null,
                          2,
                        )}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="font-mono rounded bg-red-100 p-1 text-red-700 dark:bg-red-900 dark:text-red-300">
                      DELETE
                    </div>
                    <h4 className="text-lg font-semibold">/api/v1/links/:id</h4>
                  </div>
                  <p>Delete a short link.</p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Rate Limiting:</strong> Allow up to 1 request per 10
                    seconds (capacity: 10).
                  </p>

                  <div className="space-y-2">
                    <h5 className="font-semibold">Response</h5>
                    <pre className="overflow-x-auto rounded-md bg-muted p-4">
                      <code>
                        {JSON.stringify(
                          {
                            success: true,
                            remaining: 10,
                          } satisfies APIDeleteLink,
                          null,
                          2,
                        )}
                      </code>
                    </pre>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="font-mono rounded bg-primary/10 p-1 text-primary">
                      GET
                    </div>
                    <h4 className="text-lg font-semibold">
                      /api/v1/links/:id/analytics
                    </h4>
                  </div>
                  <p>Get analytics for a specific short link.</p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Rate Limiting:</strong> Allow up to 2 requests per
                    10 seconds (capacity: 100).
                  </p>

                  <div className="space-y-2">
                    <h5 className="font-semibold">Response</h5>
                    <pre className="overflow-x-auto rounded-md bg-muted p-4">
                      <code>
                        {JSON.stringify(
                          {
                            analytics: {
                              totalClicks: 42,
                              clicksByDate: {
                                "2025-01-01": 10,
                                "2025-01-02": 15,
                                "2025-01-03": 17,
                              },
                              clicksByCountry: {
                                "United States": 20,
                                "United Kingdom": 10,
                                Canada: 5,
                                Other: 7,
                              },
                              clicksByCity: {
                                "New York": 8,
                                London: 5,
                                Toronto: 3,
                                "Los Angeles": 7,
                                Manchester: 2,
                                Other: 17,
                              },
                              clicksByCountryWithCities: {
                                "United States": {
                                  totalClicks: 20,
                                  cities: {
                                    "New York": 8,
                                    "Los Angeles": 7,
                                    Chicago: 3,
                                    Houston: 2,
                                  },
                                },
                                "United Kingdom": {
                                  totalClicks: 10,
                                  cities: {
                                    London: 5,
                                    Manchester: 2,
                                    Birmingham: 1,
                                    Glasgow: 2,
                                  },
                                },
                                Canada: {
                                  totalClicks: 5,
                                  cities: {
                                    Toronto: 3,
                                    Vancouver: 1,
                                    Montreal: 1,
                                  },
                                },
                              },
                              clicksByDevice: {
                                Desktop: 25,
                                Mobile: 15,
                                Tablet: 2,
                              },
                              clicksByBrowser: {
                                Chrome: 20,
                                Firefox: 10,
                                Safari: 8,
                                Other: 4,
                              },
                              clicksByOS: {
                                Windows: 15,
                                MacOS: 12,
                                iOS: 8,
                                Android: 7,
                              },
                              clicksByReferrer: {
                                direct: 18,
                                "google.com": 10,
                                "twitter.com": 5,
                                "facebook.com": 4,
                                "linkedin.com": 3,
                                other: 2,
                              },
                              clicksByCampaign: {
                                spring_promo_2025: 15,
                                q1_newsletter: 10,
                                social_media_blitz: 12,
                                organic: 5,
                              },
                              clicksBySource: {
                                google: 10,
                                twitter: 5,
                                facebook: 4,
                                email: 10,
                                direct: 8,
                                linkedin: 3,
                                other: 2,
                              },
                              clicksByMedium: {
                                organic: 10,
                                social: 12,
                                email: 10,
                                cpc: 2,
                              },
                              clicksByTerm: {
                                "short link analytics": 5,
                                "url tracking": 3,
                                "link clicks data": 2,
                              },
                              clicksByContent: {
                                button_cta: 8,
                                text_link: 5,
                                image_banner: 4,
                              },
                            },
                            remaining: 100,
                          } satisfies APIGetLinkAnalytics,
                          null,
                          2,
                        )}
                      </code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Code Examples</h3>
              <Tabs variant="segmented" defaultValue="javascript">
                <TabsList>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>
                <TabsContent value="javascript" className="mt-4">
                  <pre className="overflow-x-auto rounded-md bg-muted p-4">
                    <code>
                      {`const API_KEY = 'your_api_key';
const API_URL = '${publicUrl}/api/v1';

// Create a short link
async function createShortLink(url, options = {}) {
  const response = await fetch(\`\${API_URL}/links\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      ...options,
    }),
  });
  
  return response.json();
}

// Example usage
createShortLink('https://example.com', {
  customAlias: 'my-link',
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
})
  .then(data => console.log(data))
  .catch(error => console.error(error));`}
                    </code>
                  </pre>
                </TabsContent>
                <TabsContent value="python" className="mt-4">
                  <pre className="overflow-x-auto rounded-md bg-muted p-4">
                    <code>
                      {`import requests
import json
from datetime import datetime, timedelta

API_KEY = 'your_api_key'
API_URL = '${publicUrl}/api/v1'

# Create a short link
def create_short_link(url, **options):
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json',
    }
    
    payload = {
        'url': url,
        **options,
    }
    
    response = requests.post(f'{API_URL}/links', headers=headers, json=payload)
    return response.json()

# Example usage
expires_at = (datetime.now() + timedelta(days=30)).isoformat()
result = create_short_link(
    'https://example.com',
    customAlias='my-link',
    expiresAt=expires_at
)
print(json.dumps(result, indent=2))`}
                    </code>
                  </pre>
                </TabsContent>
                <TabsContent value="curl" className="mt-4">
                  <pre className="overflow-x-auto rounded-md bg-muted p-4">
                    <code>
                      {`# Create a short link
curl -X POST '${publicUrl}/api/v1/links' \\
  -H 'Authorization: Bearer your_api_key' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "url": "https://example.com",
    "customAlias": "my-link",
    "expiresAt": "2025-12-31T23:59:59.999Z"
  }'

# Get all links
curl -X GET '${publicUrl}/api/v1/links' \\
  -H 'Authorization: Bearer your_api_key'

# Get analytics for a link
curl -X GET '${publicUrl}/api/v1/links/link_id/analytics' \\
  -H 'Authorization: Bearer your_api_key'`}
                    </code>
                  </pre>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
