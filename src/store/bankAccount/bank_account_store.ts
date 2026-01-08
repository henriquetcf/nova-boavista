import { create } from 'zustand';
import { Bank } from '@prisma/client';
import { BankAccountEntity } from '@/domain/entities/bank-account.entity';
import { fetchAvailableBanksAction, fetchBankAccountsAction } from '@/domain/services/bank/bank.service';

// Interface baseada no seu Prisma Model
interface BankDataState {
  accounts: BankAccountEntity[];
  availableBanks: Bank[]; // Para o SearchableSelect do Drawer
  isLoading: boolean;
  isBalancesVisible: boolean;

  // Actions
  toggleBalancesVisibility: () => void;
  fetchAccounts: () => Promise<void>;
  fetchAvailableBanks: () => Promise<void>;
}

export const useBankDataStore = create<BankDataState>((set) => ({
  accounts: [],
  availableBanks: [],
  isLoading: true,
  isBalancesVisible: false,

  toggleBalancesVisibility: () => set((state) => ({ 
    isBalancesVisible: !state.isBalancesVisible 
  })),

  fetchAvailableBanks: async () => {
    set({ isLoading: true });
    try {

      const result = await fetchAvailableBanksAction();
      set({ availableBanks: result.banks as Bank[] });
      
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAccounts: async () => {
    set({ isLoading: true });
    try {
      // Aqui você faz o fetch das contas do usuário
      const result = await fetchBankAccountsAction();
      set({ accounts: result.accounts });
    } finally {
      set({ isLoading: false });
    }
  },
}));