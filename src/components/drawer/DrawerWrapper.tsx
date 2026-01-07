"use client";

import React, { useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface DrawerWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string; // Ex: max-w-[500px]
  createdAt?: Date
}

export const DrawerWrapper = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = "max-w-[500px]",
  createdAt
}: DrawerWrapperProps) => {
  
  // Bloquear scroll do body quando o drawer estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const drawerContent = (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300" 
        // style={{ backdropFilter: 'none' }}
        onClick={onClose} 
      />
      
      {/* Painel do Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full ${maxWidth} bg-white dark:bg-[#161616] shadow-2xl z-[101] animate-in slide-in-from-right duration-500 border-l border-gray-100 dark:border-gray-800 flex flex-col`}>
        
        {/* Header Padronizado */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            {icon && (
              <span className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-600 dark:text-gray-300">
                {icon}
              </span>
            )}
            <div>
              <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tighter leading-none">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 italic">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-600 rounded-xl transition-all"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </div>

        {/* Footer Opcional */}
        {footer && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-black/20">
            {createdAt && (
              <div className="flex items-center justify-between text-gray-400 mb-5">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    {/* Registrado em: {new Date(process.createdAt).toLocaleDateString('pt-BR')} */}
                    Criado em: {new Date(createdAt).toLocaleDateString('pt-BR')} às {new Date(createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            )}
            {footer}
          </div>
        )}
      </div>
    </>
  )

  // Renderiza no final do body
  return createPortal(drawerContent, document.body);
};