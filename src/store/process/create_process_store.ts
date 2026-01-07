import { ProcessSchema } from '@/models/process/process.model';
import { createProcessAction } from '@/services/process/process.service';
import { create } from 'zustand';

interface Service {
  id: string;
  name: string;
  baseValue: string;
  finalValue: string;
  notes?: string;
  requiredDocuments?: string;
}

interface ProcessFormData {
  plate: string;
  renavam: string;
  clientId: string;
  clientName: string; // Guardamos o nome para denormalização
  services: Service[]; // Array de objetos de serviço
  totalValue: string;
}

interface ProcessStore {
  formData: ProcessFormData;
  isLoading: boolean;
  errors: Record<string, string[] | undefined>;
  
  // Ações básicas
  setField: (field: keyof ProcessFormData, value: string) => void;
  setErrors: (errors: Record<string, string[] | undefined>) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;

  // Lógica de Serviços (Handled by Store)
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;

  create: () => Promise<{ success?: boolean; error?: string }>;
  validate: (data: any, schema: any) => boolean;
  updateServicePrice: (serviceId: string, newPrice: string) => void
}

export const useProcessStore = create<ProcessStore>((set, get) => ({
  formData: {
    plate: '',
    renavam: '',
    clientId: '',
    clientName: '',
    services: [],
    totalValue: '0'
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

    const validate = get().validate(formData, ProcessSchema);
    if (!validate) return false

    console.log('formData', formData);
    // return false;
    const result = await createProcessAction(formData);

    if (result.errors) {
      console.log(result.errors);
      set({ errors: result.errors, isLoading: false });
      // set({ isLoading: false });
      return false;
      // return { error: result.error };
    }

    // Se deu certo, resetamos a store
    get().reset();
    set({ isLoading: false });
    return { success: true };
  },

  // ADICIONAR SERVIÇO COM CÁLCULO DE TOTAL
  addService: (service) => set((state) => {
    // Evita duplicados
    if (state.formData.services.find(s => s.id === service.id)) return state;

    const newServices = [...state.formData.services, { 
      id: service.id, 
      name: service.name, 
      baseValue: service.baseValue,
      finalValue: service.finalValue,
      // notes: service?.notes || '',
      requiredDocuments: service.requiredDocuments
    }];

    const newTotal = newServices.reduce((acc, curr) => acc + parseFloat(curr.finalValue), 0);

    return {
      formData: {
        ...state.formData,
        services: newServices,
        totalValue: newTotal.toFixed(2)
      }
    };
  }),

  // REMOVER SERVIÇO COM RECALCULO DE TOTAL
  removeService: (serviceId) => set((state) => {
    const newServices = state.formData.services.filter(s => s.id !== serviceId);
    const newTotal = newServices.reduce((acc, curr) => acc + parseFloat(curr.baseValue), 0);

    return {
      formData: {
        ...state.formData,
        services: newServices,
        totalValue: newTotal.toFixed(2)
      }
    };
  }),

  reset: () => set({ 
    formData: { 
      plate: '', 
      renavam: '', 
      clientId: '', 
      clientName: '', 
      services: [], 
      totalValue: '0.00' 
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

  updateServicePrice: (serviceId: string, newPrice: string) => set((state) => {
    const updatedServices = state.formData.services.map(s => 
      s.id === serviceId ? { ...s, finalValue: newPrice } : s
    );

    const newTotal = updatedServices.reduce((acc, curr) => {
      const val = parseFloat(curr.finalValue) || 0;
      return acc + val;
    }, 0);

    return {
      formData: {
        ...state.formData,
        services: updatedServices,
        totalValue: newTotal.toFixed(2)
      }
    };
  }),
}));