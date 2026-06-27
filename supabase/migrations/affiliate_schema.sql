-- ==========================================
-- AFFILIATE PROGRAM SCHEMA UPDATES
-- ==========================================
-- Instructions: 
-- You can run these commands directly in your Supabase SQL Editor.
-- However, because you are using Prisma, running raw SQL directly 
-- will cause Prisma to fall out of sync with your database.
-- 
-- RECOMMENDATION:
-- Instead of running this SQL manually, update your `prisma/schema.prisma` 
-- file as shown at the bottom of this document, and then run:
-- `npx prisma db push` OR `npx prisma migrate dev`
-- ==========================================

-- 1. Add affiliate tracking to the User table
-- We add 'affiliate_code' and make it unique, and 'referred_by' which references another user's 'affiliate_code'.
ALTER TABLE "User" ADD COLUMN "affiliateCode" TEXT;
ALTER TABLE "User" ADD COLUMN "referredBy" TEXT;

-- Create a unique index for the affiliate code
CREATE UNIQUE INDEX "User_affiliateCode_key" ON "User"("affiliateCode");

-- 2. Create the Affiliate Earnings table
CREATE TABLE "AffiliateEarning" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amountEarned" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateEarning_pkey" PRIMARY KEY ("id")
);

-- Add Foreign Key constraint linking earnings to a user
ALTER TABLE "AffiliateEarning" ADD CONSTRAINT "AffiliateEarning_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


/*
===================================================
PRISMA EQUIVALENT (Highly Recommended over raw SQL)
===================================================

// Add these to your existing User model in `prisma/schema.prisma`:
model User {
  // ... existing fields ...
  
  affiliateCode String? @unique
  referredBy    String?
  earnings      AffiliateEarning[]
}

// Add this new model to `prisma/schema.prisma`:
model AffiliateEarning {
  id           String   @id @default(cuid())
  userId       String
  amountEarned Float
  status       String   @default("PENDING") // PENDING, PAID, REJECTED
  createdAt    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id])
}
*/
