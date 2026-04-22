-- CreateTable
CREATE TABLE "product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_product_id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "productId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_price_id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "customerId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_subscription_id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptionItem" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "subscriptionId" UUID NOT NULL,
    "priceId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_subscription_item_id" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uidx_product_provider_providerId" ON "product"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_price_provider_providerId" ON "price"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_subscription_provider_providerId" ON "subscription"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_subscription_item_provider_providerId" ON "subscriptionItem"("provider", "providerId");

-- AddForeignKey
ALTER TABLE "price" ADD CONSTRAINT "fk_price_productId" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "fk_subscription_customerId" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptionItem" ADD CONSTRAINT "fk_subscription_item_subscriptionId" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptionItem" ADD CONSTRAINT "fk_subscription_item_priceId" FOREIGN KEY ("priceId") REFERENCES "price"("id") ON DELETE CASCADE ON UPDATE CASCADE;
