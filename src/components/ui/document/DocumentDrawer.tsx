"use client"
import { X, Check } from "lucide-react";

interface DocumentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  processId: string | null;
}

export function DocumentDrawer({ isOpen, onClose, processId }: DocumentDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay - Fundo escuro */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] animate-in fade-in" onClick={onClose} />
      
      {/* Drawer Content */}
      <div className="fixed right-0 top-0 h-full w-[400px] bg-white dark:bg-[#1a1a1a] shadow-2xl z-[101] animate-in slide-in-from-right duration-300 border-l border-gray-100 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">Documentação</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Checklist de Entrega</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Lista de Documentos */}
        <div className="space-y-4">
          {/* Aqui você faria um map dos documentos do processo selecionado */}
          <div className="group flex items-center justify-between p-4 rounded-2xl border border-gray-50 dark:border-gray-800 hover:border-[#800020]/20 transition-all">
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-gray-800 dark:text-white uppercase">CNH do Condutor</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase">Obrigatório</span>
            </div>
            <button className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Check size={16} strokeWidth={3} />
            </button>
          </div>
          
          {/* Exemplo de Pendente */}
          <div className="group flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-[#800020]/20 transition-all bg-gray-50/50 dark:bg-transparent">
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-gray-400 uppercase">Recibo de Compra/Venda</span>
              <span className="text-[9px] font-bold text-amber-500 uppercase italic">Aguardando</span>
            </div>
            <button className="w-8 h-8 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-emerald-500 transition-colors" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-gray-50 dark:border-gray-800 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md">
          <button className="w-full bg-[#800020] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-[#800020]/20 active:scale-[0.98] transition-all">
            Finalizar Checklist
          </button>
        </div>
      </div>
    </>
  );
}