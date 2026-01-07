import z from "zod";

export const ServiceSchema = z.object({
  name: z.string()
    .min(3, "O nome do serviço deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo")
    .transform(v => v.trim()),

  // Valor da Taxa (Custo)
  baseValue: z.string()
    .min(1, "Valor base é obrigatório")
    .regex(/^\d+(\.\d{1,2})?$/, "Formato de valor inválido (Ex: 150.00)")
    .default("0.00"),

  // Valor de Venda Padrão (O que o despachante cobra)
  finalValue: z.string()
    .min(1, "Valor de venda é obrigatório")
    .regex(/^\d+(\.\d{1,2})?$/, "Formato de valor inválido (Ex: 350.00)")
    .default("0.00"),

  // Observações internas
  notes: z.string()
    .max(500, "A observação deve ter no máximo 500 caracteres")
    .optional()
    .transform(v => v || ""),

  // Array de Documentos (Badges)
  requiredDocuments: z.array(z.string())
    .min(1, "Selecione pelo menos um documento")
});

// Tipagens para o Front-end e Store
export type ServiceInput = z.infer<typeof ServiceSchema>;

export interface ServiceResponse {
  success: boolean;
  message: string;
  serviceId?: string;
  errors?: Record<string, string[]>;
}