/*
  Warnings:

  - You are about to drop the column `isActive` on the `UTMParam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClickEvent" ADD COLUMN     "utmContent" TEXT,
ADD COLUMN     "utmMedium" TEXT,
ADD COLUMN     "utmSource" TEXT,
ADD COLUMN     "utmTerm" TEXT;

-- AlterTable
ALTER TABLE "UTMParam" DROP COLUMN "isActive";
