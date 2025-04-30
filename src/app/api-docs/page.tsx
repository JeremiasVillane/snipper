import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { publicUrl } from "@/env.mjs";
import { constructMetadata } from "@/lib/metadata";
import { generateOgImageUrl } from "@/lib/og";

export const generateMetadata = async () => {
  const title = "Snipper API Documentation | Automate Link Shortening";

  const description =
    "Explore the official Snipper API documentation. Learn how to programmatically create, manage, and retrieve analytics for your short links using your API key. Includes endpoint details, request/response examples, and authentication guides.";

  return constructMetadata({
    title,
    description,
    keywords: [
      "snipper api",
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
            title: "Snipper API Documentation",
            type: "article",
          }),
          width: 1200,
          height: 630,
          alt: "Snipper API Documentation for Developers - Automate Link Creation",
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
      <main className="flex-1 container py-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Snipper API</h2>
              <p className="text-muted-foreground mt-2">
                The Snipper API allows you to programmatically create, manage,
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
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>Authorization: Bearer your_api_key</code>
              </pre>
            </div>

            <Tabs variant="segmented" defaultValue="links">
              <TabsList>
                <TabsTrigger value="links">Links</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="links" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary font-mono p-1 rounded">
                      GET
                    </div>
                    <h4 className="text-lg font-semibold">/api/v1/links</h4>
                  </div>
                  <p>List all your short links.</p>
                  <div className="space-y-2">
                    <h5 className="font-semibold">Response</h5>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>
                        {JSON.stringify(
                          {
                            links: [
                              {
                                id: "link_id",
                                originalUrl: "https://example.com",
                                shortUrl: "https://linksnip.com/abc123",
                                shortCode: "abc123",
                                createdAt: "2023-01-01T00:00:00.000Z",
                                expiresAt: null,
                                clicks: 42,
                                tags: ["marketing", "social"],
                              },
                            ],
                          },
                          null,
                          2
                        )}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 font-mono p-1 rounded">
                      POST
                    </div>
                    <h4 className="text-lg font-semibold">/api/v1/links</h4>
                  </div>
                  <p>Create a new short link.</p>
                  <div className="space-y-2">
                    <h5 className="font-semibold">Request Body</h5>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>
                        {JSON.stringify(
                          {
                            url: "https://example.com",
                            customAlias: "my-link", // optional
                            expiresAt: "2023-12-31T23:59:59.999Z", // optional
                            password: "secret", // optional
                            tags: ["marketing", "social"], // optional
                          },
                          null,
                          2
                        )}
                      </code>
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold">Response</h5>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>
                        {JSON.stringify(
                          {
                            id: "link_id",
                            originalUrl: "https://example.com",
                            shortUrl: "https://linksnip.com/my-link",
                            shortCode: "my-link",
                            createdAt: "2023-01-01T00:00:00.000Z",
                            expiresAt: "2023-12-31T23:59:59.999Z",
                            qrCodeUrl: "data:image/png;base64,...",
                          },
                          null,
                          2
                        )}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary font-mono p-1 rounded">
                      GET
                    </div>
                    <h4 className="text-lg font-semibold">/api/v1/links/:id</h4>
                  </div>
                  <p>Get details of a specific short link.</p>
                  <div className="space-y-2">
                    <h5 className="font-semibold">Response</h5>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>
                        {JSON.stringify(
                          {
                            id: "link_id",
                            originalUrl: "https://example.com",
                            shortUrl: "https://linksnip.com/abc123",
                            shortCode: "abc123",
                            createdAt: "2023-01-01T00:00:00.000Z",
                            expiresAt: null,
                            clicks: 42,
                            tags: ["marketing", "social"],
                            qrCodeUrl: "data:image/png;base64,...",
                          },
                          null,
                          2
                        )}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-mono p-1 rounded">
                      PATCH
                    </div>
                    <h4 className="text-lg font-semibold">/api/v1/links/:id</h4>
                  </div>
                  <p>Update a short link.</p>
                  <div className="space-y-2">
                    <h5 className="font-semibold">Request Body</h5>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>
                        {JSON.stringify(
                          {
                            customAlias: "new-alias", // optional
                            expiresAt: "2023-12-31T23:59:59.999Z", // optional
                            password: "new-secret", // optional
                          },
                          null,
                          2
                        )}
                      </code>
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold">Response</h5>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>
                        {JSON.stringify(
                          {
                            id: "link_id",
                            originalUrl: "https://example.com",
                            shortUrl: "https://linksnip.com/new-alias",
                            shortCode: "new-alias",
                            createdAt: "2023-01-01T00:00:00.000Z",
                            expiresAt: "2023-12-31T23:59:59.999Z",
                            qrCodeUrl: "data:image/png;base64,...",
                          },
                          null,
                          2
                        )}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 font-mono p-1 rounded">
                      DELETE
                    </div>
                    <h4 className="text-lg font-semibold">/api/v1/links/:id</h4>
                  </div>
                  <p>Delete a short link.</p>
                  <div className="space-y-2">
                    <h5 className="font-semibold">Response</h5>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>
                        {JSON.stringify(
                          {
                            success: true,
                          },
                          null,
                          2
                        )}
                      </code>
                    </pre>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary font-mono p-1 rounded">
                      GET
                    </div>
                    <h4 className="text-lg font-semibold">
                      /api/v1/links/:id/analytics
                    </h4>
                  </div>
                  <p>Get analytics for a specific short link.</p>
                  <div className="space-y-2">
                    <h5 className="font-semibold">Response</h5>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>
                        {JSON.stringify(
                          {
                            totalClicks: 42,
                            clicksByDate: {
                              "2023-01-01": 10,
                              "2023-01-02": 15,
                              "2023-01-03": 17,
                            },
                            clicksByCountry: {
                              "United States": 20,
                              "United Kingdom": 10,
                              Canada: 5,
                              Other: 7,
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
                          },
                          null,
                          2
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
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
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
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
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
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>
                      {`# Create a short link
curl -X POST '${publicUrl}/api/v1/links' \\
  -H 'Authorization: Bearer your_api_key' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "url": "https://example.com",
    "customAlias": "my-link",
    "expiresAt": "2023-12-31T23:59:59.999Z"
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
