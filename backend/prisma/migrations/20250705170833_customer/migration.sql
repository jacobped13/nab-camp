-- CreateTable
CREATE TABLE "customer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "stakeholderId" TEXT NOT NULL,
    "stakeholderType" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_customer_id" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uidx_customer_provider_providerId" ON "customer"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_customer_stkType_stkId" ON "customer"("stakeholderType", "stakeholderId");
