<div align="center">
<img alt="Snipper" src="./public/snipper.svg" width="107" />

# Snipper: A simple URL shortener/tracker.

![Version](https://img.shields.io/github/package-json/v/jeremiasvillane/snipper.svg)
[![License](https://badgen.net/github/license/jeremiasvillane/snipper)](https://github.com/jeremiasvillane/snipper/blob/main/LICENSE)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FJeremiasVillane%2Fsnipper.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FJeremiasVillane%2Fsnipper?ref=badge_shield&issueType=license)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
![Last commit](https://badgen.net/github/last-commit/jeremiasvillane/snipper)

</div>

---

This is a [Next.js](https://nextjs.org) project implementing [TypeScript](https://www.typescriptlang.org), [NextAuth](https://next-auth.js.org), [Next-Themes](https://www.npmjs.com/package/next-themes), [NextUI](https://nextui.org), [HeadlessUI](https://headlessui.com), [Framer Motion](https://www.framer.com/motion), [Prisma](https://www.prisma.io), [PostgreSQL](https://www.postgresql.org) and [Tailwind CSS](https://tailwindcss.com).

## Features:

- Generate uniques links
- Track how many times a link has been clicked
- Redirection screen
- UI created with TailwindCSS and NextUI
- Full responsivity and mobile UI
- Light / Dark mode using next-themes
- ORM using Prisma
- PostgreSQL database using Vercel Storage
- Authentication with next-auth
- This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Google Fonts.

### Prerequisites

**Node version 20.x.x**

### Setup .env file

```js
POSTGRES_PRISMA_URL =
  "postgresql://username:password@host:port/database?schema=public";
POSTGRES_URL_NON_POOLING =
  "postgresql://username:password@host:port/database?schema=public";
NEXT_PUBLIC_APP_URL = "https://www.your-deploy-url.com";

NEXTAUTH_SECRET = "secretkey";
NEXTAUTH_URL = "https://www.your-deploy-url.com";

// Visit: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID = "your-google-client-id";
GOOGLE_CLIENT_SECRET = "your-google-client-secret";
```

### Setup Prisma

Add PostgreSQL Database (I used Vercel Storage)

```shell
npx prisma generate
npx prisma db push

```

### Start the app

```shell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Screenshots

<details>
<summary>Show</summary>

### Landing

![screen01](./public/screen01.jpg)

### Form to create a new Link

![screen02](./public/screen02.jpg)

### Modal to copy the new link

![screen03](./public/screen03.jpg)

### My Links section

![screen04](./public/screen04.jpg)

### Light Theme

![screen05](./public/screen05.jpg)

### Profile section

![screen06](./public/screen06.jpg)

### About section (mobile)

![screen07](./public/screen07.jpg)

</details>

## License

Distributed under the [**MIT License**](LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FJeremiasVillane%2Fsnipper.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FJeremiasVillane%2Fsnipper?ref=badge_large&issueType=license)

## Contact me

- [LinkedIn](https://snppr.vercel.app/2Vt7W2xMe)
