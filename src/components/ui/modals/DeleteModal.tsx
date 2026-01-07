'use client'
import React from 'react';
import { Trash2, AlertCircle, X } from 'lucide-react';
import { Button } from '../Button';
import { ModalWrapper } from './wrapper/ModalWrapper';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Remover Registro",
  description = "Atenção: Esta operação é irreversível e os dados serão desconectados permanentemente.",
  itemName,
  isLoading
}: DeleteModalProps) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Ação Destrutiva"
      maxWidth="max-w-md"
      // Ícone com fundo vermelho sólido para dar peso visual
      icon={
        <div className="p-2 bg-red-600 rounded-xl shadow-lg shadow-red-600/20">
          <Trash2 size={18} className="text-white" />
        </div>
      }
      footer={
        <div className="flex flex-col w-full gap-3">
          <Button
            className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Confirmar Exclusão
          </Button>
          
          <Button
            variant="ghost"
            className="w-full py-3 font-black uppercase text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 tracking-widest"
            onClick={onClose}
            disabled={isLoading}
          >
            Manter Registro
          </Button>
        </div>
      }
    >
      <div className="space-y-6 py-2">
        {/* Banner de Atenção Estilizado */}
        <div className="bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 p-6 rounded-[2.5rem] flex flex-col items-center text-center">
          <div className="mb-4 relative">
             <AlertCircle size={48} className="text-red-600 opacity-20 absolute -inset-0 scale-150 blur-sm" />
             <AlertCircle size={48} className="text-red-600 relative z-10" />
          </div>
          
          <p className="text-[13px] font-bold text-red-900/70 dark:text-red-400/80 leading-relaxed uppercase tracking-tight">
            {description}
          </p>
        </div>

        {/* Item em Destaque com visual de "Badge" */}
        {itemName && (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative flex flex-col items-center bg-white dark:bg-[#161616] border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Identificador</span>
              <span className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                {itemName}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 justify-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
          <div className="h-[1px] w-4 bg-gray-200 dark:bg-gray-800" />
          Pense duas vezes
          <div className="h-[1px] w-4 bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </ModalWrapper>
  );
}