import React, { useState } from 'react';
import { X } from 'lucide-react'; // Assumindo que você usa lucide, se não, pode remover

export const AddAccountModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    bank: 'Nubank',
    nickname: '',
    document: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl">
        
        {/* HEADER PADRÃO */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Adicionar Nova Conta</h3>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY PADRÃO */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Instituição Financeira</label>
            <select 
              className="w-full bg-[#262626] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.bank}
              onChange={(e) => setFormData({...formData, bank: e.target.value})}
            >
              <option value="Nubank">Nubank</option>
              <option value="Bradesco">Bradesco</option>
              <option value="Daycoval">Daycoval</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Apelido da Conta</label>
            <input 
              type="text"
              className="w-full bg-[#262626] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ex: Conta Corrente Empresa"
              value={formData.nickname}
              onChange={(e) => setFormData({...formData, nickname: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">CPF ou CNPJ do Titular</label>
            <input 
              type="text"
              className="w-full bg-[#262626] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="00.000.000/0000-00"
              value={formData.document}
              onChange={(e) => setFormData({...formData, document: e.target.value})}
            />
          </div>
        </div>

        {/* FOOTER PADRÃO */}
        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            Salvar Conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;