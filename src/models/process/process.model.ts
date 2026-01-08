import z from "zod";

// Schema para cada serviço dentro do array
const ServiceItemSchema = z.object({
  id: z.string().min(1, "ID do serviço é obrigatório"),
  name: z.string(),
  // Mudamos o regex para aceitar números com ponto decimal (ex: 150.00)
  baseValue: z.string()
    .min(1, "Valor base é obrigatório")
    .regex(/^\d+(\.\d{1,2})?$/, "Formato de valor inválido"), 
    
  finalValue: z.string()
    .min(1, "Valor de venda é obrigatório")
    .regex(/^\d+(\.\d{1,2})?$/, "Formato de valor inválido"),

  // profit: z.string().min(1, "Lucro é obrigatório"),
  requiredDocuments: z.string().optional(),
});

export const  ProcessSchema = z.object({
  id: z.string().optional(),
  plate: z.string()
    .min(7, "Placa incompleta")
    .max(8, "Placa inválida")
    .transform(v => v.replace("-", "").toUpperCase()) // Remove o hífen se houver e deixa maiúsculo
    .refine((val) => {
      // Regex para Mercosul (AAA9A99) ou Antiga (AAA9999)
      const mercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
      const antiga = /^[A-Z]{3}[0-9]{4}$/;
      return mercosul.test(val) || antiga.test(val);
    }, "Placa fora do padrão (Ex: AAA9A99 ou AAA9999)"),

  renavam: z.string()
    .min(9, "Renavam muito curto")
    .max(11, "Renavam deve ter no máximo 11 dígitos")
    .regex(/^\d+$/, "Renavam deve conter apenas números"),
  
  // Validando o ID do cliente
  clientId: z.string().min(1, "Selecione um cliente"),
  clientName: z.string().optional(),
  
  // Validando o array de serviços
  services: z.array(ServiceItemSchema)
    .min(1, "Adicione pelo menos um serviço ao processo"),
  
  // Como o totalValue na Store geralmente já é calculado, 
  // garantimos que ele aceite o formato string/number
  totalValue: z.string(),
});

// Tipagens para o Front-end e Store
export type ProcessInput = z.infer<typeof ProcessSchema>;
export type ServiceItemInput = z.infer<typeof ServiceItemSchema>;

export interface ProcessResponse {
  success: boolean;
  message: string;
  processId?: string;
  errors?: Record<string, string[]>; // Para retornar erros do Zod no servidor
}