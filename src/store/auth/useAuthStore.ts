import { create } from 'zustand'
import { registerAction } from '@/services/auth/auth.service'
import { LoginInput, LoginSchema, RegisterInput, RegisterSchema } from '@/models/auth/auth.model'
import { signIn } from 'next-auth/react';

interface AuthState {
  isLoading: boolean;
  errors: Record<string, string>; // Ex: { email: "E-mail inválido", name: "Muito curto" }
  register: (data: RegisterInput) => Promise<boolean>;
  validate: (data: any, schema: any) => boolean;
  login: (data: LoginInput) => Promise<boolean>;
  clearErrors: () => void;
}
export const useAuthStore = create<AuthState>((set, get) => ({
  isLoading: false,
  errors: {},
  clearErrors: () => set({ errors: {} }),
  login: async (data) => {
    set({ isLoading: true })
    const validate = get().validate(data, LoginSchema);
    if (!validate) return false
    
    console.log('lalalala');
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false, // Para a gente controlar o redirecionamento
    })

    console.log(result);

    if (result?.error) {
      set({ errors: { login: result.error }, isLoading: false })
      return false
    }

    set({ isLoading: false })
    return true
  },
  register: async (data) => {
    set({ isLoading: true, errors: {} });
    
    // 1. Validação com Zod no lado do Cliente (dentro da Store)
    const validation = get().validate(data, RegisterSchema);
    if (!validation) {
      // const fieldErrors: Record<string, string> = {};
      // validation.error.issues.forEach((issue) => {
      //   const fieldName = String(issue.path[0]);
      //   fieldErrors[fieldName] = issue.message;
      // });
      // set({ errors: fieldErrors, isLoading: false });
      return false;
    }

    // 2. Chamada para a Action (Back-end)
    const result = await registerAction(data);
    
    if (!result.success) {
      // Se o erro for de e-mail duplicado, mapeamos para o campo e-mail
      const isEmailError = result.message.includes("e-mail") || result.message.includes("cadastrado");
      set({ 
        errors: isEmailError ? { email: result.message } : { general: result.message },
        isLoading: false 
      });
      return false;
    }

    set({ isLoading: false });
    return true;
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
}));