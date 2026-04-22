/*
  Warnings:

  - You are about to drop the `userIdentityProvider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "userIdentityProvider" DROP CONSTRAINT "fk_user_idp_userId";

-- DropTable
DROP TABLE "userIdentityProvider";

-- CreateTable
CREATE TABLE "stakeholderIdentityProvider" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "stakeholderId" TEXT NOT NULL,
    "stakeholderType" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_stkIdp_id" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_stkIdp_stkId_stkType" ON "stakeholderIdentityProvider"("stakeholderType", "stakeholderId");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_stkIdp_provider_providerId" ON "stakeholderIdentityProvider"("provider", "providerId");
