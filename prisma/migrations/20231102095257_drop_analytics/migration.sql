/*
  Warnings:

  - You are about to drop the `UrlAnalytics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UrlAnalytics" DROP CONSTRAINT "UrlAnalytics_url_id_fkey";

-- DropTable
DROP TABLE "UrlAnalytics";
