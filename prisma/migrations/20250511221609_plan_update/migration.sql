/*
  Warnings:

  - You are about to drop the column `api` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `export` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `utm` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "api",
DROP COLUMN "export",
DROP COLUMN "utm";
