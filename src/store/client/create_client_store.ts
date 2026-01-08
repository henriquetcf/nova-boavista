import { ClientEntity } from '@/domain/entities/client.entity';
import { createClientAction } from '@/domain/services/client/client.service';
import { ClientInput, ClientSchema } from '@/models/client/client.model';
import { create } from 'zustand';

interface ClientStore {
  formData: ClientInput;
  isLoading: boolean;
  errors: Record<string, string | undefined>;
  
  // Ações básicas
  setField: (field: keyof ClientInput, value: string) => void;
  setErrors: (errors: Record<string, string | undefined>) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;

  // Lógica de Serviços (Handled by Store)
  create: () => Promise<{ success?: boolean; error?: string, client?: ClientEntity }>;
  validate: (data: ClientInput, schema: typeof ClientSchema) => boolean;
}

export const useCreateClientStore = create<ClientStore>((set, get) => ({
  formData: {
    name: '',
    document: '',
    email: '',
    phone: '',
    address: '',
  },
  errors: {},
  isLoading: false,

  setField: (field, value) => 
    set((state) => ({ 
      formData: { ...state.formData, [field]: value },
      errors: { ...state.errors, [field]: undefined } 
    })),

  setErrors: (errors) => set({ errors }),
  
  setLoading: (isLoading) => set({ isLoading }),

  create: async () => {
    set({ isLoading: true, errors: {} });
    
    // Pegamos os dados atuais da store usando get()
    const { formData } = get();
    console.log(formData);

    const validate = get().validate(formData, ClientSchema);
    if (!validate) return { success: false, error: 'Campos inválidos' };

    const result = await createClientAction(formData);

    if (!result.success) {
      console.log('[CREATE CLIENT STORE] CREATE ERROR', result);
      set({ errors: {['error']: result.message}, isLoading: false });
      // set({ isLoading: false });
      return { success: false, error: result.message };
      // return { error: result.error };
    }

    console.log('formData', result);
    // return false;
    // Se deu certo, resetamos a store
    get().reset();
    set({ isLoading: false });
    return { success: true, client: result.client };
  },

  // quickClientCreate: (client: { value: string, label: string }) => set((state) => {
  //   // 1. Verifica se o cliente já existe na lista atual da Store
  //   const alreadyExists = state.clients.some(c => c.id === client.value);

  //   // 2. Se já existe (porque o Next.js foi rápido no refresh), não faz nada
  //   if (alreadyExists) return state;

  //   // 3. Se não existe, adiciona no topo
  //   return {
  //     clients: [{ id: client.value, name: client.label }, ...state.clients]
  //   };
  // }),

  reset: () => set({ 
    formData: { 
      name: '',
      document: '',
      email: '',
      phone: '',
      address: '',
    }, 
    errors: {} 
  }),

  validate: (data, schema) => {
    const validation = schema.safeParse(data);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0]);
        fieldErrors[fieldName] = issue.message;
      });
      set({ errors: fieldErrors, isLoading: false });
      return false;
    }

    return true;
  },
}));