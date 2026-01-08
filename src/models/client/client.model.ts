import z from "zod";

export const ClientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  
  email: z.email("E-mail inválido")
    .toLowerCase()
    .trim()
    .optional(),

  // Campo único para CPF ou CNPJ
  document: z.string()
    .min(1, "Documento é obrigatório")
    .transform(v => v.replace(/\D/g, "")) // Limpa máscara
    .refine(v => v.length === 11 || v.length === 14, {
      message: "Documento deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos)",
    }),

  rg: z.string().optional().nullable(),
  
  phone: z.string()
    .min(10, "Telefone deve ter DDD + número")
    .transform(v => v.replace(/\D/g, ""))
    .optional()
    .nullable(),

  address: z.string().optional().nullable(),
});

// Tipagens
export type ClientInput = z.infer<typeof ClientSchema>;

export interface ClientResponse {
  success: boolean;
  message: string;
  clientId?: string;
  errors?: Record<string, string[]>;
}