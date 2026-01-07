// components/ui/CommandSearch.tsx
'use client'
import React, { useState, useRef } from 'react';
import { Search, Command, Car, User, ArrowRight } from 'lucide-react';
// import { useOnClickOutside } from '@/hooks/use-onclick-outside'; // Opcional: para fechar ao clicar fora

export function CommandSearch({ onSelect, placeholder = "Buscar...", className }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);

  // Fecha o dropdown ao clicar fora
  // useOnClickOutside(containerRef, () => setIsOpen(false));

  return (
    <div ref={containerRef} className={`relative group ${className}`}>
      {/* O GATILHO (O que você gostou) */}
      <div 
        onClick={() => setIsOpen(true)}
        className="h-12 w-full pl-12 pr-4 bg-white dark:bg-white/5 rounded-2xl flex items-center border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all cursor-text relative overflow-hidden"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#800020] transition-colors" size={16} />
        
        {/* Input Real que só aparece quando focado ou se houver texto */}
        <input 
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder.toUpperCase()}
          className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white w-full placeholder:text-gray-400"
        />

        <div className="ml-auto flex items-center gap-1 opacity-30 group-hover:opacity-100 transition-opacity">
          <Command size={10} />
          <span className="text-[10px] font-black uppercase">K</span>
        </div>
      </div>

      {/* DROPDOWN INTEGRADO */}
      {isOpen && query.length > 1 && (
        <div className="absolute top-14 -left-2 w-[380px] bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-white/10 rounded-[2rem] shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#800020] italic">Resultados encontrados</span>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {/* Exemplo de Resultado: Processo */}
            <button 
              onClick={() => {
                onSelect({ type: 'PROCESS', plate: 'BRA2E19', clientName: 'MARCIO SILVA' });
                setIsOpen(false);
                setQuery('');
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-[#800020]/5 transition-all group/item text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover/item:text-[#800020] group-hover/item:bg-white transition-all">
                  <Car size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-gray-800 dark:text-white uppercase italic leading-none">BRA2E19</p>
                  <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">Marcio Silva • Em Andamento</p>
                </div>
              </div>
              <ArrowRight size={12} className="opacity-0 group-hover/item:opacity-100 transition-all text-[#800020]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}