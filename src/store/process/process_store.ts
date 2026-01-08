import { fetchProcessesAction, toggleDocStatusAction } from "@/domain/services/process/process.service";
import { Status } from "@prisma/client";
import { check } from "zod";
import { create } from "zustand";

interface Process {
  id: string;
  clientId: string;
  clientName: string;
  plate: string;
  renavam?: string;
  totalValue: string;
  paidValue?: string;
  status: Status;
  // checklist?: {
  //   documentName: string;
  //   isUploaded: boolean;
  //   fileUrl?: string;
  // }[];
  createdAt?: Date;
  services?: {
    id: string;
    name: string;
    baseValue: string;
    finalValue: string;
  }[];
  documents?: {
    id: string;
    name: string;
    isUploaded: boolean;
    fileUrl?: string;
    uploadedAt?: Date;
    createdAt?: Date;
  }[];
  client?: {
    id: string;
    name: string;
  };
}

interface ProcessDataState {
  processes: Process[];
  selectedProcess: Process | null;
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
  updateProcessStatus: (id: string, status: Process['status']) => void;
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
    set({ processes: result.process });
    set({ isLoading: false });
  },

  updateProcessStatus: (id, status) => set((state) => ({
    processes: state.processes.map(p => p.id === id ? { ...p, status } : p)
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
            ? {
                ...p,
                documents: p.documents?.map((d) =>
                  d.name === docName ? { ...d, isUploaded: status } : d
                ),
              }
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
      console.error(`[Document Update Error]: ${docName} revertido.`);
      // Opcional: toast.error("Falha ao salvar")
    }
  }
}));