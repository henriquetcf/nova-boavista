import { ClientEntity } from "@/domain/entities/client.entity";
import { fetchClientsAction, searchClientsAction } from "@/domain/services/client/client.service";
import { create } from "zustand";

interface ClientDataState {
  clients: ClientEntity[];
  isLoading: boolean;
  
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
  
  fetchClients: () => Promise<void>;
  fetchClientForSelect: () => Promise<void>;
  // Getter filtrado
  filteredClients: () => ClientEntity[];

  addClient: (client: { value: string, label: string }) => void;
  // removeClient: (id: string) => void;
}

export const useClientDataStore = create<ClientDataState>((set, get) => ({
  clients: [],
  isLoading: false,

  searchQuery: '',
  statusFilter: 'TODOS',
  currentPage: 1,
  itemsPerPage: 6,

  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }), // Reseta página ao buscar
  setStatusFilter: (status) => set({ statusFilter: status, currentPage: 1 }), // Reseta página ao filtrar
  setCurrentPage: (page) => set({ currentPage: page }),
  resetFilters: () => set({ searchQuery: '', statusFilter: 'TODOS', currentPage: 1 }),

  fetchClients: async () => {
    set({ isLoading: true });
    const result = await fetchClientsAction();

    if (!result?.success) {
      console.error("[CLIENT STORE] Erro ao buscar clientes:", result.message);
      return;
    }
    set({ clients: result.clients });
    set({ isLoading: false });
  },

  fetchClientForSelect: async () => {
    set({ isLoading: true });
    const result = await searchClientsAction("");

    if (!result?.success) {
      console.error("[CLIENT STORE] Erro ao buscar clientes:", result.message);
      return;
    }
    set({ clients: result.clients });
    set({ isLoading: false });
  },

  filteredClients: () => {
    const { clients, searchQuery } = get();
    return clients.filter(c => 
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.document?.includes(searchQuery)
    );
  },

  addClient: (client: { value: string, label: string }) => set((state) => {
    // 1. Verifica se o cliente já existe na lista atual da Store
    const alreadyExists = state.clients.some(c => c.id === client.value);

    // 2. Se já existe (porque o Next.js foi rápido no refresh), não faz nada
    if (alreadyExists) return state;

    // 3. Se não existe, adiciona no topo
    return {
      clients: [new ClientEntity({ id: client.value, name: client.label }), ...state.clients]
    };
  }),
}));