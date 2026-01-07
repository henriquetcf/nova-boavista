import z from "zod"

// Usando Zod para validar tanto no Front quanto no Back
export const RegisterSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula"),
})

export const LoginSchema = z.object({
  // name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>

export type LoginInput = z.infer<typeof LoginSchema>

export interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
  }
}