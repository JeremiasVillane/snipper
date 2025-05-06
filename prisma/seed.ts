import { buildShortUrl, generateQRCode } from "@/lib/helpers";
import { faker } from "@faker-js/faker";
import {
  PlanType,
  PrismaClient,
  SubscriptionStatus,
  Tag,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const saltRounds = 10;
const demoUserEmail = "demo@example.com";

type UTMSetDefinition = {
  source?: string | null;
  medium?: string | null;
  campaign: string;
  term?: string | null;
  content?: string | null;
};

function getClickUTMs(definedSets?: UTMSetDefinition[]) {
  const chance = Math.random();

  if (definedSets && definedSets.length > 0 && chance < 0.6) {
    // ~60% chance: Use one of the defined UTM sets for this link
    const chosenSet = faker.helpers.arrayElement(definedSets);
    return {
      utmSource: chosenSet.source,
      utmMedium: chosenSet.medium,
      utmCampaign: chosenSet.campaign, // Always present in definition
      utmTerm: chosenSet.term,
      utmContent: chosenSet.content,
    };
  } else if (chance < 0.7) {
    // ~10% chance: Simulate manually tagged UTMs (possibly different campaign)
    return {
      utmSource: faker.helpers.arrayElement([
        "facebook",
        "google",
        "newsletter",
      ]),
      utmMedium: faker.helpers.arrayElement(["social", "cpc", "email"]),
      utmCampaign: `ad_hoc_${faker.lorem.word()}`, // Random campaign name
      utmTerm: faker.helpers.maybe(() => faker.lorem.word(), {
        probability: 0.5,
      }),
      utmContent: faker.helpers.maybe(() => faker.lorem.slug(), {
        probability: 0.5,
      }),
    };
  } else {
    // ~30% chance: No UTM parameters (utmCampaign will be null)
    return {
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmTerm: null,
      utmContent: null,
    };
  }
}

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
      `Found user ${demoUserEmail} (ID: ${userForCleanup.id}). Deleting associated data...`
    );
    await prisma.subscription.deleteMany({
      where: { userId: userForCleanup.id },
    });
    console.log(`   - Deleted associated Subscriptions.`);
    await prisma.uTMParam.deleteMany({
      where: { shortLink: { userId: userForCleanup.id } },
    });
    console.log(`   - Deleted associated UTMParams.`);
    await prisma.clickEvent.deleteMany({
      where: { shortLink: { userId: userForCleanup.id } },
    });
    console.log(`   - Deleted associated ClickEvents.`);
    await prisma.linkTag.deleteMany({
      where: { link: { userId: userForCleanup.id } },
    });
    console.log(`   - Deleted associated LinkTags.`);
    const deletedLinksResult = await prisma.shortLink.deleteMany({
      where: { userId: userForCleanup.id },
    });
    console.log(`   - Deleted ${deletedLinksResult.count} ShortLink(s).`);
    const deletedTagsResult = await prisma.tag.deleteMany({
      where: { userId: userForCleanup.id },
    });
    console.log(`   - Deleted ${deletedTagsResult.count} Tag(s).`);
    const deletedApiKeysResult = await prisma.apiKey.deleteMany({
      where: { userId: userForCleanup.id },
    });
    console.log(`   - Deleted ${deletedApiKeysResult.count} ApiKey(s).`);
  } else {
    console.log(
      `User ${demoUserEmail} not found. No previous data to delete for this user.`
    );
  }
  console.log("Deleting existing Plans to recreate them...");
  await prisma.plan.deleteMany({});
  console.log("Existing plans deleted.");
  console.log("Cleanup phase finished.");

  // --- 1. Create Standard Plans ---
  console.log("Creating standard plans...");
  const freePlan = await prisma.plan.create({
    data: {
      name: "Free",
      type: PlanType.FREE,
      description: "Basic plan with essential features and limits.",
      maxLinks: 100,
      maxUtmSets: 200,
      price: 0.0,
    },
  });
  console.log(`Created plan: ${freePlan.name} (ID: ${freePlan.id})`);
  const premiumPlan = await prisma.plan.create({
    data: {
      name: "Premium",
      type: PlanType.PREMIUM,
      description: "Unlimited access and advanced features.",
      maxLinks: null,
      maxUtmSets: null,
      price: 9.99,
    },
  });
  console.log(`Created plan: ${premiumPlan.name} (ID: ${premiumPlan.id})`);
  console.log("Standard plans created.");

  // --- 2. Hash the demo password ---
  const hashedPassword = await bcrypt.hash("password123", saltRounds);
  console.log(`Password hashed.`);

  // --- 3. Create or update the demo user ---
  const demoUser = await prisma.user.upsert({
    where: { email: demoUserEmail },
    update: { password: hashedPassword, role: UserRole.DEMO },
    create: {
      email: demoUserEmail,
      password: hashedPassword,
      name: "Demo User",
      emailVerified: new Date(),
      role: UserRole.DEMO,
    },
  });
  console.log(
    `Created/Updated DEMO user: ${demoUser.email} (ID: ${demoUser.id})`
  );

  // --- 3b. Create a Subscription for the Demo User ---
  console.log(
    `Creating subscription for user ${demoUser.email} to plan ${freePlan.name}...`
  );

  await prisma.subscription.create({
    data: {
      userId: demoUser.id,
      planId: freePlan.id,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(),
      currentPeriodEnd: null,
    },
  });

  console.log(
    `   - Created ACTIVE subscription linking User ${demoUser.id} to Plan ${freePlan.id} with no expiration date (currentPeriodEnd: null).`
  );

  // --- 4. Define and Ensure Tags Exist for the Demo User ---
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
    let tag: Tag | null = await prisma.tag.findFirst({
      where: { name: tagName, userId: demoUser.id },
    });

    if (!tag) {
      tag = await prisma.tag.create({
        data: { name: tagName, userId: demoUser.id },
      });
      console.log(`   Created tag: "${tag.name}" (ID: ${tag.id})`);
    } else {
      console.log(`   Tag "${tag.name}" already exists (ID: ${tag.id})`);
    }
    createdTagsMap.set(tagName, tag.id);
  }
  console.log("Base tags processed.");

  // --- 5. Define data for Short Links ---
  type ShortLinkSeedData = {
    shortCode: string;
    originalUrl: string;
    description: string;
    tagsToAssign: string[];
    expiresAt?: Date;
    utmSets?: UTMSetDefinition[];
  };

  const shortLinksData: ShortLinkSeedData[] = [
    {
      shortCode: "ggl",
      originalUrl: `https://google.com/`,
      description: "Link to Google Search",
      tagsToAssign: ["tools", "important", "demo-data"],
      utmSets: [
        {
          source: "seed_demo",
          medium: "referral",
          campaign: "initial_content",
          term: "search_engine",
        },
        {
          source: "partner_site",
          medium: "cpc",
          campaign: "google_partnership",
          content: "banner_ad_v1",
        },
      ],
    },
    {
      shortCode: "ghub",
      originalUrl: "https://github.com",
      description: "Link to GitHub",
      tagsToAssign: ["tools", "dev", "demo-data"],
    },
    {
      shortCode: "lkdn",
      originalUrl: `https://linkedin.com/`,
      description: "Link to LinkedIn",
      tagsToAssign: ["social", "marketing", "demo-data"],
      utmSets: [
        {
          source: "linkedin_profile",
          medium: "social",
          campaign: "personal_branding_q2",
          content: `profile_link`,
        },
      ],
    },
    {
      shortCode: "fb",
      originalUrl: `https://facebook.com/?ref=page_internal`,
      description: "Link to Facebook",
      tagsToAssign: ["social", "demo-data"],
      utmSets: [
        { source: "fb_page", medium: "social", campaign: "spring_sale_2025" },
        {
          source: "fb_group",
          medium: "social",
          campaign: "community_engagement",
        },
      ],
    },
    {
      shortCode: "demo",
      originalUrl: `https://example.com/?other_param=value1`,
      description: "A randomly generated link",
      tagsToAssign: ["marketing", "demo-data"],
      utmSets: [
        {
          source: "random_source",
          medium: "cpc",
          campaign: `product_launch_${faker.commerce.department()}`,
          term: faker.lorem.word(),
          content: `${faker.color.human()}_ad_variant`,
        },
      ],
    },
    {
      shortCode: "blog",
      originalUrl: "https://medium.com",
      description: "Link to Medium blog platform",
      expiresAt: faker.date.future({ years: 1 }),
      tagsToAssign: ["social", "demo-data"],
      utmSets: [
        {
          source: "blog_sidebar",
          medium: "referral",
          campaign: "content_marketing",
        },
      ],
    },
  ];

  // --- 6. Create Short Links, LinkTags, Click Events, and conditionally UTMParams ---
  for (const linkData of shortLinksData) {
    const numClicksForThisLink = faker.number.int({ min: 50, max: 250 });
    console.log(
      ` --> Processing ShortLink: ${linkData.shortCode} (${numClicksForThisLink} clicks)`
    );

    const randomCreatedAt = faker.date.past({ years: 1, refDate: new Date() });

    // --- 6a. Create the ShortLink using the clean URL ---
    const shortLink = await prisma.shortLink.create({
      data: {
        originalUrl: linkData.originalUrl,
        shortCode: linkData.shortCode,
        userId: demoUser.id,
        description: linkData.description,
        clicks: 0,
        expiresAt: linkData.expiresAt,
        createdAt: randomCreatedAt,
      },
    });
    console.log(
      `   - Created ShortLink: ${shortLink.shortCode} (ID: ${shortLink.id}) with URL: ${linkData.originalUrl}`
    );

    // --- 6b. Create UTMParam records for each defined set ---
    if (linkData.utmSets && linkData.utmSets.length > 0) {
      console.log(
        `   - Found ${linkData.utmSets.length} UTM definition(s). Creating UTMParam records...`
      );
      for (const utmDef of linkData.utmSets) {
        // Ensure campaign exists, otherwise skip (shouldn't happen with mandatory type)
        if (!utmDef.campaign) {
          console.warn(
            `   - Skipping UTM set for ${shortLink.shortCode} due to missing campaign name.`
          );
          continue;
        }
        await prisma.uTMParam.create({
          data: {
            source: utmDef.source,
            medium: utmDef.medium,
            campaign: utmDef.campaign,
            term: utmDef.term,
            content: utmDef.content,
            shortLinkId: shortLink.id, // Link to the created ShortLink
          },
        });
        console.log(
          `     - Created UTMParam for campaign: "${utmDef.campaign}"`
        );
      }
    } else {
      console.log(
        `   - No UTM definitions found for ${shortLink.shortCode}. Skipping UTMParam creation.`
      );
    }

    // --- 6c. Create LinkTag entries ---
    const linkTagDataToCreate = linkData.tagsToAssign
      .map((tagName) => createdTagsMap.get(tagName))
      .filter((tagId): tagId is string => !!tagId) // Filter out undefined IDs
      .map((tagId) => ({ linkId: shortLink.id, tagId }));

    if (linkTagDataToCreate.length > 0) {
      const linkTagCreationResult = await prisma.linkTag.createMany({
        data: linkTagDataToCreate,
        skipDuplicates: true,
      });
      console.log(
        `   - Assigned tags: ${linkData.tagsToAssign.join(", ")} (${
          linkTagCreationResult.count
        } relations created).`
      );
    }

    // --- 6d. Generate varied Click Events with potential UTMs ---
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
      const city = faker.helpers.arrayElement(locations[country]);
      const clickTimestamp = faker.date.between({
        from: randomCreatedAt,
        to: new Date(),
      });
      const utmParamsForClick = getClickUTMs(linkData.utmSets);

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
        utmSource: utmParamsForClick.utmSource,
        utmMedium: utmParamsForClick.utmMedium,
        utmCampaign: utmParamsForClick.utmCampaign, // Will be null if no UTMs assigned
        utmTerm: utmParamsForClick.utmTerm,
        utmContent: utmParamsForClick.utmContent,
      });
    }

    if (clickEventsToCreate.length > 0) {
      const creationResult = await prisma.clickEvent.createMany({
        data: clickEventsToCreate,
        skipDuplicates: true,
      });
      console.log(`   - Added ${creationResult.count} ClickEvents.`);

      await prisma.shortLink.update({
        where: { id: shortLink.id },
        data: { clicks: creationResult.count },
      });
      console.log(
        `   - Updated ShortLink click count to ${creationResult.count}.`
      );
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
