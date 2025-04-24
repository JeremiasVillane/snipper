<div align="center">
<img alt="Snipper" src="./public/snipper.svg" width="210" />

# Snipper: A Modern URL Shortener & Analytics Platform

![Version](https://img.shields.io/github/package-json/v/jeremiasvillane/snipper.svg)
[![License](https://badgen.net/github/license/jeremiasvillane/snipper)](https://github.com/jeremiasvillane/snipper/blob/main/LICENSE)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FJeremiasVillane%2Fsnipper.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FJeremiasVillane%2Fsnipper?ref=badge_shield&issueType=license)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
![Last commit](https://badgen.net/github/last-commit/jeremiasvillane/snipper)

</div>

---

**Snipper** is a powerful, open-source URL shortening application built with [Next.js](https://nextjs.org). It provides a comprehensive solution for creating, sharing, tracking, and managing your links effectively.

Built with a modern tech stack including [TypeScript](https://www.typescriptlang.org), [NextAuth.js](https://next-auth.js.org) for authentication, [Prisma](https://www.prisma.io) ORM with [PostgreSQL](https://www.postgresql.org), [Tailwind CSS](https://tailwindcss.com), and UI components from [shadcn/ui](https://ui.shadcn.com/), [shadcn/ui variants](https://shadcn-ui-variants.vercel.app/), [MagicUI](https://magicui.design/), [AceternityUI](https://ui.aceternity.com/). Animations are powered by [Framer Motion](https://www.framer.com/motion) and themes managed by [Next-Themes](https://www.npmjs.com/package/next-themes).

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
  - Clean, intuitive interface built with TailwindCSS and shadcn/ui.
  - Full responsivity ensures a seamless experience on desktop and mobile.
  - Switch between Light and Dark modes easily.

## 🚀 Getting Started

### Prerequisites

- **Node.js:** Version 20.x.x or later.
- **npm/yarn/pnpm:** Package manager.
- **PostgreSQL Database:** A running PostgreSQL instance (e.g., local, Docker, Vercel Storage, Supabase, Railway).

### Setup .env file

Create a `.env` file in the root directory and add the following environment variables:

```dotenv
# Database URLs (ensure both point to your PostgreSQL instance)
POSTGRES_PRISMA_URL="postgresql://username:password@host:port/database?schema=public"
POSTGRES_URL_NON_POOLING="postgresql://username:password@host:port/database?schema=public"

# Application URL (replace with your deployment URL or http://localhost:3000 for dev)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# NextAuth configuration
NEXTAUTH_SECRET="your-secure-random-secret" # Generate a strong secret key
NEXTAUTH_URL="http://localhost:3000" # Use NEXT_PUBLIC_APP_URL in production

# Google OAuth Credentials (Optional - for Google login)
# Visit: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Setup Prisma

Connect to your PostgreSQL database and set up the schema:

```shell
# Install dependencies
npm install
# or yarn install / pnpm install

# Generate Prisma Client
npx prisma generate

# Push the schema to the database (creates tables)
npx prisma db push
```

### Start the Development Server

```shell
npm run dev
# or yarn dev / pnpm dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

## 📸 Screenshots

<details>
<summary>Show Application Screenshots</summary>

### Analytics Overview

![screen01](./public/screen01.png)

![screen02](./public/screen02.png)

### Recent Clicks Table (Dark Mode)

![screen03](./public/screen03.png)

### Geography Location

![screen04](./public/screen04.png)

### Create New Link Modal

![screen05](./public/screen05.png)

### Dashboard (Grid View)

![screen06](./public/screen06a.png)

![screen06](./public/screen06b.png)

### Dashboard (Table View)

![screen07](./public/screen07.png)

</details>

## 📜 License

Distributed under the [**MIT License**](https://www.google.com/search?q=./LICENSE). See the `LICENSE` file for more information.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FJeremiasVillane%2Fsnipper.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FJeremiasVillane%2Fsnipper?ref=badge_large&issueType=license)

## 📧 Contact

Jeremias Villane - Connect on [LinkedIn](https://snppr.vercel.app/2Vt7W2xMe)
