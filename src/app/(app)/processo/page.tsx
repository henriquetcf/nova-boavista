"use client"
import { useEffect, useState } from "react";
import { 
  Edit3, 
  Trash2, 
  ChevronRight, 
  Calendar, 
  Car, 
  CheckCircle2, 
  ReceiptText,
  Plus
} from "lucide-react";
import { useProcessDataStore } from "@/store/process/process_store";
import { Pagination } from "@/components/navigation/Pagination";
import { Filters } from "@/components/ui/Filters";
import { ListHeader } from "@/components/ui/header/ListHeader";
import { useLoading } from "@/components/AppLoading";
import ProcessDrawer from "@/components/ui/process/ProcessDrawer";
import { TaxesModal } from "@/components/ui/modals/TaxesModal";
import { PaymentModal } from "@/components/ui/modals/PaymentModal";
import { DeleteModal } from "@/components/ui/modals/DeleteModal";
import { Status } from "@prisma/client";


export default function ProcessList() {
  const { fetchProcesses, processes, isLoading, searchQuery, statusFilter, currentPage, itemsPerPage, setSearchQuery, setStatusFilter, setCurrentPage, toggleDocStatus } = useProcessDataStore();
  const { startLoading, stopLoading } = useLoading();

  const [selectedProcess, setSelectedProcess] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openChecklistId, setOpenChecklistId] = useState<string | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTaxesModalOpen, setIsTaxesModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
      startLoading("Sincronizando processos...");
      fetchProcesses().finally(() => stopLoading());
  }, []);

  const filteredData = processes.filter(item => {
    const matchesSearch = item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || item.plate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'TODOS' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) return <div className="h-screen" />;

  return (
    <div className="h-screen space-y-4 p-2">
      <ListHeader title="Processos" count={processes.length} buttonLabel="Novo Processo" buttonHref="/processo/novo" />

      <Filters searchValue={searchQuery} onSearchChange={setSearchQuery} activeFilter={statusFilter} onFilterChange={setStatusFilter} />

      {paginatedData.length === 0 && (
        <div className="py-20 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
          <p className="text-gray-400 font-medium uppercase text-[11px] tracking-widest">Nenhum processo encontrado.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 relative">
        {paginatedData?.map((process) => {
          // Mantendo sua lógica de documentos intacta
          const rawDocs = process.documents?.flatMap((s: any) => s) || [];
          const uniqueDocsMap = new Map();
          rawDocs.forEach((doc: any) => {
            const existing = uniqueDocsMap.get(doc.name);
            if (!existing || (!existing.isUploaded && doc.isUploaded)) uniqueDocsMap.set(doc.name, doc);
          });
          const uniqueDocs = Array.from(uniqueDocsMap.values());
          const missingDocs = uniqueDocs.filter((d: any) => !d.isUploaded);
          const progress = uniqueDocs.length > 0 ? ((uniqueDocs.length - missingDocs.length) / uniqueDocs.length) * 100 : 0;
          const serviceNames = process.services?.map((s: any) => s.name).join(" + ") || process.serviceName;

          // Lógica Financeira do Card
          const pendingAmount = Number(process.totalValue) - Number(process.paidValue || 0);
          const unpaidTaxesValue = process.services?.filter((s: any) => !s.isPaid)
            .reduce((acc: number, s: any) => acc + Number(s.baseValue), 0) || 0;

          return (
            <div 
              key={process.id} 
              onClick={() => { setSelectedProcess(process); setIsDrawerOpen(true); }}
              className={`group bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 p-3 pr-5 rounded-2xl hover:border-[#800020]/20 hover:shadow-xl transition-all duration-300 cursor-pointer relative ${openChecklistId === process.id ? 'z-50' : 'z-10'}`}
            >
              <div className="flex items-center justify-between gap-4">
                
                {/* 1. CLIENTE E VEÍCULO (Ícone + Placa Discreta) */}
                <div className="flex items-center gap-4 flex-[1.1]">
                  <div className="w-11 h-11 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center border border-gray-100 dark:border-gray-800 shrink-0">
                    <Car size={22} strokeWidth={2.2} className="text-gray-400 group-hover:text-[#800020] transition-colors" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-[14px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight truncate">
                        {process.clientName || process.client?.name}
                      </h3>
                      {/* Placa em destaque mas discreta */}
                      <span className="text-[10px] font-black bg-gray-900 text-white dark:bg-white dark:text-black px-1.5 py-0.5 rounded italic tracking-tighter shrink-0">
                        {process.plate || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-black text-[#800020] py-0.5 rounded uppercase tracking-tighter whitespace-nowrap">
                        {serviceNames}
                      </span>
                      <div className="flex items-center gap-1 text-gray-400 ml-1">
                        <Calendar size={11} />
                        <span className="text-[12px] font-bold tabular-nums">
                          {process.createdAt && new Date(process.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                </div>

                {/* 2. DOCUMENTAÇÃO (SEU CÓDIGO ORIGINAL) */}
                <div className="hidden xl:flex flex-col flex-[0.7] gap-1 px-6 border-l border-gray-50 dark:border-gray-800 relative">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      setOpenChecklistId(openChecklistId === process.id ? null : process.id);
                    }}
                    className="cursor-pointer group/docs mb-1"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover/docs:text-[#800020]">
                        Documentos {missingDocs.length > 0 ? `(${missingDocs.length} Pendentes)` : '(Entregues)'}
                      </span>
                      <span className="text-[9px] font-black text-gray-400 tabular-nums">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1 w-full bg-gray-50 dark:bg-[#222] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {uniqueDocs.map((doc: any, idx: number) => (
                      <div key={idx} className="relative group/tip">
                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${doc.isUploaded ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded uppercase whitespace-nowrap opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity z-[100]">
                          {doc.name}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CHECKLIST POP-UP (MANTIDO) */}
                  {openChecklistId === process.id && (
                    <>
                      <div className="fixed inset-0 z-[60]" onClick={(e) => { e.stopPropagation(); setOpenChecklistId(null); }} />
                      <div onClick={(e) => e.stopPropagation()} className="absolute top-[80%] left-6 w-60 bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-[70] p-4 animate-in fade-in zoom-in-95 duration-200">
                        <h4 className="text-[11px] font-black text-[#800020] uppercase mb-3 border-b pb-2">Documentos</h4>
                        <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                          {uniqueDocs.map((doc: any) => (
                            <div 
                              key={doc.id} 
                              onClick={() => toggleDocStatus(process.id, doc.name)}
                              className="flex items-center justify-between p-1.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-all group/item"
                            >
                              <span className={`text-[11px] font-bold uppercase truncate pr-2 ${doc.isUploaded ? 'text-gray-300 line-through' : 'text-gray-600 dark:text-gray-300'}`}>
                                {doc.name}
                              </span>
                              {doc.isUploaded && <CheckCircle2 size={12} className="text-emerald-500" />}
                            </div>
                          ))}
                        </div>
                        <div className="absolute -top-1 left-4 w-2 h-2 bg-white dark:bg-[#1e1e1e] border-l border-t border-gray-100 dark:border-gray-800 rotate-45" />
                      </div>
                    </>
                  )}
                </div>

                {/* 3. FINANCEIRO (ILHA DE AÇÃO) */}
                <div className="hidden lg:flex items-center gap-4 px-6 border-l border-gray-50 dark:border-gray-800">
                  {/* Recebimento */}
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase italic leading-none mb-1">Falta Receber</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[13px] font-black tabular-nums ${pendingAmount <= 0 ? 'text-gray-300' : 'text-emerald-500'}`}>
                        R$ {pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      {
                        pendingAmount > 0 && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedProcess(process); setIsPaymentModalOpen(true); }}
                            className="w-7 h-7 flex items-center justify-center bg-emerald-500/10 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white cursor-pointer transition-all"
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        )
                      }
                    </div>
                  </div>

                  {/* Taxas */}
                  <div className="flex flex-col border-l border-gray-50 dark:border-gray-800 pl-4">
                    <span className="text-[9px] font-black text-gray-400 uppercase italic leading-none mb-1">Taxas PND</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[13px] font-black tabular-nums ${unpaidTaxesValue > 0 ? 'text-orange-600' : 'text-gray-300'}`}>
                        R$ {unpaidTaxesValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      {
                        unpaidTaxesValue > 0 && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedProcess(process); setIsTaxesModalOpen(true); }}
                            className="w-7 h-7 flex items-center justify-center bg-orange-500/10 text-orange-600 rounded-lg hover:bg-orange-500 hover:text-white cursor_pointer transition-all"
                          >
                            <ReceiptText size={14} strokeWidth={3} />
                          </button>
                        )
                      }
                    </div>
                  </div>
                </div>

                {/* 4. AÇÕES FINAIS */}
                <div className="flex items-center gap-3 relative z-20">
                  <div className={`hidden sm:block px-3 py-1 rounded-full text-[9px] font-black border uppercase ${process.status === Status.CONCLUIDO ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {process.status}
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-gray-400 hover:text-[#800020] hover:bg-[#800020]/10 rounded-lg transition-all cursor-pointer active:scale-90" title="Editar">
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={(e) => {e.stopPropagation(); setIsDeleteModalOpen(true)}}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all cursor-pointer active:scale-90"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="ml-2 text-gray-300 dark:text-gray-700 group-hover:text-[#800020] group-hover:translate-x-1 transition-all duration-300 cursor-pointer">
                      <ChevronRight size={22} strokeWidth={3} />
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-0.5 border-l border-gray-100 dark:border-gray-800 pl-2">
                    <button className="p-2 text-gray-400 hover:text-[#800020] transition-all"><Edit3 size={18} /></button>
                    <div className="ml-1 text-gray-300 group-hover:text-[#800020] group-hover:translate-x-1 transition-all duration-300">
                      <ChevronRight size={20} strokeWidth={3} />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ProcessDrawer isOpen={isDrawerOpen} onClose={()   => setIsDrawerOpen(false)} process={selectedProcess} />
      <TaxesModal isOpen={isTaxesModalOpen} onClose={() => setIsTaxesModalOpen(false)} process={selectedProcess} onSave={fetchProcesses} />
      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} process={selectedProcess} onSave={fetchProcesses} />
      <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => setIsDeleteModalOpen(false)} />

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredData.length} itemsPerPage={itemsPerPage} />
      )}
    </div>
  );
}