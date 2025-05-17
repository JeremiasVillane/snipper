/*
  Warnings:

  - You are about to drop the column `description` on the `ShortLink` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CustomDomain" ADD COLUMN     "isLinkHubEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "linkHubTitle" TEXT;

-- AlterTable
ALTER TABLE "ShortLink" DROP COLUMN "description",
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT;
