'use client'
import React from 'react';
import { 
  Receipt, TrendingUp, 
  ArrowUpRight, FileText, 
  Wallet, Tag, Hash,
  Layers,
  BarChart3,
  Edit3
} from 'lucide-react';
import { Button } from '../Button';
import { DrawerWrapper } from '@/components/drawer/DrawerWrapper';
import { ServiceEntity } from '@/domain/entities/service.entity';

interface ServiceDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceEntity | null;
}

export function ServiceDetailsDrawer({ isOpen, onClose, service }: ServiceDetailsDrawerProps) {
  if (!service) return null;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Cálculo de margem para o indicador visual
  const margin = Math.round((Number(service.profit) / Number(service.finalValue)) * 100);

  const documents = service?.requiredDocuments?.split(',');

  return (
    <DrawerWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-4 py-2">
           <div className="p-3 bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/5 text-[#800020]">
              <Receipt size={24} strokeWidth={2.5} />
           </div>
           <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">
                {service.name}
              </h2>
              <div className="flex items-center gap-2 mt-1.5">
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Registro do serviço</p>
                 <span className="w-1 h-1 rounded-full bg-[#d4af37]" />
                 <p className="text-[9px] font-black text-[#d4af37] uppercase tracking-widest">#{service.id?.slice(-6).toUpperCase()}</p>
              </div>
           </div>
        </div>
      }
      maxWidth="max-w-[500px]"
      footer={
        <div className="flex w-full gap-3 p-4 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5">
          <Button variant="ghost" className="flex-1 h-12 font-black uppercase text-[10px] tracking-widest text-gray-400">
             Excluir
          </Button>
          <Button className="flex-[2] h-12 bg-[#800020] text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-[#800020]/20">
             <Edit3 size={16} className="mr-2" /> Editar Configurações
          </Button>
        </div>
      }
    >
      <div className="space-y-10 py-2 px-2">

        {/* HEADER FINANCEIRO: O EXTRATO */}
        <div className="space-y-6">
           <div className="flex justify-between items-end">
              <div className="space-y-1">
                 <span className="text-[10px] font-black text-[#800020] uppercase tracking-[0.3em]">Total da Operação</span>
                 <p className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic">
                    {formatCurrency(Number(service.finalValue))}
                 </p>
              </div>
              <div className={`mb-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 bg-green-50 border-green-100 text-green-600`}>
                 Ativo
              </div>
           </div>

           {/* BREAKDOWN DE VALORES (A TABELA) */}
           <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-white/5 border-y border-gray-100 dark:border-white/5">
              <div className="py-5 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-400">
                       <Wallet size={16} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Custo Base (Taxas)</span>
                 </div>
                 <span className="text-sm font-mono font-bold text-gray-700 dark:text-gray-300">
                    - {formatCurrency(Number(service.baseValue))}
                 </span>
              </div>

              <div className="py-5 flex justify-between items-center bg-gray-50/30 dark:bg-white/[0.01] px-2 -mx-2">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#800020]/10 rounded-lg text-[#800020]">
                       <TrendingUp size={16} />
                    </div>
                    <span className="text-[11px] font-black text-[#800020] uppercase tracking-wide">Lucro Realizado</span>
                 </div>
                 <div className="text-right">
                    <span className="text-base font-black text-[#800020] italic">
                       + {formatCurrency(Number(service.profit))}
                    </span>
                    <p className="text-[9px] font-bold text-[#d4af37] uppercase tracking-tighter leading-none mt-1">
                       Margem de {margin}%
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* METADADOS DO SERVIÇO */}
        <div className="grid grid-cols-2 gap-8">
           <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400">
                 <Tag size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Origem</span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5">
                 <p className="text-[11px] font-bold text-gray-800 dark:text-white uppercase leading-tight italic truncate">
                    Processo #{service.id?.slice(-8).toUpperCase()}
                 </p>
              </div>
           </div>

           <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400">
                 <Hash size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Referência</span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5">
                 <p className="text-[11px] font-bold text-gray-800 dark:text-white uppercase leading-tight italic">
                    {/* Internal_ID_{service.id?.slice(-4)} */}
                    {service.id}
                 </p>
              </div>
           </div>
        </div>

        {/* SEÇÃO DE DOCUMENTOS (LISTA MINIMALISTA) */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Documentos do Item</span>
              <span className="text-[10px] font-bold text-[#800020]">{documents?.length || 0} arquivos</span>
           </div>
           
           <div className="space-y-2">
              {documents?.map((doc: string) => (
                 <div key={doc} className="group flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-[#800020]/30 transition-all">
                    <div className="flex items-center gap-3">
                       <FileText size={18} className="text-gray-300 group-hover:text-[#800020]" />
                       <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tight">{doc}</span>
                    </div>
                    <ArrowUpRight size={14} className="text-gray-200 group-hover:text-[#800020]" />
                 </div>
              ))}
              {(!documents || documents.length === 0) && (
                 <div className="p-10 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[2rem] text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sem anexos vinculados</p>
                 </div>
              )}
           </div>
        </div>

        {/* MÉTRICAS DE DESEMPENHO DO SERVIÇO */}
        <div className="grid grid-cols-2 gap-4">
           <div className="p-5 border border-gray-100 dark:border-white/5 rounded-2xl flex flex-col gap-3 group hover:border-[#800020]/20 transition-all">
              <div className="flex justify-between items-start">
                 <Layers size={18} className="text-gray-300" />
                 <ArrowUpRight size={14} className="text-gray-200 group-hover:text-[#800020]" />
              </div>
              <div>
                 <p className="text-xl font-black text-gray-900 dark:text-white italic leading-none">
                    {0}
                 </p>
                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Volume de Vendas</p>
              </div>
           </div>

           <div className="p-5 border border-gray-100 dark:border-white/5 rounded-2xl flex flex-col gap-3 group hover:border-[#d4af37]/20 transition-all">
              <div className="flex justify-between items-start">
                 <BarChart3 size={18} className="text-gray-300" />
                 <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              </div>
              <div>
                 <p className="text-xl font-black text-[#d4af37] italic leading-none">
                    {formatCurrency((0) * Number(service.profit))}
                 </p>
                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Rentabilidade Total</p>
              </div>
           </div>
        </div>

      </div>
    </DrawerWrapper>
  );
}