import { depositAction, processPaymentAction, processTaxPaymentAction, transferAction } from '@/models/bank/bank.service';
import { create } from 'zustand';

interface TransactionFormData {
  type: 'DEPOSIT' | 'TRANSFER' | 'CLIENT_INCOME' | 'TAX_OUT' | 'EXPENSE';
  method?: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'BANK_TRANSFER' | 'BOLETO' | 'DEPOSIT';
  originAccountId: string;
  destinationAccountId: string;
  value: string;
  description: string;
  date: string;
  processId?: string;
  services?: string[];
}

interface TransactionStore {
  formData: TransactionFormData;
  isLoading: boolean;
  errors: Record<string, string[] | undefined>;

  // Actions
  setType: (type: 'DEPOSIT' | 'TRANSFER' | 'CLIENT_INCOME' | 'TAX_OUT' | 'EXPENSE') => void;
  setField: (field: keyof TransactionFormData, value: string | string[]) => void;
  reset: () => void;
  
  // Execução
  execute: () => Promise<{ success?: boolean; error?: string }>;
  _resolveAction: (data: TransactionFormData) => Promise<{ success?: boolean; error?: string }>;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  formData: {
    type: 'TRANSFER',
    method: 'PIX',
    originAccountId: '',
    destinationAccountId: '',
    value: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    processId: '',
    services: []
  },
  isLoading: false,
  errors: {},

  setType: (type) => set((state) => ({ 
    formData: { ...state.formData, type },
    errors: {} // Limpa erros ao trocar o tipo
  })),

  setField: (field, value) => set((state) => ({
    formData: { ...state.formData, [field]: value },
    errors: { ...state.errors, [field]: undefined }
  })),

  reset: () => set({
    formData: {
      type: 'TRANSFER',
      method: 'PIX',
      originAccountId: '',
      destinationAccountId: '',
      value: '',
      description: '',
      processId: '',
      date: new Date().toISOString().split('T')[0],
    },
    isLoading: false,
    errors: {}
  }),

  execute: async () => {
    const { formData } = get();
    set({ isLoading: true, errors: {} });

    // 1. Validações básicas (pode até usar Zod aqui se quiser)
    if (!formData.value || parseFloat(formData.value) <= 0) {
      set({ isLoading: false, errors: { value: ['Valor inválido'] } });
      return { error: 'O valor deve ser maior que zero' };
    }

    try {
      // 2. Método auxiliar de decisão (Strategy Pattern simples)
      const result = await get()._resolveAction(formData);

      if (!result.success) {
       set({ isLoading: false });
        return { error: 'Erro ao executar transação' }; 
      }

      get().reset();
      return { success: true };

    } catch (err) {
      set({ isLoading: false });
      return { error: 'Erro inesperado na operação' };
    }
  },

  // Método "privado" (convenção com underscore) para decidir a action
  _resolveAction: async (data: TransactionFormData) => {
    if (data.type === 'DEPOSIT') {
      return await depositAction({
        accountId: data.destinationAccountId,
        value: data.value,
        description: data.description,
        method: 'DEPOSIT',
      });
    }

    if (data.type === 'TRANSFER') {
      console.log('data', data);
      return await transferAction({
        originId: data.originAccountId,
        destinationId: data.destinationAccountId,
        value: data.value,
        method: 'BANK_TRANSFER',
      });
    }

    if (data.type === 'CLIENT_INCOME') {
      console.log('data', data);
      return await processPaymentAction({
        // originId: data.originAccountId,
        destinationId: data.destinationAccountId,
        value: data.value,
        method: data.method!,
        processId: data.processId!,
      });
    }

    if (data.type === 'TAX_OUT') {
      console.log('data', data);
      return await processTaxPaymentAction({
        originId: data.originAccountId,
        // destinationId: data.destinationAccountId,
        value: data.value,
        method: 'DEPOSIT',
        services: data.services!,
      });
    }

    return { success: false, message: 'Tipo de transação inválido' };
  }
}));