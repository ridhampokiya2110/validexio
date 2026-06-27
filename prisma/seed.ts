import { PrismaClient, LegalDocType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Legal Documents...");

  const policies = [
    {
      type: LegalDocType.TERMS,
      version: "v1.0",
      isActive: true,
      content: `# Terms of Service
Welcome to Validexio. By using our platform, you agree to these terms...
*(Initial placeholder for Terms of Service)*`,
    },
    {
      type: LegalDocType.PRIVACY,
      version: "v1.0",
      isActive: true,
      content: `# Privacy Policy
We take your privacy seriously. This document outlines how we handle your data...
*(Initial placeholder for Privacy Policy)*`,
    },
    {
      type: LegalDocType.REFUND,
      version: "v1.0",
      isActive: true,
      content: `# Refund Policy
All digital goods are considered final sale upon generation of the AI validation report. By proceeding with a purchase, you acknowledge and agree to this no-refund policy...
*(Initial placeholder for Refund Policy)*`,
    },
  ];

  for (const policy of policies) {
    const existing = await prisma.legalDocument.findFirst({
      where: { type: policy.type, version: policy.version },
    });

    if (!existing) {
      await prisma.legalDocument.create({
        data: policy,
      });
      console.log(`✅ Seeded ${policy.type} ${policy.version}`);
    } else {
      console.log(`⏩ ${policy.type} ${policy.version} already exists. Skipping.`);
    }
  }

  console.log("Seeding Complete.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
