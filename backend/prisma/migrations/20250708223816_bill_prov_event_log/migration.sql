-- CreateTable
CREATE TABLE "billingProviderEventLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_billing_provider_event_log_id" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uidx_billing_provider_event_log_provider_providerId" ON "billingProviderEventLog"("provider", "providerId");
