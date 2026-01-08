'use client'
import { ProcessEntity } from '@/domain/entities/process.entity';
import { X, Wallet, CreditCard, Receipt } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  process: ProcessEntity | null;
}

export function FinanceModal({ isOpen, onClose, process }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#121212] rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <Wallet className="text-emerald-500" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-tighter">Financeiro</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Placa: {process?.plate}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* INPUT: QUANTO O CLIENTE PAGOU */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-[#800020] uppercase tracking-widest flex items-center gap-2">
              <CreditCard size={14} /> Pagamento do Cliente
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-sm">R$</span>
              <input 
                type="number" 
                defaultValue={process?.paidValue.toString() || 0}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/[0.03] border-2 border-gray-100 dark:border-gray-800 rounded-2xl focus:border-[#800020] outline-none font-black text-lg transition-all"
                placeholder="0,00"
              />
            </div>
          </div>

          {/* LISTA DE TAXAS (SERVICE ITEMS) */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-[#800020] uppercase tracking-widest flex items-center gap-2">
              <Receipt size={14} /> Pagamento de Taxas (Custo)
            </label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {process?.services?.map((service) => (
                <div 
                  key={service.id} 
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    service.isPaid 
                    ? 'border-emerald-500/20 bg-emerald-500/[0.02]' 
                    : 'border-gray-100 dark:border-gray-800 bg-gray-50/50'
                  }`}
                >
                  <div>
                    <p className="text-[11px] font-black text-gray-700 dark:text-gray-200 uppercase">{service.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 italic">Custo: R$ {Number(service.baseValue).toFixed(2)}</p>
                  </div>
                  
                  {/* Toggle de Pago/Não Pago */}
                  <div className={`w-10 h-6 rounded-full relative transition-colors ${service.isPaid ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${service.isPaid ? 'left-5' : 'left-1'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50/50 dark:bg-white/5 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 text-[10px] font-black uppercase text-gray-500 hover:text-gray-700 transition-colors">
            Cancelar
          </button>
          <button className="flex-2 px-8 py-3 bg-[#800020] text-white text-[10px] font-black uppercase rounded-2xl shadow-lg shadow-[#800020]/20 hover:scale-[1.02] transition-all">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}