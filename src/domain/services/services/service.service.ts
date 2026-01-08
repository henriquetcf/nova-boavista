"use server"
import { ServiceEntity } from "@/domain/entities/service.entity";
import { EntityMapper } from "@/domain/infra/mappers/entity-mapper";
import { prisma } from "@/lib/prisma/prisma";
import { ServiceInput, ServiceSchema } from "@/models/services/services.model";
import { revalidatePath } from "next/cache";

export async function createServiceAction(rawInput: ServiceInput) {
  // 1. Validação extra no servidor por segurança
  const result = ServiceSchema.safeParse(rawInput);

  if (!result.success) {
    return { 
      success: false, 
      message: "Dados inválidos.",
      errors: result.error.flatten().fieldErrors 
    };
  }

  const { name, baseValue, finalValue, notes, requiredDocuments } = result.data;

  try {
    // 2. Criar no Banco
    const service = await prisma.service.create({
      data: {
        name,
        // Convertendo strings "150.00" para float/decimal do Prisma
        baseValue: parseFloat(baseValue),
        finalValue: parseFloat(finalValue),
        profit: parseFloat(finalValue) - parseFloat(baseValue),
        // notes: notes,
        // Salvamos como string separada por vírgula para facilitar buscas simples
        requiredDocuments: requiredDocuments.join(','), 
      }
    });

    // 3. Revalidar as páginas que usam lista de serviços
    revalidatePath("/servicos");
    
    return { 
      success: true, 
      message: "Serviço configurado com sucesso!",
      serviceId: service.id 
    };

  } catch (error: any) {
    console.error("Erro ao criar serviço:", error);
    
    // Tratar erro de nome duplicado (Unique constraint no Prisma)
    if (error.code === 'P2002') {
      return { success: false, message: "Já existe um serviço com este nome." };
    }

    return { success: false, message: "Erro interno ao salvar no banco de dados." };
  }
}

export async function fetchServicesAction() {
  try {
    const result = await prisma.service.findMany();
    const services = EntityMapper.deserializeList(ServiceEntity, result);
    return { success: true, services };
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return { success: false, message: "Erro ao buscar serviços." };
  }
}

export async function searchServicesAction(query: string) {
  try {
    // if (!query) return [];
    const result = await prisma.service.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      take: 10, // Retorna só os 10 melhores resultados
      // select: { id: true, name: true }
    });
    const services = EntityMapper.deserializeList(ServiceEntity, result);
    console.log('services', services);
    // return clients;
    return { success: true, services };
    // return { success: true, clients };

  } catch (error) {
    console.error("[SERVICE SERVICE] Erro ao buscar servicos:", error);
    return { success: false, message: "Erro ao buscar servicos." };
  }
}