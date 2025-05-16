<div align="center">
<img alt="Snipper" src="./public/snipper.svg" width="210" />

# Snipper: A Modern URL Shortener & Analytics Platform

![Version](https://img.shields.io/github/package-json/v/jeremiasvillane/snipper.svg)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
![Last commit](https://badgen.net/github/last-commit/jeremiasvillane/snipper)

</div>

---

**Snipper** is a powerful, open-source URL shortening application built with [Next.js](https://nextjs.org). It provides a comprehensive solution for creating, sharing, tracking, and managing your links effectively.

Built with a modern tech stack including [TypeScript](https://www.typescriptlang.org), [NextAuth.js](https://next-auth.js.org) for authentication, [Prisma](https://www.prisma.io) ORM with [PostgreSQL](https://www.postgresql.org), [Tailwind CSS](https://tailwindcss.com), and UI components from [shadcn/ui](https://ui.shadcn.com/), [shadcn/ui variants](https://shadcn-ui-variants.vercel.app/), [MagicUI](https://magicui.design/), [AceternityUI](https://ui.aceternity.com/), [CultUI](https://www.cult-ui.com/). Animations are powered by [Motion](https://motion.dev/) and themes managed by [Next-Themes](https://www.npmjs.com/package/next-themes).

## ✨ Features

Snipper offers everything you need to manage your links efficiently:

- **Custom Short Links:**
  - Create personalized, branded short links using custom aliases.
  - Generate links that are easy to remember, share, and promote your brand identity.
- **Advanced Analytics:**
  - Gain deep insights into your link performance with a powerful analytics dashboard.
  - Track clicks over time with clear visual charts.
  - Analyze traffic sources by device, browser, OS, and geographic location.
  - Monitor multiple campaigns simultaneously with global coverage and time analysis.
- **QR Code Generation:**
  - Instantly generate QR codes for any of your short links with a single click.
  - Download QR code images suitable for print materials, presentations, and physical media.
- **UTM Builder:**
  - Easily add and manage UTM parameters to your links directly within the app.
  - Enhance campaign tracking and seamlessly integrate with tools like Google Analytics.
- **Link Protection:**
  - Secure sensitive links by adding password protection.
  - Set automatic expiration dates to control access duration for temporary or confidential links.
- **Effortless Organization:**
  - Manage your links efficiently using tags for easy categorization.
- **User Management:**
  - Secure authentication powered by NextAuth.js (supports Google OAuth).
  - Dedicated user profiles and link management sections.
- **Modern UI/UX:**
  - Clean, intuitive interface built with TailwindCSS.
  - Full responsivity ensures a seamless experience on desktop and mobile.
  - Light and Dark modes enabled.

## 🚀 Getting Started

### Prerequisites

- **Node.js:** Version 20.x.x or later.
- **npm/yarn/pnpm:** Package manager.
- **PostgreSQL Database:** A running PostgreSQL instance (e.g., local, Docker, Vercel Storage, Supabase, Railway).

### Setup .env file

Create a `.env` file in the root directory and add the following environment variables:

```dotenv
# === Required Variables ===

# PostgreSQL Database URLs (ensure these point to your PostgreSQL instance)
POSTGRES_PRISMA_URL="postgresql://username:password@host:port/database?schema=public"
POSTGRES_URL_NON_POOLING="postgresql://username:password@host:port/database?schema=public"

# Application URL (replace with your deployment URL or http://localhost:3000 for development)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# NextAuth configuration (generate a strong secret, e.g., using `openssl rand -base64 32`)
NEXTAUTH_SECRET="your-secure-random-secret"

# Google OAuth Credentials (Required ONLY if you want Google login)
# Visit: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# UPLOADTHING Token (required for upload functionalities)
UPLOADTHING_TOKEN="your-uploadthing-token"

# Turnstile configuration
NEXT_PUBLIC_TURNSTILE_SITE_KEY="your-public-turnstile-site-key"
TURNSTILE_SECRET_KEY="your-turnstile-secret-key"

# IPQS API Key for IP quality score checks
IPQS_KEY="your-ipqs-api-key"

# === Optional: Key-Value Store and APIs ===

# KV REST API configuration (optional)
KV_REST_API_TOKEN="your-kv-rest-api-token"
KV_REST_API_URL="https://your-kv-rest-api-url"

# Abstract API Key for geo/IP services (optional)
ABSTRACT_API_KEY="your-abstract-api-key"

# === Optional: Monitoring, Analytics & Security Services ===

# Sentry (Error Monitoring & Performance Tracking)
SENTRY_ORG="your-sentry-org-name"
SENTRY_PROJECT="your-sentry-project-name"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"     # Required for build-time operations like source map uploads
NEXT_PUBLIC_SENTRY_DSN="your-sentry-public-dsn"  # Public DSN for client/server error reporting

# PostHog (Product Analytics)
NEXT_PUBLIC_POSTHOG_KEY="your-posthog-public-key"     # Public API Key for sending events
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"      # Your PostHog instance URL (Cloud default or self-hosted)

```

### Setup Prisma

Connect to your PostgreSQL database and set up the schema:

```shell
# Install dependencies
pnpm install
# or npm install / yarn install

# Generate Prisma Client
npx prisma generate

# Push the schema to the database (creates tables)
npx prisma db push
```

### Start the Development Server

```shell
pnpm run dev
# or npm dev / yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 License

Licensed under the [**PolyForm Noncommercial License 1.0.0**](https://polyformproject.org/licenses/noncommercial/1.0.0/). See the `LICENSE` file for more information.

## 📧 Contact

Jeremias Villane - Connect on [LinkedIn](https://snppr.link/jv-in)
