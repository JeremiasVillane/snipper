/*
  Warnings:

  - A unique constraint covering the columns `[url_id]` on the table `UrlAnalytic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UrlAnalytic_url_id_key" ON "UrlAnalytic"("url_id");
