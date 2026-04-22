/*
  Warnings:

  - Added the required column `status` to the `price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "price" ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "status" TEXT NOT NULL;
