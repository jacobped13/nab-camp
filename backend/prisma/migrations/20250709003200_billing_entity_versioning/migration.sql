-- AlterTable
ALTER TABLE "authenticationCode" ALTER COLUMN "acceptedAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "billingProviderEventLog" ALTER COLUMN "processedAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "providerVersion" TEXT;

-- AlterTable
ALTER TABLE "price" ADD COLUMN     "providerVersion" TEXT;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "providerVersion" TEXT;

-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "providerVersion" TEXT;

-- AlterTable
ALTER TABLE "subscriptionItem" ADD COLUMN     "providerVersion" TEXT;
