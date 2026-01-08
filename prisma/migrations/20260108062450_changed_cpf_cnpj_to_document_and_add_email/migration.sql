/*
  Warnings:

  - You are about to drop the column `cnpj` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the `TransactionMoviment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[document]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TransactionMoviment" DROP CONSTRAINT "TransactionMoviment_clientId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionMoviment" DROP CONSTRAINT "TransactionMoviment_destinationAccountId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionMoviment" DROP CONSTRAINT "TransactionMoviment_originAccountId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionMoviment" DROP CONSTRAINT "TransactionMoviment_processId_fkey";

-- DropIndex
DROP INDEX "Client_cnpj_key";

-- DropIndex
DROP INDEX "Client_cpf_key";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "cnpj",
DROP COLUMN "cpf",
ADD COLUMN     "document" TEXT,
ADD COLUMN     "email" TEXT;

-- DropTable
DROP TABLE "TransactionMoviment";

-- CreateTable
CREATE TABLE "TransactionMovement" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originAccountId" TEXT,
    "destinationAccountId" TEXT,
    "processId" TEXT,
    "clientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionMovement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_document_key" ON "Client"("document");

-- AddForeignKey
ALTER TABLE "TransactionMovement" ADD CONSTRAINT "TransactionMovement_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionMovement" ADD CONSTRAINT "TransactionMovement_destinationAccountId_fkey" FOREIGN KEY ("destinationAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionMovement" ADD CONSTRAINT "TransactionMovement_originAccountId_fkey" FOREIGN KEY ("originAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionMovement" ADD CONSTRAINT "TransactionMovement_processId_fkey" FOREIGN KEY ("processId") REFERENCES "Process"("id") ON DELETE SET NULL ON UPDATE CASCADE;
