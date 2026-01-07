import { ChevronDown } from "lucide-react";
import React, { forwardRef } from "react";

type BaseProps = {
  label?: string;
  error?: string;
  as?: "input" | "select" | "textarea";
  options?: { label: string; value: string }[];
};

type FormFieldProps = BaseProps & 
  React.InputHTMLAttributes<HTMLInputElement> & 
  React.SelectHTMLAttributes<HTMLSelectElement> & 
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const FormField = forwardRef<any, FormFieldProps>(
  ({ label, error, className, as = "input", options, children, ...props }, ref) => {
    
    const baseClasses = `
      w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#1a1a1a] 
      text-gray-900 dark:text-gray-100 transition-all outline-none
      focus:ring-2 focus:ring-[#800020]/40 focus:border-[#800020]
      disabled:opacity-50 disabled:cursor-not-allowed
      ${error ? "border-red-500" : "border-gray-200 dark:border-gray-700"}
    `;

    const renderElement = () => {
      switch (as) {
        case "select":
          return (
            <div className="relative group">
              <select 
                ref={ref} 
                className={`
                  ${baseClasses} 
                  ${className} 
                  appearance-none pr-10 cursor-pointer
                  hover:border-[#800020]/50
                `} 
                {...props}
              >
                {children}
                {options?.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#1a1a1a] py-2">
                    {opt.label}
                  </option>
                ))}
              </select>
              
              {/* Setinha Customizada que não fica quadrada no hover */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#800020] transition-colors">
                <ChevronDown size={18} strokeWidth={2.5} />
              </div>
            </div>
          );
          
        case "textarea":
          return <textarea ref={ref} className={`${baseClasses} min-h-[100px] resize-none ${className}`} {...props} />;
          
        default:
          const fileClasses = `
            file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0
            file:text-xs file:font-bold file:bg-[#800020]/10 file:text-[#800020]
            hover:file:bg-[#800020]/20 cursor-pointer
          `;
          return (
            <input 
              ref={ref} 
              className={`${baseClasses} ${props.type === 'file' ? fileClasses : ''} ${className}`} 
              {...props} 
            />
          );
      }
    };

    return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
          {label}
        </label>
      )}
      
      {/* O segredo está aqui: o container do input não cresce com o erro */}
      <div className="relative">
        {renderElement()}
      </div>

      {/* Área do erro com altura mínima ou posicionamento que não empurra o flex-row pai */}
      <div className="h-5"> {/* Altura fixa reserva o espaço para a mensagem */}
        {error && (
          <p className="text-xs text-red-500 font-medium mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
            {Array.isArray(error) ? error[0] : error}
          </p>
        )}
      </div>
    </div>
  );
  }
);

FormField.displayName = "FormField";