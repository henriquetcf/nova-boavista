"use client"
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number; // Novo: total de registros (ex: 48)
  itemsPerPage: number; // Novo: itens por página (ex: 10)
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage 
}: PaginationProps) {
  
  // Função para gerar o array de páginas (com lógica de reticências)
  const getPages = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Sempre mostra a primeira
      pages.push(1);
      
      if (currentPage > 3) pages.push("...");

      // Páginas ao redor da atual
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");

      // Sempre mostra a última
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  // Cálculo de exibição: "Mostrando 1-10 de 48"
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-6 mt-4 border-t border-gray-50 dark:border-gray-800/50 gap-4">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
        Mostrando <span className="text-gray-900 dark:text-white">{startItem}-{endItem}</span> de <span className="text-gray-900 dark:text-white">{totalItems}</span> registros
      </p>

      <div className="flex items-center gap-1.5">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#800020] hover:bg-[#800020]/5 rounded-lg disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-transparent hover:border-[#800020]/10"
        >
          <ChevronLeft size={16} strokeWidth={3} />
        </button>

        <div className="flex items-center gap-1">
          {getPages().map((page, i) => (
            <button
              key={i}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`min-w-[32px] h-8 px-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-tighter ${
                currentPage === page 
                  ? 'bg-[#800020] text-white shadow-lg shadow-[#800020]/20 scale-110 z-10' 
                  : page === '...' 
                    ? 'text-gray-300 cursor-default'
                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#800020] hover:bg-[#800020]/5 rounded-lg disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-transparent hover:border-[#800020]/10"
        >
          <ChevronRight size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}