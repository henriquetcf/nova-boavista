/*
  Warnings:

  - You are about to drop the `_ProcessServices` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `finalValue` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profit` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ProcessServices" DROP CONSTRAINT "_ProcessServices_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProcessServices" DROP CONSTRAINT "_ProcessServices_B_fkey";

-- AlterTable
ALTER TABLE "Process" ADD COLUMN     "totalProfit" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "finalValue" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "profit" DECIMAL(65,30) NOT NULL;

-- DropTable
DROP TABLE "_ProcessServices";

-- CreateTable
CREATE TABLE "ServiceItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseValue" DECIMAL(65,30) NOT NULL,
    "finalValue" DECIMAL(65,30) NOT NULL,
    "profit" DECIMAL(65,30) NOT NULL,
    "processId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "ServiceItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceItem" ADD CONSTRAINT "ServiceItem_processId_fkey" FOREIGN KEY ("processId") REFERENCES "Process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceItem" ADD CONSTRAINT "ServiceItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
