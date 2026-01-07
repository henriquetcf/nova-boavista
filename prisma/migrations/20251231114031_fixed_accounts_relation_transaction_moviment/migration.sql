-- AddForeignKey
ALTER TABLE "TransactionMoviment" ADD CONSTRAINT "TransactionMoviment_originAccountId_fkey" FOREIGN KEY ("originAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionMoviment" ADD CONSTRAINT "TransactionMoviment_destinationAccountId_fkey" FOREIGN KEY ("destinationAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
