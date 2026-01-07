'use client'
import { ArrowLeft, Car, User, FileText, CheckCircle2, Clock, ShieldCheck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import ProcessDrawer from '../process/ProcessDrawer';
import { useState, useEffect } from 'react';
import { ProcessTimeline } from '../process/ProcessTimeline';
import { useUpdateProcessStore } from '@/store/process/update_process_store';
import { Process } from '@prisma/client';
// import { useProcessDetailStore } from '@/store/useProcessDetailStore';

export function ProcessDetailView({ entity, type, onBack }: { entity: Process, type: 'PROCESS' | 'CLIENT', onBack: () => void }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { setFormData, formData } = useUpdateProcessStore();

  // Sincroniza a store com a entidade recebida via props
  useEffect(() => {
    if (entity) setFormData(entity);
  }, [entity.status, entity.createdAt, setFormData]);

  const isProcess = type === 'PROCESS';

  // Cálculos baseados no formData da Store (para refletir mudanças do Drawer)
  const totalServices = formData.services?.reduce((acc, s) => acc + (Number(s.baseValue) || 0), 0) || 0;
  const totalProfit = Number(entity.totalProfit) || 0;
  const grandTotal = totalServices + totalProfit;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* 1. TOP BAR: AÇÕES E VOLTAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#800020] transition-colors"
        >
          <ArrowLeft size={12} /> Voltar ao Painel Geral
        </button>
      </div>

      {/* 2. HEADER CARD (INFO PRINCIPAL) */}
      <div className="bg-white dark:bg-white/[0.02] p-8 rounded-[3rem] border border-gray-100 dark:border-white/5 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-gray-50 dark:bg-[#1a1a1a] rounded-[2.5rem] flex items-center justify-center shadow-inner text-[#800020] border border-gray-100 dark:border-white/5 shrink-0">
            {isProcess ? <Car size={48} strokeWidth={1.5} /> : <User size={48} strokeWidth={1.5} />}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
              <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.4em]">
                {isProcess ? `Processo #${entity.id.slice(-4)}` : 'Perfil do Cliente'}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${entity.status === 'EM_EXIGENCIA' ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500/10 text-emerald-600'}`}>
                {entity.status?.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-6xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none mb-3">
              {isProcess ? entity.plate : entity.name}
            </h2>
            {isProcess && (
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
                <ShieldCheck size={14} className="text-[#800020]" /> {entity.brandModel || 'Modelo não especificado'} • {entity.renavam || 'Sem Renavam'}
              </p>
            )}
          </div>
          <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none rounded-2xl border-gray-200 dark:border-white/10 text-[9px] font-black uppercase tracking-widest h-11 px-6">
            Imprimir Guia
          </Button>
          <Button 
            onClick={() => setDrawerOpen(true)}
            className="flex-1 md:flex-none bg-[#800020] hover:bg-[#600018] text-white rounded-2xl px-8 text-[9px] font-black uppercase tracking-widest h-11 shadow-lg shadow-[#800020]/20 transition-all hover:scale-105"
          >
            Editar Processo
          </Button>
        </div>
        </div>
      </div>

      {/* 3. GRID DE CONTEÚDO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: TIMELINE (OCUPA MAIS ESPAÇO) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-8 md:p-12 bg-white dark:bg-[#0f0f0f] rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
                  <Clock size={18} className="text-amber-600" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] dark:text-gray-300">Acompanhamento de Fluxo</span>
              </div>
            </div>
            
            <ProcessTimeline process={entity} limit={5} />
          </div>
        </div>

        {/* COLUNA DIREITA: FINANCEIRO E QUICK INFO */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* CARD FINANCEIRO ESTILIZADO */}
          <div className="p-8 bg-[#800020] rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-[#800020]/30 group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <CreditCard size={120} />
            </div>
            
            <div className="relative z-10">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Faturamento do Processo</span>
              <div className="h-px bg-white/10 my-6" />
              
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase opacity-60">Nossos Honorários</span>
                  <span className="text-[15px] font-black italic text-[#d4af37]">
                    R$ {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase opacity-60">Taxas de Terceiros</span>
                  <span className="text-[15px] font-black italic">
                    R$ {totalServices.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="pt-4">
                  <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[2rem] border border-white/20 shadow-inner">
                    <span className="text-[10px] font-black uppercase block mb-1 text-white/60">Investimento Total</span>
                    <div className="flex justify-between items-end">
                      <span className="text-3xl font-black italic tracking-tighter text-[#d4af37]">
                        R$ {grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK INFO (CHECKLIST) */}
          <div className="p-8 bg-gray-50 dark:bg-white/[0.02] rounded-[3rem] border border-gray-100 dark:border-white/5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2 text-gray-500">
              <CheckCircle2 size={16} className="text-emerald-500" /> Resumo de Ativos
            </h4>
            <div className="space-y-5">
               <QuickInfo label="Placa Veicular" value={entity.plate} />
               <QuickInfo 
                  label="Pasta de Documentos" 
                  value={`${entity.documents?.filter((d:any)=>d.isUploaded).length || 0} de ${entity.documents?.length || 0}`} 
                  status={entity.documents?.every((d:any)=>d.isUploaded) ? 'success' : 'warning'}
               />
               <QuickInfo 
                  label="Quitação Financeira" 
                  value={`${entity.services?.filter((t:any)=>t.isPaid).length || 0} de ${entity.services?.length || 0}`} 
                  status={entity.services?.every((s:any)=>s.isPaid) ? 'success' : 'warning'}
               />
            </div>
          </div>
        </div>
      </div>

      <ProcessDrawer
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        process={entity}
      />
    </div>
  );
}

function QuickInfo({ label, value, status }: { label: string, value: string, status?: 'success' | 'warning' }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-200/50 dark:border-white/5 pb-3">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{label}</span>
      <span className={`text-[11px] font-black uppercase italic ${
        status === 'success' ? 'text-emerald-500' : 
        status === 'warning' ? 'text-amber-500' : 'dark:text-white text-gray-900'
      }`}>
        {value}
      </span>
    </div>
  );
}