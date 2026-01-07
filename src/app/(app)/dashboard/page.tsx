'use client'
import React, { useEffect } from 'react';
import { 
  Globe, TrendingUp, Users, Briefcase, 
  CheckCircle2, Plus, Target, 
  Zap, AlertCircle, LayoutDashboard, ChevronRight, Clock, Wallet,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useDashboardDataStore } from '@/store/dashboard/dashboard_store';
import { ProcessDetailView } from '@/components/ui/dashboard/ProcessDetailView';
import { DashboardSearch } from '@/components/navigation/dashboard/DashboardSearch';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function DashboardHome() {
  const { data, isLoading, fetchDashboardData, selectEntity, selectedEntity } = useDashboardDataStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Configuração de Meta (Exemplo: Meta de R$ 3.000,00 de lucro mensal)
  const PROFIT_GOAL = 3000;
  const currentProfit = data?.kpis?.profit ?? 0;
  const profitPercentage = Math.min((currentProfit / PROFIT_GOAL) * 100, 100);
  const remainingToGoal = Math.max(PROFIT_GOAL - currentProfit, 0);

  const externalLinks = [
    { name: 'DETRAN SP', url: 'https://detran.sp.gov.br' },
    { name: 'Portal e-CAC', url: 'https://cav.receita.fazenda.gov.br' },
    { name: 'Sefaz / NFE', url: 'https://portal.fazenda.sp.gov.br' },
    { name: 'Senatran', url: 'https://portalservicos.senatran.serpro.gov.br' },
  ];

  const statusConfig: Record<string, { label: string; color: string }> = {
    PENDENTE: { label: 'Aguardando', color: 'bg-amber-500' },
    AGUARDANDO_PAGAMENTO: { label: 'Aguardando Pagamento', color: 'bg-[#800020]' },
    AGUARDANDO_EMISSAO: { label: 'Aguardando Emissão', color: 'bg-[#800020]' },
    CONCLUIDO: { label: 'Concluido', color: 'bg-green-500' },
  };

  // const [searchTerm, setSearchTerm] = React.useState('');

  // Filtra os processos recentes baseado no que foi digitado
  // const filteredProcesses = data?.recentActivities?.filter((proc: any) => 
  //   proc.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   proc.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  console.log('data', data);  

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-[#800020]/20 rounded-full animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Sincronizando Dados...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 lg:p-12 space-y-8 bg-white dark:bg-[#0a0a0a]">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 dark:border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <LayoutDashboard size={20} className="text-[#800020]" />
             <span className="text-[10px] font-black text-[#800020] uppercase tracking-[0.4em]">Console de Gestão</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">
            Dash <span className="text-[#d4af37]">board</span>
          </h1>
        </div>
        
        <div className="flex gap-3">
          <div className="relative group hidden sm:block">
            {/* Usando o componente específico do Dashboard */}
            <DashboardSearch onSelect={(item) => selectEntity(item.id , 'PROCESS')} />
          </div>
          <Button className="h-14 bg-[#800020] text-white rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#800020]/20 hover:scale-[1.02]">
             <Plus size={18} className="mr-2" /> Novo Processo
          </Button>
        </div>
      </header>

      {
        !selectedEntity ? (
          <>
            {/* 1. PORTAIS (Acesso Rápido com ícone externo) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {externalLinks.map((link, i) => (
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  key={i} 
                  className="group flex items-center justify-between p-5 bg-gray-50 dark:bg-[#0f0f0f] border border-gray-100 dark:border-white/5 rounded-2xl transition-all hover:border-[#d4af37]/50 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <Globe size={16} className="text-gray-400 group-hover:text-[#d4af37] transition-colors" />
                    <span className="text-[10px] font-black text-gray-800 dark:text-white uppercase tracking-tighter italic">{link.name}</span>
                  </div>
                  <ExternalLink size={12} className="text-gray-300 group-hover:text-[#d4af37] transition-colors" />
                </a>
              ))}
            </div>

            {/* 2. KPIs PRINCIPAIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Clientes', value: data?.kpis?.clients ?? 0, icon: Users, color: '#800020' },
                { label: 'Em Andamento', value: data?.kpis?.active ?? 0, icon: Briefcase, color: '#d4af37' },
                { label: 'Lucro do Mês', value: formatCurrency(currentProfit), icon: TrendingUp, color: '#800020' },
                { 
                  label: 'Saldo em Caixa', 
                  value: formatCurrency(data?.kpis?.balance ?? 0), 
                  icon: Wallet, 
                  color: '#10b981',
                  isBalance: true 
                },
                { label: 'Documentos Pendentes', value: String(data?.pendingDocuments ?? 0), icon: AlertCircle, color: '#ef4444' },
                // { label: 'Alertas Críticos', value: String(data?.kpis?.alerts ?? 0).padStart(2, '0'), icon: AlertCircle, color: '#ef4444' },
              ].map((kpi, i) => (
                <div 
                  key={i} 
                  className="bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-white/5 p-6 rounded-3xl group relative overflow-visible transition-all hover:shadow-lg"
                >
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 relative z-10">{kpi.label}</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter relative z-10">{kpi.value}</p>
                  <kpi.icon className="absolute -right-2 -bottom-2 opacity-[0.05] group-hover:scale-110 transition-transform duration-500" size={80} color={kpi.color} />

                  {/* TOOLTIP CUSTOMIZADO (Apenas para Saldo) */}
                  {kpi.isBalance && data?.kpis?.bankDetails?.length > 0 && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                      <p className="text-[9px] font-black text-[#800020] uppercase mb-3 tracking-widest border-b border-gray-50 dark:border-white/5 pb-2">
                        Detalhamento Bancário
                      </p>
                      <div className="space-y-2">
                        {data.kpis.bankDetails.map((bank: any) => (
                          <div key={bank.id} className="flex justify-between items-center gap-2">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-gray-800 dark:text-white uppercase leading-tight">
                                {bank.bank?.name}
                              </span>
                              <span className="text-[7px] text-gray-400 font-bold uppercase tracking-tighter">
                                CONTA: {bank.account}
                              </span>
                            </div>
                            <span className="text-[10px] font-black text-[#10b981]">
                              {formatCurrency(bank.balance)}
                            </span>
                          </div>
                        ))}
                      </div>
                      {/* Triângulo do Tooltip */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-[#1a1a1a]"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* COLUNA ESQUERDA */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* ANÁLISE DE OPERAÇÕES */}
                <div className="p-10 bg-gray-50 dark:bg-[#0f0f0f] border border-gray-100 dark:border-white/5 rounded-[3rem] space-y-8">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                        <Zap size={18} />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Status da Operação</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {data?.bottlenecks?.map((item: any, i: number) => (
                        <div key={i} className="space-y-3 p-5 bg-white dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                            <div className="flex justify-between items-end">
                              <p className="text-[10px] font-black text-gray-500 uppercase italic">
                                {statusConfig[item.status]?.label || item.status}
                              </p>
                              <span className="text-xl font-black text-gray-900 dark:text-white italic">{item.count}</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full ${statusConfig[item.status]?.color || 'bg-gray-400'} rounded-full transition-all duration-1000`} 
                                    style={{ width: `${Math.min((item.count / (data.kpis.active || 1)) * 100, 100)}%` }} />
                            </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* FLUXO RECENTE */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Últimas Movimentações</h3>
                  <div className="grid grid-cols-1 gap-3">
                      {data?.recentActivities?.map((proc: any) => (
                        <div key={proc.id} className="flex items-center justify-between p-6 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-3xl hover:shadow-md transition-all group cursor-pointer">
                            <div className="flex items-center gap-5">
                              <div className={`w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/5 ${proc.status === 'COMPLETED' ? 'text-green-500' : 'text-[#800020]'}`}>
                                  {proc.status === 'COMPLETED' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                              </div>
                              <div>
                                  <p className="text-[11px] font-black text-gray-800 dark:text-white uppercase italic tracking-tight">
                                    Placa: {proc.plate}
                                  </p>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                                    {proc.clientName || proc.client?.name} • <span className="text-[#800020]">{formatCurrency(Number(proc.totalProfit))} Lucro</span>
                                  </p>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-gray-200 group-hover:text-[#800020] transition-all" />
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* COLUNA DIREITA */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* ALERTA DE VENCIMENTOS (Refatorado com Degradê) */}
                <div className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-[#0f0f0f] dark:to-[#0a0a0a] border border-gray-100 dark:border-white/5 rounded-[3rem] relative overflow-hidden group shadow-sm">
                  <Clock className="absolute -right-4 -top-4 opacity-[0.05] group-hover:rotate-12 transition-transform duration-700 text-[#800020]" size={120} />
                  <h4 className="text-[10px] font-black text-[#800020] dark:text-[#d4af37] uppercase tracking-[0.4em] mb-8 italic relative z-10">Alerta de Vencimentos</h4>
                  <div className="space-y-6 relative z-10">
                      {data?.upcomingDeadlines?.map((deadline: any, i: number) => (
                        <div 
                          key={i} 
                          onClick={(e) => { e.stopPropagation(); selectEntity(deadline.id , 'PROCESS')}}
                          className="flex flex-col gap-1 border-l-4 border-gray-200 dark:border-white/5 pl-4 hover:border-[#800020] transition-colors cursor-pointer"
                        >
                            <p className="text-[11px] font-black uppercase italic leading-none text-gray-800 dark:text-white/90">{deadline.task}</p>
                            <p className={`text-[8px] font-black uppercase tracking-widest ${deadline.isUrgent ? 'text-red-600 animate-pulse' : 'text-gray-400'}`}>
                              {deadline.isUrgent ? 'URGENTE: ' : 'VENCE EM: '} 
                              {new Date(deadline.expirationDate).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                      ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-8 h-10 border border-gray-200 dark:border-white/10 text-gray-400 text-[8px] font-black uppercase tracking-widest hover:text-[#800020] hover:bg-white dark:hover:bg-white/5">
                      Ver Agenda Completa
                  </Button>
                </div>

                {/* META DE PERFORMANCE */}
                <div className="p-10 bg-[#800020] rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-[#800020]/20">
                  <Target className="absolute -right-6 -bottom-6 text-black/10" size={160} />
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-2">Meta Mensal (Lucro)</p>
                  <h3 className="text-5xl font-black italic tracking-tighter mb-2">{Math.round(profitPercentage)}%</h3>
                  
                  <div className="space-y-4 mb-8">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#d4af37] rounded-full transition-all duration-1000" style={{ width: `${profitPercentage}%` }} />
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/60">Faltam: {formatCurrency(remainingToGoal)}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-[#d4af37]">Meta: {formatCurrency(PROFIT_GOAL)}</p>
                      </div>
                  </div>
                </div>

                {/* INSIGHTS FINANCEIROS */}
                <div className="p-8 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[3rem] space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                      <Zap size={16} className="text-[#d4af37]" />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Visão de Negócio</span>
                  </div>
                  <div className="p-5 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Ticket Médio (Lucro)</p>
                      <p className="text-xl font-black text-gray-900 dark:text-white italic">
                        {formatCurrency((data?.kpis?.profit ?? 0) / (data?.recentActivities?.length || 1))}
                      </p>
                  </div>
                </div>

              </div>
            </div>
          </>
        ) : (
          <ProcessDetailView 
            entity={selectedEntity}
            type={selectedEntity?.type || 'PROCESS'}
            onBack={() => selectEntity(null, 'CLIENT')} 
          />
        )
      }
    </div>
  );
}