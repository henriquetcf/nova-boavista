import { ServiceSchema } from '@/models/services/services.model';
import { createServiceAction } from '@/services/services/service.service';
import { create } from 'zustand';

// Lista de documentos padrão para todo despachante
export const DEFAULT_DOCUMENTS = [
  "CNH", "RG", "CPF", "CRV (RECIBO)", "COMPR. RESIDÊNCIA", 
  "LAUDO CAUTELAR", "CONTRATO SOCIAL", "REQUERIMENTO", "DEBITOS", "INVENTARIO",
];

interface ServiceFormData {
  name: string;
  baseValue: string;
  finalValue: string; // Valor de venda padrão
  notes: string;      // Adicionei aqui para bater com o layout
  requiredDocuments: string[];
}

interface ServiceStore {
  formData: ServiceFormData;
  isLoading: boolean;
  errors: Record<string, string[] | undefined>;
  setField: (field: keyof ServiceFormData, value: string | string[]) => void;
  setErrors: (errors: Record<string, string[] | undefined>) => void;
  setLoading: (loading: boolean) => void;
  addDocument: (doc: string) => void;
  removeDocument: (index: number) => void;
  create: () => Promise<{ success?: boolean; error?: string }>;
  validate: (data: any, schema: any) => boolean;
  reset: () => void;
}

export const useServiceStore = create<ServiceStore>((set, get) => ({
  formData: {
    name: '',
    baseValue: '',
    finalValue: '',
    notes: '',
    requiredDocuments: []
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
    set({ isLoading: true })
    
    const { formData } = get();
    console.log(formData);

    const validate = get().validate(formData, ServiceSchema);
    if (!validate) return false
    
    const result = await createServiceAction(formData);

    if (!result.success) {
      // console.log(result.errors);
      // set({ errors: result.errors, isLoading: false });
      // set({ isLoading: false });
      return { error: result.message};
      // return { error: result.error };
    }

    // Se deu certo, resetamos a store
    get().reset();
    set({ isLoading: false });
    return { success: true, error: undefined };
  },

  addDocument: (doc) => set((state) => {
    const upperDoc = doc.toUpperCase().trim();
    if (state.formData.requiredDocuments.includes(upperDoc)) {
      // Se já existe, e o usuário clicou de novo, a gente remove (toggle)
      return {
        formData: {
          ...state.formData,
          requiredDocuments: state.formData.requiredDocuments.filter(d => d !== upperDoc)
        }
      };
    }
    return {
      formData: {
        ...state.formData,
        requiredDocuments: [...state.formData.requiredDocuments, upperDoc]
      }
    };
  }),

  removeDocument: (index) => set((state) => ({
    formData: {
      ...state.formData,
      requiredDocuments: state.formData.requiredDocuments.filter((_, i) => i !== index)
    }
  })),

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

  reset: () => set({ 
    formData: { 
      name: '', 
      baseValue: '', 
      finalValue: '', 
      notes: '',
      requiredDocuments: []
    }, 
    errors: {},
    isLoading: false
  }),
}));