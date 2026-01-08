'use client'
import { useState } from 'react';
import { 
  User, FileText, 
  DollarSign, CheckCircle2, AlertCircle,
  TrendingUp, ClipboardCheck, Clock, Printer, ArrowRight,
  ReceiptText,
  Plus
} from 'lucide-react';
import { PlatePreview } from '../PlatePreview';
import { FinanceModal } from '../modals/FinanceModal';
import { PaymentModal } from '../modals/PaymentModal';
import { TaxesModal } from '../modals/TaxesModal';
import { Button } from '../Button';
import { motion } from 'framer-motion';
import { DrawerWrapper } from '@/components/drawer/DrawerWrapper';
import { ProcessTimeline } from './ProcessTimeline';
import { ProcessEntity } from '@/domain/entities/process.entity';
import { Status } from '@prisma/client';

interface ProcessDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  process: ProcessEntity | null;
}

export default function ProcessDrawer({ isOpen, onClose, process }: ProcessDrawerProps) {
  
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTaxesModalOpen, setIsTaxesModalOpen] = useState(false);

  if (!isOpen || !process) return null;

  const costsValue = process.services?.reduce((acc: number, service) => acc + Number(service.baseValue), 0);
  const hasTax = process.services?.map((s) => s.isPaid !== true).some((s) => s);

  return (
    <>
      {/* ESTILO PARA MATAR O RESTO DA PÁGINA NO PRINT */}
      <style jsx global>{`
        @media print {
          /* Esconde TUDO da página */
          body * { visibility: hidden; }
          /* Mostra apenas a div do recibo e o que estiver dentro dela */
          .print-area, .print-area * { visibility: visible; }
          /* Posiciona o recibo no topo da folha */
          .print-area { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%;
            background: white !important;
          }
          /* Remove backgrounds escuros do dark mode no papel */
          .print-area { color: black !important; }
        }
      `}</style>

      {/* -------------------------------------------------------------------------
          AREA DO RECIBO (VERSÃO TURBINADA PARA IMPRESSÃO)
      ------------------------------------------------------------------------- */}
      <div className="hidden print:block print-area p-10 bg-white">
        <div className="border-[3px] border-black p-8 min-h-[850px] flex flex-col justify-between">
          
          <div>
            {/* Cabeçalho da Empresa / Identificação */}
            <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
              <div className="space-y-1">
                <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">NOME DA SUA EMPRESA</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em]">Despachante e Regularização Veicular</p>
                <div className="text-[9px] font-medium space-y-0.5 pt-2">
                  <p>CNPJ: 00.000.000/0001-00</p>
                  <p>Telefone: (11) 99999-9999 / (11) 4444-4444</p>
                  <p>E-mail: contato@suaempresa.com.br</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-black text-white px-3 py-1 mb-2 inline-block">
                  <p className="text-[10px] font-black uppercase tracking-widest">Recibo de Protocolo</p>
                </div>
                <p className="text-[10px] font-black uppercase block">Data/Hora Emissão</p>
                <p className="text-sm font-bold">{new Date().toLocaleDateString('pt-BR')} - {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>

            {/* Identificação do Processo (ID COMPLETO) */}
            <div className="bg-gray-100 p-2 mb-8 border-l-4 border-black">
              <p className="text-[9px] font-black uppercase text-gray-600">ID Único do Processo (Sistema):</p>
              <p className="text-xs font-mono font-bold">{process.id}</p>
            </div>

            {/* Grid de Informações Principais */}
            <div className="grid grid-cols-2 gap-12 mb-10">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Dados do Cliente</p>
                  <p className="text-xl font-black uppercase leading-tight border-b-2 border-black pb-1">
                    {process.client?.name || process.clientName}
                  </p>
                  <p className="text-[11px] font-bold mt-2">CPF/CNPJ: <span className="font-normal font-mono">{process.client?.document || '---'}</span></p>
                  <p className="text-[11px] font-bold">Telefone: <span className="font-normal font-mono">{process.client?.phone || '---'}</span></p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Identificação do Veículo</p>
                  <div className="border-2 border-black p-2 inline-block mb-2">
                    <p className="text-3xl font-black tracking-tighter">{process.plate.toUpperCase()}</p>
                  </div>
                  <p className="text-[11px] font-bold">RENAVAM: <span className="font-normal font-mono">{process.renavam || '---'}</span></p>
                  <p className="text-[11px] font-bold">Status: <span className="font-normal uppercase italic">{process.status}</span></p>
                </div>
              </div>
            </div>

            {/* Checklist de Documentos */}
            <div className="mb-10">
              <p className="text-[10px] font-black uppercase border-b-2 border-black mb-4 flex justify-between">
                <span>Relação de Documentos Entregues / Conferidos</span>
                <span className="text-[8px] italic">* Itens marcados com (X) foram recebidos</span>
              </p>
              <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                {process.documents?.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 text-[12px] border-b border-gray-200 pb-1">
                    <div className="w-5 h-5 border-2 border-black flex items-center justify-center text-[12px] font-black shrink-0">
                        {doc.isUploaded ? "X" : ""}
                    </div>
                    <span className={doc.isUploaded ? 'font-bold uppercase' : 'text-gray-400 italic'}>
                      {doc.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seção Financeira */}
            <div className="border-2 border-black p-4 flex justify-between items-center bg-gray-50">
              <div>
                <p className="text-[10px] font-black uppercase leading-none">Total dos Serviços Prestados</p>
                <p className="text-[8px] uppercase text-gray-500">Sujeito a alterações em caso de novas taxas</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black italic tabular-nums">R$ {Number(process.totalValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>

          {/* Rodapé e Assinaturas */}
          <div className="space-y-12">
            <div className="grid grid-cols-2 gap-20 text-center">
              <div className="space-y-2">
                <div className="border-t-2 border-black pt-2">
                  <p className="text-[10px] font-black uppercase">Responsável: {process.user?.name || 'Administração'}</p>
                  <p className="text-[8px] text-gray-500 uppercase">Assinatura / Carimbo</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="border-t-2 border-black pt-2">
                  <p className="text-[10px] font-black uppercase leading-none">{process.client?.name || process.clientName}</p>
                  <p className="text-[8px] text-gray-500 uppercase">Assinatura do Cliente</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-dotted border-gray-400 pt-4">
              <p className="text-[8px] text-center text-gray-500 uppercase leading-relaxed">
                Este recibo é um documento de controle interno. A conclusão do processo depende da aprovação dos órgãos competentes.<br/>
                Obrigado pela preferência.
              </p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300" onClick={onClose} />
      
      <DrawerWrapper
        isOpen={isOpen}
        onClose={onClose}
        title="Detalhes do Processo"
        subtitle="Informações Estruturadas"
        icon={<ClipboardCheck size={18} className="text-[#800020]" />}
        maxWidth="max-w-[500px]"
        createdAt={process.createdAt}
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => window.print()} 
              variant='outline'
              className="flex items-center justify-center gap-2 text-[10px] font-black uppercase transition-all"
            >
              <Printer size={16} /> Imprimir Recibo
            </Button>
            <Button className="flex items-center justify-center gap-2 px-4 py-3 bg-[#800020] text-white text-[10px] font-black uppercase rounded-2xl hover:bg-[#600018] shadow-lg shadow-[#800020]/20 transition-all">
              Editar Processo
            </Button>
          </div>
        }
      >
        {/* SEÇÃO 1: PLACA (PLATE PREVIEW) E STATUS */}
        <div className="space-y-8">
          <div className="flex items-center justify-between gap-6 bg-gray-50 dark:bg-white/[0.03] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
            <div className="flex flex-col gap-3 z-10">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identificação</span>
              {/* Reemplaçando a placa manual pela sua PlatePreview */}
              <div className="scale-110 origin-left">
                <PlatePreview plate={process.plate} />
              </div>
            </div>

            <div className="text-right z-10">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Status Atual</span>
              <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase border shadow-sm ${
                process.status === Status.CONCLUIDO 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {process.status}
              </span>
            </div>
          </div>

          {/* SEÇÃO 2: DADOS DO CLIENTE */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-[#800020] uppercase tracking-[0.2em] flex items-center gap-2">
              <User size={16} /> Dados do Cliente
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 group hover:border-[#800020]/30 transition-colors">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Nome Completo</p>
                <p className="text-md font-black text-gray-800 dark:text-white uppercase tracking-tight">
                  {process.client?.name || process.clientName}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Documento</p>
                    <p className="text-xs font-bold dark:text-gray-300">{process.client?.document || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-gray-400 uppercase">ID Sistema</p>
                    <p className="text-xs font-mono dark:text-gray-400">#{process.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEÇÃO FINANCEIRA: SLIM & PREMIUM */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-[#800020] uppercase tracking-widest flex items-center gap-2">
              <DollarSign size={16} /> Controle de Caixa
            </h4>

            <div className="space-y-3">
              {/* HUB DE RECEBIMENTO (CARD PRINCIPAL) */}
              <div className="bg-gray-50 dark:bg-white/[0.03] rounded-[32px] p-6 border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Valor Total do Processo</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white tabular-nums tracking-tighter">
                      R$ {Number(process.totalValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Recebido</p>
                    <p className="text-lg font-black text-emerald-600 tabular-nums">
                      R$ {Number(process.paidValue).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Barra de Progresso e Botões em uma linha só para salvar espaço */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((Number(process.paidValue) / Number(process.totalValue)) * 100, 100)}%` }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
                      <span className="text-gray-400 italic">Quitação</span>
                      <span className="text-emerald-600">{Math.min(Math.round((Number(process.paidValue) / Number(process.totalValue)) * 100), 100)}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => setIsPaymentModalOpen(true)}
                      disabled={process.totalValue === process.paidValue}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] h-9 rounded-xl shadow-md shadow-emerald-600/10"
                    >
                      <Plus size={14} className="mr-1.5" /> Receber
                    </Button>
                    <Button 
                      onClick={() => setIsTaxesModalOpen(true)}
                      disabled={!hasTax}
                      variant="ghost"
                      className="border border-gray-200 dark:border-gray-700 font-black uppercase text-[10px] h-9 rounded-xl"
                    >
                      <ReceiptText size={14} className="mr-1.5" /> Taxas
                    </Button>
                  </div>
                </div>
              </div>

              {/* CARDS RETANGULARES SLIM (LUCRO E CUSTO) */}
              <div className="grid grid-cols-2 gap-6 px-2">
                {/* Bloco de Lucro Slim */}
                <div className="py-3 px-4 rounded-2xl bg-[#800020]/5 border border-[#800020]/10 flex items-center gap-6 relative overflow-hidden">
                  <div className="p-2 bg-[#800020]/10 rounded-lg shrink-0">
                    <TrendingUp size={16} className="text-[#800020]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-[#800020] uppercase leading-none mb-1">Lucro Real</p>
                    <p className="text-sm font-black text-[#800020] dark:text-red-400 tabular-nums leading-none tracking-tight">
                      R$ {Number(process.totalProfit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Bloco de Custos Slim */}
                <div className="py-3 px-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-center gap-6 relative overflow-hidden">
                  <div className="p-2 bg-orange-500/10 rounded-lg shrink-0">
                    <AlertCircle size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-orange-600 uppercase leading-none mb-1">Custos Totais</p>
                    <p className="text-sm font-black text-orange-700 dark:text-orange-400 tabular-nums leading-none tracking-tight">
                      R$ {Number(costsValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEÇÃO NOVA: HISTÓRICO DE ATUALIZAÇÕES */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-[#800020] uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} /> Histórico Recente
            </h4>
            {/* <ProcessTimeline events={events} /> */}
            <ProcessTimeline limit={5} />
          </div>

          {/* SEÇÃO 4: DOCUMENTOS DO CHECKLIST */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-black text-[#800020] uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} /> Documentação Entregue
              </h4>
              <span className="text-[10px] font-black px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded text-gray-500 uppercase">
                {process.documents?.length || 0} Itens
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {process.documents?.map((doc) => (
                <div key={doc.id} className="group/doc flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 hover:border-[#800020]/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={doc.isUploaded ? 'text-emerald-500' : 'text-amber-500'}>
                      {doc.isUploaded ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    </div>
                    <span className={`text-[11px] font-black uppercase ${doc.isUploaded ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'}`}>
                      {doc.name}
                    </span>
                  </div>
                  <div className="opacity-0 group-hover/doc:opacity-100 transition-opacity">
                    <ArrowRight size={14} className="text-[#800020]" />
                  </div>
                </div>
              ))}
            </div>
            {/* <div className="flex items-center justify-between text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  Criado em: {new Date(process.createdAt).toLocaleDateString('pt-BR')} às {new Date(process.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div> */}
          </div>
        </div>
        
        {/* Modais auxiliares continuam aqui no final */}
        <FinanceModal isOpen={isFinanceModalOpen} onClose={() => setIsFinanceModalOpen(false)} process={process} />
        <TaxesModal isOpen={isTaxesModalOpen} onClose={() => setIsTaxesModalOpen(false)} process={process} onSave={() => setIsTaxesModalOpen(false)} />
        <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} process={process} onSave={() => setIsPaymentModalOpen(false)} />
      </DrawerWrapper>
    </>
  );
}