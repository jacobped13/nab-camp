-- CreateTable
CREATE TABLE "userIdentityProvider" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_user_idp_id" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_user_idp_userId" ON "userIdentityProvider"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_user_idp_provider_providerId" ON "userIdentityProvider"("provider", "providerId");
