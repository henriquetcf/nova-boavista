import { ProcessEntity } from '@/domain/entities/process.entity';
import getDashboardData, { getEntityDetailsAction, searchGlobalAction } from '@/domain/services/dashboard/dashboard_service';
import { create } from 'zustand';

interface Dashboard {
  kpis: any,
  bottlenecks: any,
  recentActivities: any,
  upcomingDeadlines: any,
  pendingDocuments: any
}

interface DashboardDataState {
  data: Dashboard;
  isLoading: boolean;
  error: string | null;

  searchResults?: ProcessEntity[];
  isSearching: boolean;

  selectedEntity: ProcessEntity | null;
  selectEntity: (id: string | null, type: 'PROCESS' | 'CLIENT') => Promise<void>;

  // Filtros
  searchQuery: string;
  statusFilter: string;
  currentPage: number;
  itemsPerPage: number;
  
  fetchDashboardData: () => Promise<void>;
  performGlobalSearch: (query: string) => Promise<void>; // Novo método
  // Ações
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
  
  // Actions
}

export const useDashboardDataStore = create<DashboardDataState>((set, get) => ({
  data: {
    kpis: [],
    bottlenecks: [],
    recentActivities: [],
    upcomingDeadlines: [],
    pendingDocuments: []
  },
  isLoading: true,
  error: null,

  searchResults: [],
  isSearching: false,

  selectedEntity: null,

  searchQuery: '',
  statusFilter: 'TODOS',
  currentPage: 1,
  itemsPerPage: 6,

  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }), // Reseta página ao buscar
  setStatusFilter: (status) => set({ statusFilter: status, currentPage: 1 }), // Reseta página ao filtrar
  setCurrentPage: (page) => set({ currentPage: page }),
  resetFilters: () => set({ searchQuery: '', statusFilter: 'TODOS', currentPage: 1 }),

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getDashboardData();
      set({ data: result });
      set({ isLoading: false });
    } catch (err) {
      console.error("[DASHBOARD STORE] Erro ao buscar dashboard:", err);
      set({ error: "Erro ao carregar serviços", isLoading: false });
    }
  },

  performGlobalSearch: async (query: string) => {
    if (query.length < 2) {
      set({ searchResults: [] });
      return;
    }

    set({ isSearching: true });
    try {
      const results = await searchGlobalAction(query);
      set({ searchResults: results, isSearching: false });
    } catch (err) {
      console.error("[DASHBOARD STORE] Erro ao buscar global search:", err);
      set({ searchResults: [], isSearching: false });
    }
  },

  selectEntity: async (id: string | null, type: 'PROCESS' | 'CLIENT') => {
    set({ isLoading: true });
    if (!id) {
      set({ selectedEntity: null, isLoading: false });
      return;
    };
    try {
      const details = await getEntityDetailsAction(id, type);
      set({ selectedEntity: new ProcessEntity({ ...details }), isLoading: false });
    } catch (err) {
      console.error("[DASHBOARD STORE] Erro ao buscar detalhes da entidade:", err);
      set({ isLoading: false });
    }
  },
}));