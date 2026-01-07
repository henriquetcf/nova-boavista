"use server"
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export async function createClientAction(data: { name: string; document: string; phone: string }) {
  try {
    const cleanedDocument = data.document.replace(/\D/g, ""); // Limpa CPF/CNPJ
    const client = await prisma.client.create({
      data: {
        name: data.name,
        cpf: cleanedDocument.length === 11 ? cleanedDocument : null,
        cnpj: cleanedDocument.length === 14 ? cleanedDocument : null,
        // document: data.document.replace(/\D/g, ""), // Limpa CPF/CNPJ
        phone: data.phone.replace(/\D/g, ""),       // Limpa Telefone
      }
    });

    revalidatePath("/clientes");
    revalidatePath("processo/novo");
    return { success: true, client };
  } catch (error) {
    console.error("[CLIENT SERVICE] Erro ao cadastrar cliente:", error);
    return { success: false, message: "Erro ao cadastrar cliente." };
  }
}

export async function fetchClientsAction(query?: string) {
  try {
    // if (!query) return [];
    const clients = await prisma.client.findMany();
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
    const clients = await prisma.client.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      take: 10, // Retorna só os 10 melhores resultados
      // select: { id: true, name: true }
    });
    console.log('clientes', clients);
    // return clients;
    return { success: true, clients };
    // return { success: true, clients };

  } catch (error) {
    console.error("[CLIENT SERVICE] Erro ao buscar clientes:", error);
    return { success: false, message: "Erro ao buscar clientes." };
  }
}