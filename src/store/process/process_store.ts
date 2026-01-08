import { DocumentEntity } from "@/domain/entities/document.entity";
import { ProcessEntity } from "@/domain/entities/process.entity";
import { fetchProcessesAction, toggleDocStatusAction } from "@/domain/services/process/process.service";
import { Status } from "@prisma/client";
import { create } from "zustand";

interface ProcessDataState {
  processes: ProcessEntity[];
  selectedProcess: ProcessEntity | null;
  isLoading: boolean;
  filterStatus: string | null;

  // Filtros
  searchQuery: string;
  statusFilter: string;
  currentPage: number;
  itemsPerPage: number;
  
  // Ações
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;

  fetchProcesses: () => Promise<void>;
  updateProcessStatus: (id: string, status: Status) => void;
  // Importante: toggle de documento no checklist
  toggleDocStatus: (processId: string, docName: string) => void;
}

export const useProcessDataStore = create<ProcessDataState>((set, get) => ({
  processes: [],
  selectedProcess: null,
  isLoading: true,
  filterStatus: null,

  searchQuery: '',
  statusFilter: 'TODOS',
  currentPage: 1,
  itemsPerPage: 5,

  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }), // Reseta página ao buscar
  setStatusFilter: (status) => set({ statusFilter: status, currentPage: 1 }), // Reseta página ao filtrar
  setCurrentPage: (page) => set({ currentPage: page }),
  resetFilters: () => set({ searchQuery: '', statusFilter: 'TODOS', currentPage: 1 }),

  fetchProcesses: async () => {
    set({ isLoading: true });
    const result = await fetchProcessesAction();
    if (!result?.success) return;
    set({ processes: result.processes });
    set({ isLoading: false });
  },

  updateProcessStatus: (id, status) => set((state) => ({
    processes: state.processes?.map(p => 
      p.id === id 
        ? new ProcessEntity({ ...p, status }) // Criando uma nova instância com os dados novos
        : p
    )
  })),

  toggleDocStatus: async (processId, docName) => {
    const { processes } = get();

    // 1. Localiza os dados necessários
    const process = processes.find((p) => p.id === processId);
    const doc = process?.documents?.find((d) => d.name === docName);
    
    if (!doc) return;

    const targetStatus = !doc.isUploaded;

    // Função utilitária interna para atualizar o estado local (evita repetir código no rollback)
    const updateLocalState = (status: boolean) => {
    set((state) => ({
      processes: state.processes.map((p) =>
        p.id === processId
          ? new ProcessEntity({ // Garante que o processo continue sendo uma Entity
              ...p,
              documents: p.documents?.map((d) =>
                d.name === docName 
                  ? new DocumentEntity({ ...d, isUploaded: status }) // Documento também vira Entity
                  : d
              ),
            })
          : p
      ),
    }));
  };

    // 2. Execução Otimista
    updateLocalState(targetStatus);

    // 3. Sincronização com o Servidor
    console.log('doc', doc);
    try {
      const { success } = await toggleDocStatusAction(doc.id, targetStatus);
      if (!success) throw new Error();
    } catch (error) {
      // 4. Rollback em caso de falha
      updateLocalState(!targetStatus);
      console.error(`[Document Update Error]: ${docName} revertido.`, error);
      // Opcional: toast.error("Falha ao salvar")
    }
  }
}));