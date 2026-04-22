/*
  Warnings:

  - Added the required column `quantity` to the `subscriptionItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscriptionItem" ADD COLUMN     "quantity" INTEGER NOT NULL;
