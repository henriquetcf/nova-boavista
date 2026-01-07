// components/process/ProcessTimeline.tsx
'use client'
import { CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp, ArrowRight, FileText, DollarSign, Search, Clock10 } from 'lucide-react';
import { useState, useMemo, useTransition } from 'react';
import { Button } from '../Button';
import { useUpdateProcessStore } from '@/store/process/update_process_store';
import { Status } from '@prisma/client';
import { useRouter } from 'next/navigation';

// 1. Interfaces para Tipagem Estrita
interface ProcessDocument {
  isUploaded: boolean;
}

interface ProcessService {
  type: 'TAXA' | 'HONORARIO'; // ajuste conforme seu DB
  isPaid: boolean;
}

interface ProcessMovement {
  id: string;
  status: string;
  description?: string;
  createdAt: string | Date;
}

interface ProcessTimelineProps {
  // process: {
  //   id: string;
  //   status: string;
  //   documents?: ProcessDocument[];
  //   services?: ProcessService[];
  //   movements?: ProcessMovement[];
  // };
  limit?: number;
}

interface FlowRule {
  condition: boolean;
  nextStatus: Status;
  buttonLabel?: string;
  generateLog: (reason?: string) => string;
  message: string;
}

export function ProcessTimeline({ limit }: ProcessTimelineProps) {
  const [expanded, setExpanded] = useState(false);

  const { formData: process, isLoading, updateStatus, setField } = useUpdateProcessStore();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isWorking = isPending || isLoading;
  
  // Memoizar cálculos para evitar re-render desnecessário
  const stats = useMemo(() => {
    const docs = process.documents || [];
    const services = process.services || [];
    
    return {
      docsUploaded: docs.filter(d => d.isUploaded).length,
      docsTotal: docs.length,
      taxasPaid: services.filter(s => s.isPaid).length,
      taxasTotal: services?.length,
    };
  }, [process.documents, process.services]);

  if (!process || !process.status) return null;

  // 2. Configuração de Regras com Validação de Exibição
  const FLOW_RULES: Record<string, FlowRule> = {
    PENDENTE: {
      condition: stats.docsUploaded >= stats.docsTotal && stats.docsTotal > 0,
      nextStatus: Status.AGUARDANDO_PAGAMENTO,
      buttonLabel: 'Solicitar Pagamento',
      message: stats.docsUploaded < stats.docsTotal 
        ? `Faltam ${stats.docsTotal - stats.docsUploaded} documentos.` 
        : 'Documentos entregues! Peça o pagamento.',
      generateLog: () => `Documentação completa (${stats.docsUploaded}/${stats.docsTotal}). Processo enviado para cobrança.`
    },

    AGUARDANDO_PAGAMENTO: {
      condition: stats.taxasPaid >= stats.taxasTotal && stats.taxasTotal > 0,
      nextStatus: Status.AGUARDANDO_EMISSAO,
      buttonLabel: 'Iniciar Emissão',
      message: stats.taxasPaid < stats.taxasTotal 
        ? `Faltam ${stats.taxasTotal - stats.taxasPaid} taxas.` 
        : 'Taxas pagas! Pode emitir.',
      generateLog: () => `Financeiro aprovado. ${stats.taxasPaid} taxas liquidadas. Enviado para emissão no órgão.`
    },

    AGUARDANDO_EMISSAO: {
      condition: true,
      nextStatus: Status.PRONTO_ENTREGA,
      buttonLabel: 'Marcar como Pronto',
      message: 'Aguardando retorno do órgão.',
      generateLog: () => `Documento emitido com sucesso pelo órgão responsável. Aguardando retirada.`
    },

    PRONTO_ENTREGA: {
      condition: true,
      nextStatus: Status.CONCLUIDO,
      buttonLabel: 'Finalizar Processo',
      message: 'Documento disponível para o cliente.',
      generateLog: () => `Processo finalizado. Documento entregue ao cliente e arquivado.`
    },

    EM_EXIGENCIA: {
      condition: true,
      nextStatus: Status.AGUARDANDO_EMISSAO,
      buttonLabel: 'Reenviar p/ Análise',
      message: 'Corrija a pendência informada.',
      // Aqui aceita o motivo que sua mãe digitar no prompt
      generateLog: (reason?: string) => `Exigência cumprida: ${reason || 'Pendências resolvidas pelo despachante.'}`
    },

    CONCLUIDO: {
      condition: false, // Trava o botão pois é o fim da linha
      nextStatus: 'CONCLUIDO',
      message: 'Documento entregue ao cliente.',
      generateLog: () => `Processo concluído.`
    }
  };

  const statusSteps = [
    { id: 'PENDENTE', label: 'Documentação', icon: <FileText size={14}/> },
    { id: 'AGUARDANDO_PAGAMENTO', label: 'Pagamentos', icon: <DollarSign size={14}/> },
    { id: 'AGUARDANDO_EMISSAO', label: 'Análise', icon: <Search size={14}/> },
    { id: 'PRONTO_ENTREGA', label: 'Retirada', icon: <Clock10 size={14}/> },
    { id: 'CONCLUIDO', label: 'Entregue', icon: <CheckCircle2 size={14}/> },
  ];

  const currentRule = FLOW_RULES[process.status];
  const currentIdx = statusSteps.findIndex(s => s.id === process.status);
  const isExigencia = process.status === 'EM_EXIGENCIA';
  const history = process.movements || [];

  const handleNextStep = async () => {
    setField('id', process.id);
    if (!currentRule || isWorking) return;

    let finalDescription = "";

    // 1. Caso especial: EM_EXIGENCIA (pede o que foi feito)
    if (isExigencia) {
      const reason = window.prompt("O que foi feito para resolver a exigência?");
      if (reason === null) return; // Se cancelar o prompt, para a execução
      finalDescription = currentRule.generateLog(reason);
    } 
    // 2. Casos automáticos: Puxa a string dinâmica baseada nos stats
    else {
      finalDescription = currentRule.generateLog ? currentRule.generateLog() : `Alterado para ${currentRule.nextStatus}`;
    }

    startTransition(async () => {
      // 3. Chama a store
      const result = await updateStatus(currentRule.nextStatus, finalDescription);
      console.log('result', result);
      if (result.success)
        console.log('result2', result);
        router.refresh();
    });
  };

  console.log(history)

  return (
    <div className="space-y-6">
      {/* 1. MAPA HORIZONTAL */}
      <div className="bg-gray-50 dark:bg-white/[0.02] p-4 rounded-[2rem] border border-gray-100 dark:border-white/5">
        <div className="relative flex justify-between items-center px-2">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 dark:bg-white/5 -translate-y-1/2 -z-0" />
          
          {statusSteps.map((step, idx) => {
            // Um passo está "Passado" se o índice atual é maior OU se o processo está CONCLUIDO
            const isPast = (currentIdx > idx && process.status !== 'EM_EXIGENCIA') || process.status === 'CONCLUIDO';
            const isCurrent = process.status === step.id || (isExigencia && idx === 2);
            
            return (
              <div key={step.id + process.status} className="relative z-10 flex flex-col items-center gap-1.5">
                <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all
                  ${isPast ? 'bg-emerald-500 border-emerald-200 text-white' : 
                    isCurrent ? (isExigencia ? 'bg-red-500 border-red-200 text-white animate-pulse' : 'bg-[#800020] border-[#800020]/20 text-white scale-110 shadow-lg shadow-[#800020]/20') : 
                    'bg-white dark:bg-[#161616] border-gray-200 dark:border-gray-800 text-gray-400'}`}>
                  {isPast ? <CheckCircle2 size={14} /> : step.icon}
                </div>
                <span className={`text-[8px] font-black uppercase ${isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. CARDS DE CONTAGEM */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-2xl border ${stats.docsUploaded >= stats.docsTotal && stats.docsTotal > 0 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5'}`}>
          <span className="text-[9px] font-black uppercase text-gray-400 block mb-1">Documentos</span>
          <div className="flex items-end gap-1">
            <span className="text-sm font-black dark:text-white">{stats.docsUploaded}</span>
            <span className="text-[10px] text-gray-400 pb-0.5">/ {stats.docsTotal}</span>
          </div>
          <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${stats.docsTotal > 0 ? (stats.docsUploaded/stats.docsTotal)*100 : 0}%` }} />
          </div>
        </div>

        <div className={`p-3 rounded-2xl border ${stats.taxasPaid >= stats.taxasTotal && stats.taxasTotal > 0 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5'}`}>
          <span className="text-[9px] font-black uppercase text-gray-400 block mb-1">Taxas Detran</span>
          <div className="flex items-end gap-1">
            <span className="text-sm font-black dark:text-white">{stats.taxasPaid}</span>
            <span className="text-[10px] text-gray-400 pb-0.5">/ {stats.taxasTotal}</span>
          </div>
          <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
            <div className={`h-full transition-all ${stats.taxasPaid >= stats.taxasTotal ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                 style={{ width: `${stats.taxasTotal > 0 ? (stats.taxasPaid/stats.taxasTotal)*100 : 0}%` }} />
          </div>
        </div>
      </div>

      {/* 3. DIAGNÓSTICO COM LÓGICA DE BOTÃO REFINADA */}
      {process.status !== 'CONCLUIDO' && currentRule && (
        <div className={`p-4 rounded-3xl border-2 flex flex-row items-center justify-between gap-4 transition-colors
          ${isExigencia ? 'bg-red-50 border-red-200' : currentRule.condition ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-100'}`}>
          
          <div className="flex items-center gap-3 min-w-0">
            <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center shadow-sm ${isExigencia ? 'bg-red-500 text-white' : 'bg-white text-gray-400'}`}>
              {isExigencia ? <AlertCircle size={20}/> : <Clock size={20} className="text-amber-600"/>}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase text-gray-500 leading-none truncate">
                Status: {process.status.replace('_', ' ')}
              </p>
              <p className="text-[11px] font-bold text-gray-700 mt-1 leading-tight break-words">
                {currentRule.message}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {/* SÓ MOSTRA O BOTÃO SE HOUVER LABEL E A CONDIÇÃO FOR ACEITA OU SE FOR CASO ESPECIAL */}
            {currentRule.buttonLabel && (currentRule.condition || isExigencia || process.status === 'AGUARDANDO_EMISSAO' || process.status === 'PRONTO_ENTREGA') && (
              <Button 
                onClick={handleNextStep}
                // REGRAS DE BLOQUEIO:
                // 1. Se estiver carregando (isLoading)
                // 2. Se a condição da regra atual não for atingida (!currentRule.condition)
                // 3. Casos especiais: Exigência sempre permite clicar (pois a correção é manual)
                disabled={isWorking || (!currentRule.condition && !isExigencia)}
                
                className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-tight transition-all
                  ${isWorking || (!currentRule.condition && !isExigencia) 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' // Estilo desabilitado
                    : isExigencia 
                      ? 'bg-red-600 text-white animate-pulse' // Estilo Exigência (Atenção)
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 active:scale-95' // Estilo Pronto
                  }`}
              >
                {isWorking ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{currentRule.buttonLabel}</span>
                    <ArrowRight size={14} strokeWidth={3} />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 4. HISTÓRICO COMPACTO - ORDEM DESCENDENTE */}
<div className="space-y-4 pt-2">
  <div className="flex justify-between items-center px-1">
    <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest italic">
      Linha do Tempo
    </span>
    {/* Badge de contagem total se não estiver expandido */}
    {!expanded && history.length > (limit || 5) && (
      <span className="text-[8px] font-bold bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded text-gray-500">
        +{history.length - (limit || 5)} eventos
      </span>
    )}
  </div>

  <div className="space-y-6 border-l-2 border-gray-100 dark:border-white/5 ml-2 pl-4">
    {history.length > 0 ? (
      history
        // 1. ORDEM DESC (Mais novo no topo)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        // 2. LÓGICA DE LIMIT/EXPAND
        .slice(0, expanded ? history.length : (limit || 5))
        .map((move, i) => (
          <div key={move.id + process.status || i} className="relative animate-in fade-in slide-in-from-left-2">
            {/* Indicador visual de "Novo" para o primeiro item */}
            <div className={`absolute -left-[23px] top-1 h-3 w-3 rounded-full border-2 bg-white dark:bg-[#0f0f0f] 
              ${i === 0 ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-gray-300 dark:border-gray-600'}`} 
            />
            
            <div className="flex justify-between items-start gap-2">
              <p className={`text-[10px] font-black uppercase leading-none truncate ${i === 0 ? 'text-emerald-600' : 'text-gray-800 dark:text-gray-200'}`}>
                {move.status?.replace('_', ' ')}
              </p>
              
              {/* DATA E HORA FORMATADAS */}
              <div className="flex flex-col items-end shrink-0">
                <span className="text-[11px] font-bold text-gray-600 tabular-nums leading-none">
                  {new Date(move.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
                <span className="text-[10px] font-medium text-gray-400 tabular-nums">
                  {new Date(move.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            
            {/* DESCRIÇÃO - Agora permitindo quebra de linha se expandido */}
            <p className={`text-[10px] text-gray-500 mt-1 italic leading-relaxed ${expanded ? '' : 'line-clamp-1'}`}>
              {move.description || 'Sem observação registrada.'}
            </p>
          </div>
        ))
    ) : (
      <p className="text-[10px] text-gray-400 italic">Nenhuma movimentação ainda.</p>
    )}
  </div>

  {/* BOTÃO VER MAIS / MENOS */}
  {history.length > (limit || 5) && (
    <button 
      onClick={() => setExpanded(!expanded)}
      className="group w-full py-2 flex items-center justify-center gap-1.5 border border-dashed border-gray-200 dark:border-white/5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
    >
      <span className="text-[9px] font-black uppercase text-gray-400 group-hover:text-[#800020]">
        {expanded ? "Recolher Histórico" : `Ver Histórico Completo`}
      </span>
      {expanded ? <ChevronUp size={12} className="text-gray-400" /> : <ChevronDown size={12} className="text-gray-400" />}
    </button>
  )}
</div>
    </div>
  );
}