"use server"

import { BankAccountEntity } from "@/domain/entities/bank-account.entity";
import { EntityMapper } from "@/domain/infra/mappers/entity-mapper";
import { prisma } from "@/lib/prisma/prisma"; // Verifique onde está seu prisma client
import { BankAccountInput } from "@/models/bankAccount/bank_account_model";
import { Decimal } from "@prisma/client/runtime/client";
import { revalidatePath } from "next/cache";

// Interface que padroniza o que toda movimentação financeira precisa enviar
interface TransactionBase {
  value: string;        // O valor vem do input como string (ex: "150.00")
  method: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'BANK_TRANSFER' | 'BOLETO' | 'DEPOSIT';
  description?: string; // Opcional
  processId?: string;   // Opcional: Para amarrar ao processo do veículo
  clientId?: string;    // Opcional: Para amarrar ao cliente
}

// Helper para centralizar a criação do histórico
async function createMovement(
  tx: any, 
  data: TransactionBase & { 
    type: 'DEPOSIT' | 'TRANSFER' | 'CLIENT_INCOME' | 'TAX_OUT' | 'EXPENSE',
    originAccountId?: string,
    destinationAccountId?: string
  }
) {
  const method = data.method ?? 'DEPOSIT';
  return await tx.transactionMovement.create({
    data: {
      type: data.type,
      method: method,
      value: parseFloat(data.value),
      description: data.description,
      originAccountId: data.originAccountId,
      destinationAccountId: data.destinationAccountId,
      processId: data.processId,
      clientId: data.clientId,
      date: new Date(),
    }
  });
}

// Busca todos os bancos cadastrados no sistema (Nubank, Bradesco, etc)
export async function fetchAvailableBanksAction() {
  try {
    const banks = await prisma.bank.findMany({
      orderBy: { name: 'asc' }
    });
    
    return { success: true, banks };
  } catch (error) {
    console.error("[BANK SERVICE] Erro ao buscar bancos:", error);
    return { success: false, message: "Erro ao carregar lista de bancos" };
  }
}

// Busca as contas bancárias COM os dados do banco vinculados
export async function fetchBankAccountsAction() {
  try {
    const accounts = await prisma.bankAccount.findMany({
      include: {
        bank: true // Traz os dados do model Bank (name, code, cnpj do banco)
      },
      orderBy: {
        balance: 'desc'
      }
    });

    // Como o Prisma retorna Decimal, o Next pode reclamar na serialização para o Client
    // Vamos garantir que o balance vá como string ou número
    const serializedAccounts = EntityMapper.deserializeList(BankAccountEntity, accounts);

    return { success: true, accounts: serializedAccounts };
  } catch (error) {
    console.error("[BANK SERVICE] Erro ao buscar contas:", error);
    return { success: false, message: "Erro ao carregar contas bancárias" };
  }
}

// Action para criar a conta
export async function createBankAccountAction(data: BankAccountInput) {
  try {
    const newAccount = await prisma.bankAccount.create({
      data: {
        bankId: data.bankId,
        cnpj: data.cnpj,
        agency: data.agency,
        account: data.account,
        balance: data.balance, // O Prisma lida com o Decimal se for string numérica
      }
    });

    // 3. Revalida a página para atualizar os cards de banco
    revalidatePath("/financeiro"); // Ajuste para a sua rota real

    return { 
      success: true, 
      message: "Conta bancária cadastrada com sucesso!" 
    };
  } catch (error: any) {
    console.error("[BANK SERVICE] Erro ao criar conta:", error);
    
    // Tratamento de erros de unicidade (P2002 do Prisma)
    if (error.code === 'P2002') {
      return {
        success: false,
        message: "Esta conta já está cadastrada no sistema."
      };
    }

    return { 
      success: false, 
      message: "Erro interno ao processar o cadastro." 
    };
  }
}

export async function depositAction(data: TransactionBase & { accountId: string }) {
  try {
    const amount = parseFloat(data.value);
    
    const result = await prisma.$transaction(async (tx) => {
      // 1. Atualiza o saldo
      const updatedAccount = await tx.bankAccount.update({
        where: { id: data.accountId },
        data: { balance: { increment: amount } }
      });

      // 2. Registra o histórico usando o helper
      await createMovement(tx, {
        ...data,
        type: 'DEPOSIT',
        destinationAccountId: data.accountId,
        description: data.description || "Depósito manual"
      });

      return updatedAccount;
    });

    const serialized = { ...result, balance: result.balance.toString() };
    revalidatePath("/financeiro");
    return { success: true, account: serialized };
  } catch (error) {
    console.error("[BANK SERVICE] Erro no depósito:", error);
    return { success: false, message: "Erro ao processar depósito." };
  }
}

export async function transferAction(data: TransactionBase & { originId: string, destinationId: string }) {
  try {
    const amount = parseFloat(data.value);

    await prisma.$transaction(async (tx) => {
      const originAccount = await tx.bankAccount.findUnique({
        where: { id: data.originId }
      });

      if (!originAccount || Number(originAccount.balance) < amount) {
        throw new Error("Saldo insuficiente na conta de origem.");
      }

      // Atualiza saldos
      await tx.bankAccount.update({
        where: { id: data.originId },
        data: { balance: { decrement: amount } }
      });

      await tx.bankAccount.update({
        where: { id: data.destinationId },
        data: { balance: { increment: amount } }
      });

      // Registra o histórico usando o helper
      await createMovement(tx, {
        ...data,
        type: 'TRANSFER',
        originAccountId: data.originId,
        destinationAccountId: data.destinationId,
        description: data.description || "Transferência entre contas",
        method: 'BANK_TRANSFER'
      });
    });

    revalidatePath("/financeiro");
    return { success: true, message: "Transferência realizada!" };
  } catch (error: any) {
    console.error("[BANK SERVICE] Erro na transferência:", error);
    return { success: false, message: error.message || "Erro na transferência." };
  }
}
export async function processPaymentAction(data: TransactionBase & { destinationId: string }) {
  try {
    const amount = parseFloat(data.value);

    const result = await prisma.$transaction(async (tx) => {
      const process = await tx.process.findUnique({
        where: { id: data.processId }
      })

      if (!process) {
        throw new Error("Processo não encontrado.");
      }

      if (process.paidValue >= process.totalValue) {
        throw new Error("Processo ja pago.");
      }

      const leftValue = Decimal.sub(process.totalValue, process.paidValue);
      if (new Decimal(amount).greaterThan(leftValue)) {
        throw new Error("Valor pago maior que o restante devido pelo cliente.");
      }
      // Atualiza o saldo da conta que recebeu o dinheiro
      console.log('payment data', data);
      const updatedAccount = await tx.bankAccount.update({
        where: { id: data.destinationId },
        data: { balance: { increment: amount } }
      });
      console.log('updatedAccount', updatedAccount);

      const updatedProcess = await tx.process.update({
        where: { id: data.processId },
        data: { paidValue: { increment: amount } }
      });

      console.log('updatedProcess', updatedProcess);

      // Registra a movimentação de entrada (Honorários/Pagamento)
      const movement = await createMovement(tx, {
        ...data,
        // value: amount.toString(),
        type: 'CLIENT_INCOME',
        // category: 'HONORARIOS',
        method: data.method, // PIX, CARD, CASH, etc
        destinationAccountId: data.destinationId,
        description: data.description || `Pagamento de Processo`,
        processId: data.processId // Se você vincular ao processo no banco
      });

      console.log('movement', movement);

      return { updatedAccount, updatedProcess, movement };
    });

    revalidatePath("/financeiro");
    return { 
      success: true, 
      account: { ...result.updatedAccount, balance: result.updatedAccount.balance.toString() },
      movement: result.movement 
    };
  } catch (error) {
    console.error("[FINANCE SERVICE] Erro no pagamento:", error);
    return { success: false, message: "Erro ao processar recebimento." };
  }
}

// 2. Liquidar Taxas (Similar ao seu Withdraw/Transfer)
export async function processTaxPaymentAction(data: TransactionBase & { originId: string, services: string[] }) {
  try {
    const amount = parseFloat(data.value);

    const result = await prisma.$transaction(async (tx) => {
      const account = await tx.bankAccount.findUnique({ where: { id: data.originId } });

      if (!account || Number(account.balance) < amount) {
        throw new Error("Saldo insuficiente para pagar as taxas.");
      }

      // Decrementa o saldo (Saída de dinheiro)
      const updatedAccount = await tx.bankAccount.update({
        where: { id: data.originId },
        data: { balance: { decrement: amount } }
      });

      const updatedServices = await tx.serviceItem.updateMany({
        where: { id: { in: data.services } },
        data: { isPaid: true }
      });

      // Registra a movimentação de saída (Despesa/Taxa)
      const movement = await createMovement(tx, {
        ...data,
        type: 'TAX_OUT',
        // method: 'DEPOSIT',
        originAccountId: data.originId,
        description: data.description || `Pagamento de ${data.services?.length} taxa(s)`,
      });

      return { updatedAccount, updatedServices, movement };
    });

    revalidatePath("/financeiro");
    return { 
      success: true, 
      account: { ...result.updatedAccount, balance: result.updatedAccount.balance.toString() },
      movement: result.movement 
    };
  } catch (error: any) {
    console.error("[FINANCE SERVICE] Erro nas taxas:", error);
    return { success: false, message: error.message || "Erro ao processar taxas." };
  }
}

export async function fetchTransactionMovimentsAction() {
  try {
    const movements = await prisma.transactionMovement.findMany({
      include: {
        // Traz os dados da conta de origem e o banco dela
        originAccount: {
          include: { bank: true }
        },
        // Traz os dados da conta de destino e o banco dela
        destinationAccount: {
          include: { bank: true }
        },
        // Traz o cliente se houver
        client: {
          select: { name: true }
        }
      },
      orderBy: {
        date: 'desc' // Mais recentes primeiro
      }
    });

    // Converte Decimal para String para o Serializer do Next.js
    const serialized = movements.map(m => ({
      ...m,
      value: m.value.toString(),
      date: m.date.toISOString(),
      originAccount: m.originAccount ? { ...m.originAccount, balance: m.originAccount.balance.toString() } : null,
      destinationAccount: m.destinationAccount ? { ...m.destinationAccount, balance: m.destinationAccount.balance.toString() } : null
    }));

    console.log('Movimentos carregados:', serialized);

    return { success: true, movements: serialized };
  } catch (error) {
    console.error("[BANK SERVICE] Erro ao buscar extrato:", error);
    return { success: false, message: "Erro ao carregar extrato." };
  }
}