import { fetchServicesAction, searchServicesAction } from '@/services/services/service.service';
import { create } from 'zustand';

interface Service {
  id: string;
  name: string;
  baseValue: string;
  finalValue: string;
  requiredDocuments?: string;
  description?: string;
  createdAt?: Date;
}

interface ServiceDataState {
  services: Service[];
  isLoading: boolean;
  error: string | null;

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
  
  // Actions
  fetchServices: () => Promise<void>;
  getServiceById: (id: string) => Service | undefined;
  // Útil para quando deletar ou atualizar um serviço via API
  refreshService: (updatedService: Service) => void;
  removeService: (id: string) => void;
  fetchServicesForSelect: () => Promise<void>;
}

export const useServiceDataStore = create<ServiceDataState>((set, get) => ({
  services: [],
  isLoading: true,
  error: null,

  searchQuery: '',
  statusFilter: 'TODOS',
  currentPage: 1,
  itemsPerPage: 6,

  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }), // Reseta página ao buscar
  setStatusFilter: (status) => set({ statusFilter: status, currentPage: 1 }), // Reseta página ao filtrar
  setCurrentPage: (page) => set({ currentPage: page }),
  resetFilters: () => set({ searchQuery: '', statusFilter: 'TODOS', currentPage: 1 }),

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await fetchServicesAction();
      set({ services: result.services });
      set({ isLoading: false });
    } catch (err) {
      set({ error: "Erro ao carregar serviços", isLoading: false });
    }
  },

  getServiceById: (id: string) => get().services.find(s => s.id === id),

  refreshService: (updated) => set((state) => ({
    services: state.services.map(s => s.id === updated.id ? updated : s)
  })),

  removeService: (id) => set((state) => ({
    services: state.services.filter(s => s.id !== id)
  })),

  fetchServicesForSelect: async () => {
    set({ isLoading: true });
    const result = await searchServicesAction("");

    if (!result?.success) {
      console.error("[SERVICE STORE] Erro ao buscar servicos:", result.message);
      return;
    }
    set({ services: result.services as Service[] });
    set({ isLoading: false });
  },
}));