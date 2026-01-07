-- 1. Criar o novo tipo Enum temporário
CREATE TYPE "Status_new" AS ENUM ('PENDENTE', 'AGUARDANDO_PAGAMENTO', 'AGUARDANDO_EMISSAO', 'EM_EXIGENCIA', 'PRONTO_ENTREGA', 'CONCLUIDO', 'CANCELADO');

-- 2. Alterar a coluna na tabela Process para usar o novo tipo com mapeamento de dados
ALTER TABLE "Process" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Process" ALTER COLUMN "status" TYPE "Status_new" 
    USING (
        CASE 
            WHEN "status"::text = 'PENDING' THEN 'PENDENTE'::"Status_new"
            WHEN "status"::text = 'IN_PROGRESS' THEN 'AGUARDANDO_EMISSAO'::"Status_new"
            WHEN "status"::text = 'COMPLETED' THEN 'CONCLUIDO'::"Status_new"
            WHEN "status"::text = 'CANCELLED' THEN 'CANCELADO'::"Status_new"
            ELSE 'PENDENTE'::"Status_new"
        END
    );

-- 3. Criar a tabela de Movimentação (usando o tipo novo)
CREATE TABLE "ProcessMovement" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "status" "Status_new" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessMovement_pkey" PRIMARY KEY ("id")
);

-- 4. Substituir o Enum antigo pelo novo globalmente
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";

-- 5. Restaurar o Default e adicionar as constraints
ALTER TABLE "Process" ALTER COLUMN "status" SET DEFAULT 'PENDENTE';

CREATE INDEX "ProcessMovement_processId_idx" ON "ProcessMovement"("processId");

ALTER TABLE "ProcessMovement" ADD CONSTRAINT "ProcessMovement_processId_fkey" 
    FOREIGN KEY ("processId") REFERENCES "Process"("id") ON DELETE CASCADE ON UPDATE CASCADE;