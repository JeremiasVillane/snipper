/*
  Warnings:

  - The values [PREMIUM] on the enum `PlanType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlanType_new" AS ENUM ('FREE', 'PAID');
ALTER TABLE "Plan" ALTER COLUMN "type" TYPE "PlanType_new" USING ("type"::text::"PlanType_new");
ALTER TYPE "PlanType" RENAME TO "PlanType_old";
ALTER TYPE "PlanType_new" RENAME TO "PlanType";
DROP TYPE "PlanType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "api" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "custom" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "expiration" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "export" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "thumbnail" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "utm" BOOLEAN NOT NULL DEFAULT false;
