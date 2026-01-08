"use server"
import { ClientEntity } from "@/domain/entities/client.entity";
import { EntityMapper } from "@/domain/infra/mappers/entity-mapper";
import { prisma } from "@/lib/prisma/prisma";
import { ClientInput } from "@/models/client/client.model";
import { revalidatePath } from "next/cache";

export async function createClientAction(data: ClientInput) {
  try {
    const cleanedDocument = data.document.replace(/\D/g, ""); // Limpa CPF/CNPJ
    const client = await prisma.client.create({
      data: {
        name: data.name,
        document: cleanedDocument,
        email: data.email,
        address: data.address,
        // document: data.document.replace(/\D/g, ""), // Limpa CPF/CNPJ
        phone: data.phone?.replace(/\D/g, ""),       // Limpa Telefone
      }
    });

    const serializedClient = EntityMapper.deserialize(ClientEntity, client);
    console.log('client', serializedClient);

    revalidatePath("/clientes");
    revalidatePath("processo/novo");
    return { success: true, client: serializedClient };
  } catch (error) {
    console.error("[CLIENT SERVICE] Erro ao cadastrar cliente:", error);
    return { success: false, message: "Erro ao cadastrar cliente." };
  }
}

export async function fetchClientsAction(query?: string) {
  try {
    // if (!query) return [];
    const results = await prisma.client.findMany();

    const clients = EntityMapper.deserializeList(ClientEntity, results);
    console.log('clientes', clients);
    // return clients;
    return { success: true, clients };
    // return { success: true, clients };

  } catch (error) {
    console.error("[CLIENT SERVICE] Erro ao buscar clientes:", error);
    return { success: false, message: "Erro ao buscar clientes." };
  }
}

// actions/client-actions.ts
export async function searchClientsAction(query: string) {
  try {
    // if (!query) return [];
    const results = await prisma.client.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      take: 10, // Retorna só os 10 melhores resultados
      // select: { id: true, name: true }
    });

    const clients = EntityMapper.deserializeList(ClientEntity, results);
    console.log('clientes', clients);
    // return clients;
    return { success: true, clients };
    // return { success: true, clients };

  } catch (error) {
    console.error("[CLIENT SERVICE] Erro ao buscar clientes:", error);
    return { success: false, message: "Erro ao buscar clientes." };
  }
}