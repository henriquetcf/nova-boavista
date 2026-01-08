// store/useProcessDetailStore.ts
import { create } from 'zustand';
import { Status } from '@prisma/client';
import { ProcessSchema } from '@/models/process/process.model'; // Reaproveitando o schema se for igual
import { toast } from 'sonner';
import { updateProcessStatusAction } from '@/domain/services/process/process.service';

interface Service {
  id: string;
  name: string;
  baseValue: string;
  finalValue: string;
  type?: string; // Adicionado para a lógica das taxas
  isPaid?: boolean;
}

interface ProcessFormData {
  id?: string;
  plate: string;
  renavam?: string | null;
  clientId: string;
  clientName: string;
  services?: Service[];
  totalValue: string;
  status: Status;
  documents?: { id: string; name: string; isUploaded: boolean; fileUrl?: string; uploadedAt?: Date }[];
  movements?: { id: string; status: Status; description?: string; createdAt: Date }[];
  createdAt?: Date;
}

interface ProcessDetailStore {
  formData: ProcessFormData;
  isLoading: boolean;
  errors: Record<string, string[] | string | undefined>;
  
  // Ações de Estado
  setField: (field: keyof ProcessFormData, value: any) => void;
  setFormData: (data: ProcessFormData) => void;
  setErrors: (errors: Record<string, string[] | undefined>) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;

  // Ações de Persistência (Server Actions)
  update: () => Promise<{ success?: boolean; error?: string }>;
  updateStatus: (newStatus: Status, description?: string) => Promise<{ success?: boolean; error?: string }>;
  
  // Helpers
  validate: (data: any, schema: any) => boolean;
}

export const useUpdateProcessStore = create<ProcessDetailStore>((set, get) => ({
  formData: {
    plate: '',
    renavam: '',
    clientId: '',
    clientName: '',
    services: [],
    totalValue: '0.00',
  },
  errors: {},
  isLoading: false,

  // Inicializa ou atualiza os dados do formulário quando abre o detalhe
  setFormData: (data) => set({ formData: data, errors: {} }),

  setField: (field, value) => 
    set((state) => ({ 
      formData: { ...state.formData, [field]: value },
      errors: { ...state.errors, [field]: undefined } 
    })),

  setErrors: (errors) => set({ errors }),
  setLoading: (isLoading) => set({ isLoading }),

  // 1. UPDATE DE DADOS GERAIS (Placa, Renavam, etc)
  update: async () => {
    const { formData, validate } = get();
    set({ isLoading: true, errors: {} });

    if (!validate(formData, ProcessSchema)) return { error: 'Campos inválidos' };

    // const result = await updateProcessAction(formData.id!, formData);

    // if (!result.success) {
    //   set({ errors: result.errors || {}, isLoading: false });
    //   return { error: result.error };
    // }

    set({ isLoading: false });
    toast.success("Dados salvos com sucesso!");
    return { success: true };
  },

  // 2. UPDATE DE STATUS (Ação da Timeline)
  updateStatus: async (newStatus, description) => {
    const { formData } = get();
    if (!formData.id) return { error: "ID do processo não encontrado" };

    set({ isLoading: true });
    
    const result = await updateProcessStatusAction(formData.id, newStatus, description);

    if (!result.success) {
      set({ isLoading: false });
      toast.error(result.error || "Erro ao atualizar status");
      return { success: false, error: result.error };
    }

    // Atualiza o status localmente para a UI refletir na hora
    set((state) => ({
      formData: { ...state.formData, status: newStatus },
      isLoading: false
    }));

    // toast.success(`Status alterado para ${newStatus.replace('_', ' ')}`);
    return { success: true };
  },

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
    formData: { plate: '', renavam: '', clientId: '', clientName: '', services: [], totalValue: '0.00' }, 
    errors: {},
    isLoading: false
  }),
}));