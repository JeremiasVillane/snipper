/*
  Warnings:

  - Added the required column `clicks` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "clicks" INTEGER NOT NULL;
