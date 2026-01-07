/*
  Warnings:

  - You are about to drop the column `serviceId` on the `Process` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Process" DROP CONSTRAINT "Process_serviceId_fkey";

-- AlterTable
ALTER TABLE "Process" DROP COLUMN "serviceId";

-- CreateTable
CREATE TABLE "_ProcessServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProcessServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProcessServices_B_index" ON "_ProcessServices"("B");

-- AddForeignKey
ALTER TABLE "_ProcessServices" ADD CONSTRAINT "_ProcessServices_A_fkey" FOREIGN KEY ("A") REFERENCES "Process"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProcessServices" ADD CONSTRAINT "_ProcessServices_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
