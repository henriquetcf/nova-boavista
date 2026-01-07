"use client"
import { useState } from "react";
import { Search, X, SlidersHorizontal, ChevronRight } from "lucide-react";

interface FiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onSearchChange: (value: string) => void;
  searchValue?: string;
}

export function Filters({ activeFilter, onFilterChange, onSearchChange, searchValue }: FiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const filters = ['TODOS', 'PENDENTE', 'FINALIZADO', 'URGENTE', 'ATRASADO'];
  const limit = 3; 

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 w-full p-2">
      
      {/* Search: Lupa na esquerda e Indicador de foco */}
      <div className="relative flex-1 max-w-sm group">
        {/* Detalhe Vertical + Lupa */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-3">
          {/* <div className={`w-[2px] h-4 rounded-full transition-all duration-300 ${
            searchValue ? 'bg-[#800020]' : 'bg-gray-200 dark:bg-gray-800 group-focus-within:bg-[#800020]'
          }`} /> */}
          <Search 
            className={`transition-colors duration-300 ${searchValue ? 'text-[#800020]' : 'text-gray-300 group-focus-within:text-[#800020]'}`} 
            size={18} 
            strokeWidth={2.5} 
          />
        </div>
        
        <input 
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar processos..."
          className="w-full bg-transparent h-10 pl-10 pr-8 text-[13px] font-medium outline-none border-b border-gray-100 dark:border-gray-800 focus:border-[#800020]/30 transition-all placeholder:text-gray-300"
        />
        
        {/* Botão de Limpar na direita */}
        {searchValue && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 transition-colors"
          >
            <X size={16} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Filtros e Botão de Expansão (Estilo Pagination) */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          {filters.map((f, index) => {
            const isActive = activeFilter === f;
            const isHidden = !isExpanded && index >= limit;

            if (isHidden) return null;

            return (
              <button
                key={f}
                onClick={() => onFilterChange(f)}
                className={`
                  min-w-[85px] h-8 px-4 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all
                  ${isActive 
                    ? 'bg-[#800020] text-white shadow-md shadow-[#800020]/20' 
                    : 'bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-gray-600 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Botão "Filtros" com aparência de botão da Pagination */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            h-8 px-3 flex items-center gap-2 rounded-lg border transition-all text-[10px] font-black uppercase tracking-widest shadow-sm
            ${isExpanded 
              ? 'bg-[#800020]/10 border-[#800020]/20 text-[#800020]' 
              : 'bg-white dark:bg-[#1a1a1a] border-gray-100 dark:border-gray-800 text-gray-400 hover:text-gray-600 hover:border-gray-300'
            }
          `}
        >
          <SlidersHorizontal size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline">{isExpanded ? 'Recolher' : 'Filtros'}</span>
          <ChevronRight size={12} strokeWidth={3} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#800020]' : 'text-gray-300'}`} />
        </button>
      </div>
      
    </div>
  );
}