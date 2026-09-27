// prisma/seed.ts
import prisma from "../src/generated/prisma/client";

async function main() {
  // Brand profile
  await prisma.brandProfile.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "",
      audience: "",
      voice: "",
      prohibitedTopics: [],
      requiredDisclosures: [],
    },
  });

  // Clients
  const clients = [
    {
      id: "cl-001",
      name: "Ada Reyes",
      company: "Acme Corp",
      email: "ada@acme.com",
      phone: "+1-555-0101",
      website: "https://acme.com",
      industry: "SaaS",
      status: "ACTIVE",
      approved: true,
      revenue: 12500,
      accountManager: "Mia Chen",
      tags: ["enterprise", "retainer"],
      notes: "Quarterly review scheduled for March.",
      postCount: 42,
      lastPostAt: new Date("2024-01-15T10:00:00Z"),
    },
    {
      id: "cl-002",
      name: "Ben Okafor",
      company: "Northwind Labs",
      email: "ben@northwind.io",
      phone: "+1-555-0114",
      website: "https://northwind.io",
      industry: "Healthtech",
      status: "PROSPECT",
      approved: false,
      revenue: 0,
      accountManager: "Diego Santos",
      tags: ["inbound", "trial"],
      notes: "Requested pricing sheet.",
      postCount: 0,
    },
    {
      id: "cl-003",
      name: "Cara Lin",
      company: "Lumen & Co",
      email: "cara@lumen.co",
      phone: "+1-555-0188",
      website: "https://lumen.co",
      industry: "Retail",
      status: "PAUSED",
      approved: true,
      revenue: 4800,
      accountManager: "Mia Chen",
      tags: ["smb"],
      notes: "Paused billing pending budget review.",
      postCount: 17,
      lastPostAt: new Date("2023-11-09T08:15:00Z"),
    },
  ];

  for (const c of clients) {
    await prisma.client.upsert({
      where: { id: c.id },
      update: {},
      create: c,
    });
  }

  // Drafts
  await prisma.contentDraft.upsert({
    where: { id: "draft-001" },
    update: {},
    create: {
      id: "draft-001",
      topic: "Welcome to SMMAI",
      platform: "meta",
      text: "Get started with social media management automation.",
      hashtags: ["#content", "#automation"],
      status: "PUBLISHED",
      metadata: {},
      createdAt: new Date(),
      clientId: "cl-001",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });