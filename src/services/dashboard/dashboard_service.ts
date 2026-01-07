"use server"
import { prisma } from "@/lib/prisma/prisma";

const SERVICE_SLA: Record<string, number> = {
  "Licenciamento": 3,
  "Transferência": 7,
  "Emplacamento": 5,
  "Default": 5
};

export default async function getDashboardData() {
  const now = new Date();
  // Força o início do mês na hora 00:00:00 para precisão total
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);

  const [
    clientCount,
    activeProcesses,
    revenueData,
    bankAccounts, // Nova busca
    bottlenecks,
    recentProcesses,
    deadlinesData,
    pendingDocuments,
  ] = await Promise.all([
    prisma.client.count(),

    prisma.process.count({
      where: { status: { in: ['PENDENTE', 'AGUARDANDO_PAGAMENTO', 'AGUARDANDO_EMISSAO', 'EM_EXIGENCIA'] } }
    }),

    // Lucro apenas do que foi criado a partir do dia 1º deste mês
    prisma.process.aggregate({
      _sum: { totalProfit: true },
      where: {
        createdAt: { gte: startOfMonth }
      }
    }),

    // Busca detalhada de saldos por conta/banco
    prisma.bankAccount.findMany({
      select: {
        id: true,
        account: true,
        balance: true,
        bank: { select: { name: true } }
      }
    }),

    prisma.process.groupBy({
      by: ['status'],
      _count: { id: true },
      where: { status: { not: 'CONCLUIDO' } }
    }),

    prisma.process.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        // clientName: true,
        client: { select: { name: true } },
        plate: true,
        status: true,
        updatedAt: true,
        totalProfit: true
      }
    }),

    prisma.process.findMany({
      where: { status: { not: 'CONCLUIDO' } },
      include: {
        services: { include: { service: true } }
      },
      take: 15
    }),

    prisma.document.groupBy({
      by: ['name', 'processId'], // Agrupa por nome e processo
      where: { 
        isUploaded: false 
      },
    }),
  ]);

  // Calcula saldo total consolidado
  const totalBalance = bankAccounts.reduce((acc, curr) => acc + Number(curr.balance), 0);

  const upcomingDeadlines = deadlinesData.map(proc => {
    const maxSlaDays = proc.services.reduce((max, item) => {
      const days = SERVICE_SLA[item.name] || SERVICE_SLA["Default"];
      return days > max ? days : max;
    }, 0);

    const expirationDate = new Date(proc.createdAt);
    expirationDate.setDate(expirationDate.getDate() + maxSlaDays);

    return {
      id: proc.id,
      task: `${proc.plate} - ${proc.clientName}`,
      expirationDate,
      isUrgent: expirationDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000)
    };
  })
  .sort((a, b) => a.expirationDate.getTime() - b.expirationDate.getTime())
  .slice(0, 3);

  return {
    kpis: {
      clients: clientCount,
      active: activeProcesses,
      profit: Number(revenueData._sum.totalProfit || 0),
      balance: totalBalance, // Saldo total
      bankDetails: bankAccounts, // Detalhes para o Popover
      alerts: upcomingDeadlines.filter(d => d.isUrgent).length
    },
    bottlenecks: bottlenecks.map(b => ({
      label: b.status === 'PENDENTE' ? 'Aguardando' : 'Em Curso',
      count: b._count.id,
      status: b.status
    })),
    recentActivities: recentProcesses,
    upcomingDeadlines,
    pendingDocuments: pendingDocuments.length
  };
}

export async function searchGlobalAction(query: string) {
  if (!query || query.length < 2) return [];

  try {
    const results = await prisma.process.findMany({
      where: {
        OR: [
          { plate: { contains: query, mode: 'insensitive' } },
          { client: { name: { contains: query, mode: 'insensitive' } } }
        ]
      },
      include: {
        client: true // Para pegar o nome do cliente
      },
      take: 5 // Limita para não sobrecarregar o dropdown
    });

    return results

    // return results.map(proc => ({
    //   id: proc.id,
    //   type: 'PROCESS',
    //   plate: proc.plate,
    //   clientName: proc.client.name,
    //   status: proc.status,
    //   // Campos extras para a EntityDetailView
    //   totalProfit: proc.profit ?? 0,
    //   updatedAt: proc.updatedAt
    // }));
  } catch (error) {
    console.error("Erro na busca global:", error);
    return [];
  }
}

export async function getEntityDetailsAction(id: string, type: 'PROCESS' | 'CLIENT') {
  try {
    if (type === 'PROCESS') {
      return await prisma.process.findUnique({
        where: { id },
        include: {
          client: true,
          documents: true, // Aqui vem a inteligência dos documentos
          services: true,  // Aqui vem a inteligência dos serviços
          // taxes: true,     // Aqui vem a inteligência das taxas
          movements: {        // Histórico real de eventos
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    }
    // Lógica para CLIENT se necessário...
  } catch (error) {
    console.error("Erro ao buscar detalhes:", error);
    return null;
  }
}