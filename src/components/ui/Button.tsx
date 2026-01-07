import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  isLoading?: boolean;
}

export function Button({ variant = "primary", isLoading, children, className, ...props }: ButtonProps) {
  const variants = {
    // Vinho principal do seu Login (#800020)
    primary: "bg-[#800020] text-white hover:bg-[#66001a] shadow-lg shadow-[#800020]/20 active:scale-[0.98]",
    
    // Um tom de "Vinho suave" para o modo claro e cinza escuro para o dark
    secondary: "bg-[#800020]/10 text-[#800020] hover:bg-[#800020]/20 dark:bg-[#800020]/20 dark:text-[#ff4d7a] active:scale-[0.98]",
    
    // Outline usando a cor da marca
    outline: "border-2 border-[#800020] text-[#800020] hover:bg-[#800020]/5 dark:border-[#800020] dark:text-[#ff4d7a] active:scale-[0.98]",
    
    // Vermelho de erro padrão sistema
    danger: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",

    // Botão discreto para "Voltar" ou "Cancelar"
    ghost: "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] hover:text-[#800020]"
  };

  return (
    <button
      className={`
        relative px-6 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all 
        flex items-center justify-center gap-2 
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        cursor-pointer
        ${variants[variant]} 
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span className="normal-case opacity-80">Processando...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}