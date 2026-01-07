import { createBankAccountAction } from '@/models/bank/bank.service';
import { BankAccountInput, BankAccountSchema } from '@/models/bankAccount/bank_account_model';
import { create } from 'zustand';
// import { createBankAccountAction } from '@/services/bank/bank.service';

interface CreateBankAccountStore {
  formData: BankAccountInput;
  isLoading: boolean;
  errors: Record<string, string[] | undefined>;

  setField: (field: keyof BankAccountInput, value: any) => void;
  setErrors: (errors: Record<string, string[] | undefined>) => void;
  reset: () => void;
  create: () => Promise<{ success?: boolean; error?: string }>;
}

export const useCreateBankAccountStore = create<CreateBankAccountStore>((set, get) => ({
  formData: {
    bankId: '',
    cnpj: '',
    agency: '',
    account: '',
    balance: '0.00',
  },
  errors: {},
  isLoading: false,

  setField: (field, value) => set((state) => ({
    formData: { ...state.formData, [field]: value },
    errors: { ...state.errors, [field]: undefined }
  })),

  setErrors: (errors) => set({ errors }),

  reset: () => set({
    formData: { bankId: '', cnpj: '', agency: '', account: '', balance: '0.00' },
    errors: {},
    isLoading: false
  }),

  create: async () => {
    const { formData } = get();
    set({ isLoading: true, errors: {} });

    // Validação Zod
    const validation = BankAccountSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0]);
        fieldErrors[fieldName] = [issue.message];
      });
      set({ errors: fieldErrors, isLoading: false });
      return { error: 'Validação falhou' };
    }

    try {
      // Aqui chamaria sua Server Action
      const result = await createBankAccountAction(formData);

      if (!result.success) {
        // set({ 
        //   errors: {error: result?.message}, 
        //   isLoading: false 
        // });
        return { error: result.message };
      }
      
      get().reset();
      return { success: true, result };
    } catch (err) {
      set({ isLoading: false });
      return { error: 'Erro ao conectar com o servidor' };
    }
  }
}));