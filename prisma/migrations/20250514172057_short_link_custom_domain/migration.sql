-- AlterTable
ALTER TABLE "ShortLink" ADD COLUMN     "customDomainId" TEXT;

-- AddForeignKey
ALTER TABLE "ShortLink" ADD CONSTRAINT "ShortLink_customDomainId_fkey" FOREIGN KEY ("customDomainId") REFERENCES "CustomDomain"("id") ON DELETE SET NULL ON UPDATE CASCADE;
