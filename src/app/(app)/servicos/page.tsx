"use client"
import { useEffect, useState } from "react";
import { Layers, Edit3, Trash2, Banknote, ChevronRight } from "lucide-react";
import { useServiceDataStore } from "@/store/services/service_store";
import { ListHeader } from "@/components/ui/header/ListHeader";
import { Filters } from "@/components/ui/Filters";
import { Pagination } from "@/components/navigation/Pagination";
import { useLoading } from "@/components/AppLoading";
import { ServiceDetailsDrawer } from "@/components/ui/service/ServiceDetailsDrawer";
import { Service } from "@prisma/client";

export default function ServiceList() {
  const { services, isLoading, fetchServices, removeService, searchQuery, setSearchQuery, statusFilter, setStatusFilter, currentPage, itemsPerPage, setCurrentPage } = useServiceDataStore();
  const { startLoading, stopLoading } = useLoading();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  useEffect(() => {
    startLoading("Sincronizando serviços...");
    fetchServices().finally(() => stopLoading());
  }, []);

  // --- Lógica de Filtragem ---
  const filteredData = services.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) 
      // ||
      // item.plate.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'TODOS' 
      // || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // --- Lógica de Paginação ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) return <div className="h-screen" />;

  return (
    <div className="h-screen space-y-4 p-2">
      
      {/* Header da Seção */}
      <ListHeader 
        title="Serviços" 
        count={services.length} 
        buttonLabel="Novo Serviço" 
        buttonHref="/servicos/novo" 
      />

      {/* Search Bar Minimalista */}
      {/* <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-xs group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={16} />
          <input 
            placeholder="Filtrar serviços..."
            className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-2 pl-10 rounded-xl text-[13px] font-medium outline-none focus:border-[#800020]/50 focus:ring-4 focus:ring-[#800020]/5 transition-all"
          />
        </div>
      </div> */}

      {/* Componente de Filtros plugado na Store */}
      <Filters 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <div className="grid grid-cols-1 gap-3">
        {paginatedData.map((service) => {
          const docsArray = service.requiredDocuments?.split(',').filter(Boolean) || [];
          
          return (
            <div 
              key={service.id}
              onClick={() => {setIsDrawerOpen(true); setSelectedService(service)}}
              className="group relative bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 p-3 pr-5 rounded-2xl hover:border-[#800020]/20 hover:shadow-lg hover:shadow-[#800020]/5 transition-all duration-300 cursor-default overflow-hidden"
            >
              {/* Efeito de brilho sutil no fundo ao passar o mouse */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#800020]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex items-center justify-between gap-4 z-10">
                
                {/* Esquerda: Ícone e Título */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="shrink-0 w-11 h-11 bg-gray-50 dark:bg-[#222] rounded-xl flex items-center justify-center text-[#800020] transition-all duration-300 shadow-sm group-hover:shadow-[#800020]/20">
                    <Layers size={22} strokeWidth={2.2} />
                  </div>
                  
                  <div className="flex flex-col">
                    <h3 className="text-[15px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight leading-none mb-2 group-hover:text-[#800020] transition-colors">
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {/* Badge de Valor Premium */}
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 rounded-md">
                        <Banknote size={12} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[12px] font-black text-emerald-700 dark:text-emerald-300 tabular-nums">
                          R$ {service.finalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-300 font-bold ml-1 uppercase tracking-tighter">
                        {docsArray.length} documentos
                      </span>
                    </div>
                  </div>
                </div>

                {/* Centro: Documentos (Escondido em mobile) */}
                <div className="hidden lg:flex items-center gap-1.5 flex-1 justify-center">
                  {docsArray.slice(0, 3).map((doc, idx) => (
                    <span key={idx} className="text-[9px] font-black px-2 py-0.5 bg-gray-50 dark:bg-[#222] text-gray-400 border border-gray-100 dark:border-gray-800 rounded-md uppercase group-hover:border-gray-200 dark:group-hover:border-gray-700 transition-colors">
                      {doc.trim()}
                    </span>
                  ))}
                  {docsArray.length > 3 && (
                    <span className="text-[10px] font-black text-[#800020]/40 group-hover:text-[#800020] transition-colors">
                      +{docsArray.length - 3}
                    </span>
                  )}
                </div>

                {/* Direita: Ações */}
                <div className="flex items-center gap-1">
                  <button className="p-2 text-gray-400 hover:text-[#800020] hover:bg-[#800020]/10 rounded-lg transition-all cursor-pointer active:scale-90" title="Editar">
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => removeService(service.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all cursor-pointer active:scale-90"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="ml-2 text-gray-300 dark:text-gray-700 group-hover:text-[#800020] group-hover:translate-x-1 transition-all duration-300 cursor-pointer">
                    <ChevronRight size={22} strokeWidth={3} />
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      <ServiceDetailsDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} service={selectedService} />

      {/* /* Componente de Paginação plugado na Store */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length} // Passa o total de processos filtrados
          itemsPerPage={itemsPerPage}     // Passa o limite da store (ex: 8)
        />
      )}
    </div>
  );
}