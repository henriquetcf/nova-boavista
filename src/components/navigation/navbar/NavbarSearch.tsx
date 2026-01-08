// components/navigation/navbar/NavbarSearch.tsx
'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, Car, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDashboardDataStore } from '@/store/dashboard/dashboard_store';
import ProcessDrawer from '@/components/ui/process/ProcessDrawer';

export function NavbarSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { searchResults, performGlobalSearch, isSearching } = useDashboardDataStore();
  const [selectedProcess, setSelectedProcess] = useState(null);
  
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

  const handleSelect = (process: any) => {
    setIsOpen(false);
    setQuery('');
    setSelectedProcess(process)
    setIsProcessOpen(true);
    // router.push(`/processo`); // Navega para a página do processo
  };

  return (
    <>
      <div ref={containerRef} className="relative w-80">
        <div className="h-10 w-full pl-10 pr-4 bg-white dark:bg-white/5 rounded-xl flex items-center border border-transparent focus-within:border-gray-200 dark:focus-within:border-white/10 transition-all">
          <Search className="absolute left-3 text-gray-400" size={14} />
          <input 
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
            placeholder="PESQUISAR..."
            className="bg-transparent border-none outline-none text-[9px] font-black uppercase tracking-widest text-gray-900 dark:text-white w-full placeholder:text-gray-400"
          />
        </div>

        {/* DROPDOWN DE RESULTADOS */}
        {isOpen && query.length > 1 && (
          <div className="absolute top-12 left-0 w-[400px] bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3 border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#800020]">Resultados Encontrados</span>
            </div>
            
            {/* A div de scroll deve envolver o MAP */}
            <div className="max-h-60 overflow-y-auto">
              {searchResults && searchResults?.length > 0 ? (
                searchResults?.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => handleSelect(item)} 
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group/item border-b border-gray-50 last:border-0 dark:border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <Car size={16} className="text-gray-400 group-hover/item:text-[#800020]" />
                      <span className="text-[10px] font-black uppercase italic text-left">
                        {item.plate} - {item.clientName || item.client?.name}
                      </span>
                    </div>
                    <ArrowRight size={12} className="opacity-0 group-hover/item:opacity-100 text-[#800020]" />
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-[9px] font-bold text-gray-400 uppercase">Nenhum resultado</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RENDERIZE A DRAWER FORA DO CONTAINER DA BUSCA */}
      <ProcessDrawer 
        isOpen={isProcessOpen} 
        onClose={() => setIsProcessOpen(false)} 
        process={selectedProcess}
      />
    </>
  );
}