import z from "zod";

export const BankAccountSchema = z.object({
  // Relacionamento com o Banco (ID do model Bank)
  bankId: z.string().min(1, "Selecione o banco"),
  
  // Dados da conta
  cnpj: z.string()
    .min(14, "CNPJ inválido")
    .max(18, "CNPJ inválido"),
    
  agency: z.string()
    .min(1, "Agência é obrigatória")
    .max(10, "Agência muito longa"),
    
  account: z.string()
    .min(1, "Número da conta é obrigatório")
    .max(20, "Conta muito longa"),
    
  // Saldo Inicial
  balance: z.string()
    .min(1, "Saldo inicial é obrigatório")
    .regex(/^\d+(\.\d{1,2})?$/, "Formato de valor inválido (Ex: 1000.00)")
    .default("0.00"),
});

export type BankAccountInput = z.infer<typeof BankAccountSchema>;