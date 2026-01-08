"use server";

import { auth } from "@/auth"; // Seu setup de Auth.js
import { ProcessEntity } from "@/domain/entities/process.entity";
import { EntityMapper } from "@/domain/infra/mappers/entity-mapper";
import { prisma } from "@/lib/prisma/prisma";
import { ProcessInput } from "@/models/process/process.model";
import { Prisma, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createProcessAction(rawData: ProcessInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Sessão expirada." };
  }

  // const validation = ProcessSchema.safeParse(rawData);

  // if (!validation.success) {
  //   return { 
  //     success: false, 
  //     message: "Dados inválidos", 
  //     errors: validation.error.flatten().fieldErrors 
  //   };
  // }

  // const { plate, renavam, clientId, services, totalValue } = validation.data;
  const { plate, renavam, clientId, services, totalValue } = rawData;

  try {
    // Cálculo do lucro
    const totalProfit = services.reduce((acc, svc) => {
      return acc + (Number(svc.finalValue) - Number(svc.baseValue));
    }, 0);

    const newProcess = await prisma.$transaction(async (tx) => {
      // 1. Cria o processo e os ServiceItems primeiro
      const process = await tx.process.create({
        data: {
          plate,
          renavam,
          totalValue,
          totalProfit,
          clientId,
          userId: session.user.id,
          clientName: "", 
          services: {
            create: services.map((svc) => ({
              name: svc.name,
              baseValue: Number(svc.baseValue),
              finalValue: Number(svc.finalValue),
              profit: Number(svc.finalValue) - Number(svc.baseValue),
              service: { connect: { id: svc.id } },
            }))
          },
        },
        // Incluímos os services no retorno para ter os IDs deles
        include: { services: true }
      });

      // 2. Registra o movimento usando a função comum
      const log = await createProcessMovement(process.id, 'PENDENTE', "Abertura do processo.", tx);
      if (!log.success) throw new Error(log.error as string);

      // 3. Agora criamos os documentos vinculando a ambos (Process e ServiceItem)
      // Usamos um Map para garantir que cada 'docName' seja único por Processo
      const uniqueDocs = new Map();

      services.forEach((svc) => {
        const createdServiceItem = process.services.find(s => s.serviceId === svc.id);
        const docNames = svc.requiredDocuments?.split(',') || [];

        docNames.forEach(docName => {
          const trimmedName = docName.trim();
          if (!trimmedName) return;

          // Se o documento já existe no Map, ele não será adicionado novamente.
          // Isso garante a unicidade pelo NOME dentro do processo.
          if (!uniqueDocs.has(trimmedName)) {
            uniqueDocs.set(trimmedName, {
              name: trimmedName,
              isUploaded: false,
              processId: process.id,
              serviceItemId: createdServiceItem?.id // Vincula ao primeiro serviço que o exigiu
            });
          }
        });
      });

      // Transforma o Map de volta em um array para o createMany
      const documentsToCreate = Array.from(uniqueDocs.values());

      if (documentsToCreate.length > 0) {
        console.log('Criando documentos únicos:', documentsToCreate.length);
        await tx.document.createMany({
          data: documentsToCreate
        });
      }

      return process;
    });

    revalidatePath("/processo");
    return { success: true, message: "Processo criado!", processId: newProcess.id };

  } catch (error) {
    console.error("[CREATE_PROCESS_ERROR]:", error);
    return { success: false, message: "Erro ao salvar no banco de dados." };
  }
}

async function createProcessMovement(
  processId: string, 
  status: Status, 
  description?: string,
  tx?: Prisma.TransactionClient // Transação opcional
) {
  const db = tx || prisma; // Se não passar tx, usa o prisma normal

  try {
    // 1. Validação básica
    if (!processId) throw new Error("ID do processo é obrigatório para gerar movimento.");

    // 2. Execução
    const movement = await db.processMovement.create({
      data: {
        processId,
        status,
        description: description || `Status alterado para ${status.replace('_', ' ')}`,
      },
    });

    return { success: true, data: movement };
  } catch (error) {
    console.error(`[LOG_MOVEMENT_ERROR] Processo ${processId}:`, error);
    // Aqui você poderia integrar um Sentry ou log de erro
    return { success: false, error };
  }
}

// Action para Atualizar Status (Manual pelo Drawer)
export async function updateProcessStatusAction(
  processId: string, 
  newStatus: Status, 
  description?: string
) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Atualiza o processo
      await tx.process.update({
        where: { id: processId },
        data: { status: newStatus },
      });

      // 2. Registra o movimento usando a função comum
      const log = await createProcessMovement(processId, newStatus, description, tx);
      if (!log.success) throw new Error(log.error as string);
    });

    revalidatePath('/processo');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return { success: false, error: "Erro ao atualizar." };
  }
}

export async function fetchProcessesAction(id?: number) {
  try {
    const result = await prisma.process.findMany({ 
      include: { 
        services: true, 
        documents: true, 
        client: true, 
        movements: true 
      } 
    });

    const process = EntityMapper.deserialize(ProcessEntity, result);
    console.log('process', process);
    return { success: true, process };
  } catch (error) {
    console.error("[PROCESS SERVICE] Erro ao buscar processo:", error);
    return { success: false, message: "Erro ao buscar processo." };
  }
}

export async function toggleDocStatusAction(documentId: string, isUploaded: boolean) {
  try {
    await prisma.document.update({
      where: { id: documentId },
      data: { isUploaded: isUploaded },
    });
    revalidatePath('/processo');
    return { success: true };
  } catch (error) {
    console.error("[PROCESS SERVICE] Erro ao buscar processo:", error);
    return { success: false, message: "Erro ao buscar processo." };
  }
}