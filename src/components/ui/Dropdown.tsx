'use client'
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

export interface DropdownOption {
  label: string;
  description?: string;
  time?: string;
  icon?: React.ElementType; 
  onClick?: () => void;
  href?: string;
  variant?: "default" | "danger";
}

interface DropdownProps {
  trigger: (isOpen: boolean) => React.ReactNode;
  options: DropdownOption[];
  align?: "left" | "right";
  width?: string; // Caso queira forçar uma largura específica como "w-[400px]"
  type?: "menu" | "notification";
}

export function Dropdown({ trigger, options, align = "right", width, type = "menu" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mapeamento fixo para evitar que o Tailwind ignore as larguras dinâmicas
  const widthClasses = {
    menu: "w-52",
    notification: "w-[360px] sm:w-[420px]", // Bem largo para notificações
  };

  const dropdownWidth = width || widthClasses[type];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger(isOpen)}
      </div>

      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div
            className={`absolute ${align === "right" ? "right-0" : "left-0"} 
            mt-2 ${dropdownWidth} max-w-[95vw] bg-white dark:bg-[#2d2d2d] 
            rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 
            py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200`}
          >
            {/* Cabeçalho exclusivo para Notificações */}
            {type === "notification" && (
              <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Notificações
                </span>
                <button className="text-[10px] text-brand-purple hover:underline font-medium">
                  Marcar todas como lidas
                </button>
              </div>
            )}

            <div className={`max-h-[450px] overflow-y-auto custom-scrollbar`}>
              {options.map((option, index) => {
                const Icon = option.icon;
                const isDanger = option.variant === "danger";
                const isLast = index === options.length - 1;

                // Estilos específicos por tipo
                const containerPadding = type === "notification" ? "px-5 py-4" : "px-4 py-2.5";
                const labelStyle = type === "notification" 
                  ? "font-bold text-[15px] text-gray-800 dark:text-gray-100" 
                  : "font-normal text-sm text-[#49454F] dark:text-gray-200";
                
                const descriptionStyle = type === "notification"
                  ? "text-[13px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2"
                  : "text-[11px] text-gray-400 mt-0.5";

                const buttonBase = `flex items-start gap-4 w-full transition-all text-left
                  ${isDanger ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" : "hover:bg-gray-50 dark:hover:bg-[#3d334d]"}`;

                const content = (
                  <>
                    {Icon && (
                      <div className={`shrink-0 ${type === "notification" ? "mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg" : "mt-0.5"}`}>
                        <Icon className={`${type === "notification" ? "h-5 w-5" : "h-4 w-4"}`} />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <span className={`truncate ${labelStyle}`}>{option.label}</span>
                        {option.time && (
                          <span className="text-[10px] opacity-40 shrink-0 italic">{option.time}</span>
                        )}
                      </div>
                      {option.description && (
                        <p className={descriptionStyle}>{option.description}</p>
                      )}
                    </div>
                  </>
                );

                return (
                  <div key={index}>
                    {/* Divisor simples para menu comum antes do último item */}
                    {isLast && index > 0 && type === "menu" && (
                      <div className="h-[1px] bg-gray-100 dark:bg-gray-700 my-1 mx-2" />
                    )}

                    {option.href ? (
                      <Link href={option.href} className={`${buttonBase} ${containerPadding}`} onClick={() => setIsOpen(false)}>
                        {content}
                      </Link>
                    ) : (
                      <button onClick={() => { option.onClick?.(); setIsOpen(false); }} className={`${buttonBase} ${containerPadding}`}>
                        {content}
                      </button>
                    )}
                    
                    {/* Borda suave entre notificações */}
                    {!isLast && type === "notification" && (
                      <div className="h-[1px] bg-gray-50 dark:bg-gray-800/50 mx-5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}