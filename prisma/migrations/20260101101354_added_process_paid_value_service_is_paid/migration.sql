-- AlterTable
ALTER TABLE "Process" ADD COLUMN     "paidValue" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ServiceItem" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false;
