/*
  Warnings:

  - Added the required column `currentPeriodEndAt` to the `subscriptionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentPeriodStartAt` to the `subscriptionItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "cancelAt" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "subscriptionItem" ADD COLUMN     "currentPeriodEndAt" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "currentPeriodStartAt" TIMESTAMPTZ(6) NOT NULL;
