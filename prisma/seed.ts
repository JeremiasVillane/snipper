import { buildShortUrl, generateQRCode } from "@/lib/helpers";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const saltRounds = 10;
const demoUserEmail = "demo@example.com";

async function main() {
  console.log(`Start seeding ...`);

  // --- 0. Clean up previous data for the demo user ---
  console.log(
    `Attempting to clean up previous ShortLink data for user: ${demoUserEmail}...`
  );
  const userForCleanup = await prisma.user.findUnique({
    where: { email: demoUserEmail },
    select: { id: true },
  });

  if (userForCleanup) {
    console.log(
      `Found user ${demoUserEmail} (ID: ${userForCleanup.id}). Deleting associated ShortLinks...`
    );
    const deletedLinksResult = await prisma.shortLink.deleteMany({
      where: { userId: userForCleanup.id },
    });
    console.log(
      `  - Deleted ${deletedLinksResult.count} ShortLink(s). Associated ClickEvents and LinkTags were also deleted due to cascading rules.`
    );

    const deletedTagsResult = await prisma.tag.deleteMany({
      where: { userId: userForCleanup.id },
    });
    console.log(`  - Deleted ${deletedTagsResult.count} Tag(s).`);
  } else {
    console.log(
      `User ${demoUserEmail} not found. No previous ShortLink data to delete.`
    );
  }
  console.log("Cleanup phase finished.");

  // --- 1. Hash the demo password ---
  const hashedPassword = await bcrypt.hash("password123", saltRounds);
  console.log(`Password hashed.`);

  // --- 2. Create or update the demo user ---
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {
      password: hashedPassword,
    },
    create: {
      email: "demo@example.com",
      password: hashedPassword,
      name: "Demo User",
      emailVerified: new Date(),
    },
  });
  console.log(`Created/Updated user: ${demoUser.email} (ID: ${demoUser.id})`);

  // --- 3. Define and Ensure Tags Exist for the Demo User ---
  const tagNames = [
    "social",
    "tools",
    "marketing",
    "demo-data",
    "important",
    "dev",
  ];
  const createdTagsMap = new Map<string, string>(); // Map: tagName -> tagId

  console.log("Ensuring base tags exist for demo user...");
  for (const tagName of tagNames) {
    let tag = await prisma.tag.findFirst({
      where: {
        name: tagName,
        userId: demoUser.id,
      },
    });

    if (!tag) {
      tag = await prisma.tag.create({
        data: {
          name: tagName,
          userId: demoUser.id,
        },
      });
      console.log(`  Created tag: "${tag.name}" (ID: ${tag.id})`);
    } else {
      console.log(`  Tag "${tag.name}" already exists (ID: ${tag.id})`);
    }
    createdTagsMap.set(tagName, tag.id);
  }
  console.log("Base tags processed.");

  // --- 4. Define data for Short Links ---
  const shortLinksData = [
    {
      shortCode: "ggl",
      originalUrl: `https://google.com?utm_source=seed_demo&utm_medium=referral&utm_campaign=initial_content`,
      description: "Link to Google Search with UTMs",
      tagsToAssign: ["tools", "important", "demo-data"],
    },
    {
      shortCode: "ghub",
      originalUrl: "https://github.com",
      description: "Link to GitHub",
      tagsToAssign: ["tools", "dev", "demo-data"],
    },
    {
      shortCode: "lkdn",
      originalUrl: `https://linkedin.com?utm_source=${
        faker.company.name().split(" ")[0]
      }&utm_medium=social&utm_campaign=${faker.lorem.word()}_promo&utm_content=tweet_${faker.string.alphanumeric(
        5
      )}`,
      description: "Link to LinkedIn with UTMs",
      tagsToAssign: ["social", "marketing", "demo-data"],
    },
    {
      shortCode: "demo",
      originalUrl: `https://example.com?utm_source=random_source&utm_medium=cpc&utm_campaign=${faker.commerce.department()}_sale&utm_term=${faker.lorem.word()}&utm_content=${faker.color.human()}_ad`,
      description: "A randomly generated link with UTMs",
      tagsToAssign: ["marketing", "demo-data"],
    },
    {
      shortCode: "blog",
      originalUrl: "https://medium.com",
      description: "Link to Medium blog platform",
      expiresAt: faker.date.future({ years: 1 }),
      tagsToAssign: ["social", "demo-data"],
    },
  ];

  // --- 5. Create Short Links, LinkTags, and associated Click Events ---
  for (const linkData of shortLinksData) {
    const numClicksForThisLink = faker.number.int({ min: 30, max: 150 });
    console.log(
      ` --> Processing ShortLink: ${linkData.shortCode} (${numClicksForThisLink} clicks)`
    );

    const randomCreatedAt = faker.date.past({ years: 1, refDate: new Date() });

    console.log(
      `   - ShortLink ${
        linkData.shortCode
      } createdAt: ${randomCreatedAt.toISOString()}`
    );

    const qrCodeUrl = await generateQRCode(buildShortUrl(linkData.shortCode));

    // --- 5a. Create the ShortLink ---
    const shortLink = await prisma.shortLink.create({
      data: {
        originalUrl: linkData.originalUrl,
        shortCode: linkData.shortCode,
        userId: demoUser.id,
        clicks: numClicksForThisLink,
        expiresAt: linkData.expiresAt,
        qrCodeUrl,
        createdAt: randomCreatedAt,
      },
    });
    console.log(
      `   - Created ShortLink: ${shortLink.shortCode} (ID: ${shortLink.id})`
    );

    // --- 5b. Create LinkTag entries ---
    const linkTagDataToCreate = [];
    console.log(`   - Assigning tags: ${linkData.tagsToAssign.join(", ")}`);
    for (const tagName of linkData.tagsToAssign) {
      const tagId = createdTagsMap.get(tagName);
      if (tagId) {
        linkTagDataToCreate.push({
          linkId: shortLink.id,
          tagId: tagId,
        });
      } else {
        console.warn(
          `     - Tag name "${tagName}" defined for link but not found in createdTagsMap.`
        );
      }
    }

    if (linkTagDataToCreate.length > 0) {
      const linkTagCreationResult = await prisma.linkTag.createMany({
        data: linkTagDataToCreate,
        skipDuplicates: true,
      });
      console.log(
        `   - Created ${linkTagCreationResult.count} LinkTag relations.`
      );
    }

    // --- 5c. Generate varied Click Events for this Short Link ---
    const locations = {
      US: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
      GB: ["London", "Manchester", "Birmingham", "Liverpool"],
      DE: ["Berlin", "Hamburg", "Munich", "Cologne"],
      JP: ["Tokyo", "Osaka", "Nagoya"],
      AR: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"],
      BR: ["São Paulo", "Rio de Janeiro", "Brasília"],
    } as const;

    const countryCodes = Object.keys(locations) as Array<
      keyof typeof locations
    >;

    const clickEventsToCreate = [];
    for (let i = 0; i < numClicksForThisLink; i++) {
      const country = faker.helpers.arrayElement(countryCodes);
      const citiesInCountry = locations[country];
      const city = faker.helpers.arrayElement(citiesInCountry);

      const clickTimestamp = faker.date.between({
        from: randomCreatedAt,
        to: new Date(),
      });

      clickEventsToCreate.push({
        shortLinkId: shortLink.id,
        timestamp: clickTimestamp,
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
        referrer: faker.helpers.maybe(() => faker.internet.url(), {
          probability: 0.6,
        }),
        country,
        city,
        device: faker.helpers.arrayElement([
          "Desktop",
          "Mobile",
          "Tablet",
          "Bot",
          "Other",
        ]),
        browser: faker.helpers.arrayElement([
          "Edge",
          "Chrome",
          "Safari",
          "Firefox",
          "Opera",
          "Brave",
        ]),
        os: faker.helpers.arrayElement([
          "Windows",
          "macOS",
          "Linux",
          "iOS",
          "Android",
          "Other",
        ]),
      });
    }

    if (clickEventsToCreate.length > 0) {
      const creationResult = await prisma.clickEvent.createMany({
        data: clickEventsToCreate,
        skipDuplicates: true,
      });
      console.log(`   - Added ${creationResult.count} ClickEvents.`);
    } else {
      console.log(`   - No ClickEvents to add (count was 0).`);
    }
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Disconnecting Prisma Client...");
    await prisma.$disconnect();
  });
