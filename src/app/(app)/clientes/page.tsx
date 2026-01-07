"use client"
import { useEffect, useState } from "react";
import { User, Edit3, Trash2, ChevronRight, Phone, Mail, Fingerprint } from "lucide-react";
import { useClientDataStore } from "@/store/client/client_store";
import { ListHeader } from "@/components/ui/header/ListHeader";
import { Filters } from "@/components/ui/Filters";
import { Pagination } from "@/components/navigation/Pagination";
import { useLoading } from "@/components/AppLoading";
import { ClientDetailsDrawer } from "@/components/ui/client/ClientDetailsDrawer";
import { Client } from "@prisma/client";

export default function ClientList() {
  const { clients, isLoading, fetchClients, searchQuery, statusFilter, currentPage, itemsPerPage, setSearchQuery, setStatusFilter, setCurrentPage } = useClientDataStore();
  const { startLoading, stopLoading } = useLoading();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    startLoading("Sincronizando clientes...");
    fetchClients().finally(() => stopLoading());
  }, []);


  const filteredData = clients.filter(item => {
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
    <div className="space-y-4 p-2">

      {/* Header da Seção */}
      <ListHeader 
        title="Clientes" 
        count={clients.length} 
        buttonLabel="Novo Cliente" 
        buttonHref="/cllientes/novo" 
      />

      {/* Search Bar - Mantendo o padrão */}
      {/* <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-xs group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={16} />
          <input 
            placeholder="Filtrar clientes por nome ou CPF..."
            className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-2 pl-10 rounded-xl text-[13px] font-medium outline-none focus:border-[#800020]/50 focus:ring-4 focus:ring-[#800020]/5 transition-all"
          />
        </div>
      </div> */}

      <Filters 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <div className="grid grid-cols-1 gap-3">
        {paginatedData.map((client) => (
          <div 
            key={client.id}
            onClick={() => {setSelectedClient(client as Client); setIsDrawerOpen(true)}}
            className="group relative bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 p-3 pr-5 rounded-2xl hover:border-[#800020]/20 hover:shadow-lg hover:shadow-[#800020]/5 transition-all duration-300 cursor-default overflow-hidden"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#800020]/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex items-center justify-between gap-4 z-10">
              
              {/* Esquerda: Avatar e Nome */}
              <div className="flex items-center gap-4 flex-1">
                <div className="shrink-0 w-11 h-11 bg-gray-50 dark:bg-[#222] rounded-xl flex items-center justify-center text-[#800020] transition-all duration-300 shadow-sm">
                  <User size={22} strokeWidth={2.2} />
                </div>
                
                <div className="flex flex-col">
                  <h3 className="text-[15px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight leading-none mb-2 group-hover:text-[#800020] transition-colors">
                    {client.name}
                  </h3>
                  
                  <div className="flex items-center gap-3">
                    {/* CPF/CNPJ Badge */}
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md">
                      <Fingerprint size={12} className="text-gray-400" />
                      <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 tabular-nums">
                        {client.cpf ? client.cpf : client.cnpj}
                      </span>
                    </div>
                    
                    {/* Telefone Rápido */}
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Phone size={12} strokeWidth={2.5} />
                      <span className="text-[11px] font-medium">{client.phone || 'Sem fone'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Centro: Email (Visualização Limpa) */}
              <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-[#222] rounded-full border border-gray-100 dark:border-gray-800 group-hover:bg-white dark:group-hover:bg-[#1a1a1a] transition-all">
                  <Mail size={12} className="text-[#800020]" />
                  <span className="text-[11px] font-semibold text-gray-500 lowercase truncate max-w-[180px]">
                    e-mail não cadastrado
                    {/* {client?.email || 'e-mail não cadastrado'} */}
                  </span>
                </div>
              </div>

              {/* Direita: Ações */}
              <div className="flex items-center gap-1">
                <button className="p-2 text-gray-400 hover:text-[#800020] hover:bg-[#800020]/10 rounded-lg transition-all cursor-pointer active:scale-90" title="Editar Cliente">
                  <Edit3 size={18} />
                </button>
                <button 
                  // onClick={() => removeClient(client.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all cursor-pointer active:scale-90"
                  title="Excluir Cliente"
                >
                  <Trash2 size={18} />
                </button>
                <div className="ml-2 text-gray-300 dark:text-gray-700 group-hover:text-[#800020] group-hover:translate-x-1 transition-all duration-300 cursor-pointer">
                  <ChevronRight size={22} strokeWidth={3} />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      <ClientDetailsDrawer client={selectedClient} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

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