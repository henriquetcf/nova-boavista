export const formatUtils = {
  // Placa: ABC1D23 ou ABC-1234
  plate: (value: string) => {
    return value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "") // Remove tudo que não é letra ou número
      // .replace(/^([A-Z]{3})([0-9])/, "$1-$2") // Adiciona hífen se for placa antiga
      .substring(0, 8);
  },

  renavam: (value: string) => {
    return value.replace(/\D/g, "").substring(0, 11);
  },

  // CPF: 000.000.000-00
  cpf: (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  },

  // CNPJ: 00.000.000/0000-00
  cnpj: (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  },

  // Telefone: (00) 00000-0000
  phone: (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  },

  // Moeda: 1.500,00 -> 1500.00 (para o banco)
  currency: (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    const numberValue = (Number(cleanValue) / 100).toFixed(2);
    return numberValue;
  },

  // Formata para exibição: 1500.00 -> R$ 1.500,00
  toCurrencyBRL: (value: string | number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));
  }
};