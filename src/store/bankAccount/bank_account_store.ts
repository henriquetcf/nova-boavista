import { create } from 'zustand';
import { Bank } from '@prisma/client';
import { fetchAvailableBanksAction, fetchBankAccountsAction } from '@/models/bank/bank.service';

// Interface baseada no seu Prisma Model
interface BankAccountPopulated {
  id: string;
  cnpj: string;
  agency: string;
  account: string;
  balance: string; // Decimal vem como string do Prisma/DB
  bank: Bank;
}

interface BankDataState {
  accounts: BankAccountPopulated[];
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
      set({ accounts: result.accounts as BankAccountPopulated[] });
    } finally {
      set({ isLoading: false });
    }
  },
}));