// components/dashboard/DashboardSearch.tsx
'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Search, Car, ArrowRight } from 'lucide-react';
import { useDashboardDataStore } from '@/store/dashboard/dashboard_store';

interface DashboardSearchProps {
  onSelect: (item: any) => void;
}

export function DashboardSearch({ onSelect }: DashboardSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const { searchResults, performGlobalSearch, isSearching } = useDashboardDataStore();

  // Debounce simples para não disparar a cada tecla
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) performGlobalSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative  group w-96">
      <div className="h-12 w-full pl-12 pr-4 bg-gray-50/80 dark:bg-white/5 rounded-2xl flex items-center border border-transparent focus-within:border-gray-200 dark:focus-within:border-[#800020]/30 transition-all shadow-sm">
        <Search className="absolute left-4 text-[#800020]" size={16} />
        <input 
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          placeholder="BUSCAR NESTE PAINEL..."
          className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 dark:text-white w-full placeholder:text-gray-300"
        />
      </div>

      {isOpen && query.length > 1 && (
        <div className="absolute top-14 right-0 w-[450px] bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/10 rounded-[2.5rem] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-5 border-b border-gray-50 dark:border-white/5">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#d4af37] italic">Resultados encontrados</span>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {
              isSearching ? (
                <p className="p-4 text-[8px] animate-pulse">BUSCANDO...</p>
              ) :
              searchResults?.map((item: any) => (
                <button 
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-white/[0.03] rounded-[1.5rem] transition-all group/item"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover/item:text-[#800020] group-hover/item:bg-white transition-all shadow-sm">
                      <Car size={18} />
                    </div>
                    <div>
                      <p className="flex items-center gap-2 text-[11px] font-black text-gray-800 dark:text-white uppercase italic leading-none">{item.plate}</p>
                      <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">Clique para focar no processo</p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-[#800020] -translate-x-2 opacity-0 group-hover/item:translate-x-0 group-hover/item:opacity-100 transition-all" />
                </button>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}