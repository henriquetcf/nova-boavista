import { fetchTransactionMovimentsAction } from '@/models/bank/bank.service';
import { create } from 'zustand';

interface TransactionDataState {
  movements: any[];
  isLoading: boolean;
  
  // Actions
  fetchMovements: () => Promise<void>;
}

export const useTransactionDataStore = create<TransactionDataState>((set) => ({
  movements: [],
  isLoading: false,

  fetchMovements: async () => {
    set({ isLoading: true });
    const result = await fetchTransactionMovimentsAction();
    
    if (result.success) {
      set({ movements: result.movements });
    }
    set({ isLoading: false });
  }
}));