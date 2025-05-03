/*
  Warnings:

  - The primary key for the `UTMParam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `updatedAt` to the `UTMParam` table without a default value. This is not possible if the table is not empty.
  - Made the column `campaign` on table `UTMParam` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UTMParam" DROP CONSTRAINT "UTMParam_pkey",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "campaign" SET NOT NULL,
ADD CONSTRAINT "UTMParam_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "UTMParam_id_seq";

-- CreateIndex
CREATE INDEX "UTMParam_shortLinkId_idx" ON "UTMParam"("shortLinkId");
