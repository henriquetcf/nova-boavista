'use client'
import React, { useState, useEffect } from 'react';
import { Search, Car, User, ArrowRight, Command } from 'lucide-react';

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  
  // Atalho de teclado: Ctrl+K ou Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* INPUT NA NAVBAR - Gatilho */}
      <div 
        onClick={() => setIsOpen(true)}
        className="relative group cursor-text hidden md:block"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#800020] transition-colors" size={16} />
        <div className="h-12 w-64 pl-12 pr-4 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Buscar...</span>
          <div className="ml-auto flex items-center gap-1 opacity-30 group-hover:opacity-100 transition-opacity">
            <Command size={10} />
            <span className="text-[10px] font-black">K</span>
          </div>
        </div>
      </div>

      {/* OVERLAY DE BUSCA (MODAL) */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          {/* Backdrop com desfoque glassmorphism */}
          <div 
            className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-md" 
            onClick={() => setIsOpen(false)} 
          />
          
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f0f0f] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden transition-all animate-in fade-in zoom-in duration-200">
            {/* Campo de Entrada */}
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-4">
              <Search className="text-[#800020]" size={24} />
              <input 
                autoFocus
                type="text"
                placeholder="DIGITE A PLACA, NOME OU COMANDO..."
                className="w-full bg-transparent border-none outline-none text-lg font-black uppercase italic tracking-tighter text-gray-900 dark:text-white placeholder:text-gray-300"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={() => setIsOpen(false)} className="text-[10px] font-black uppercase text-gray-400 hover:text-red-500">Esc</button>
            </div>

            {/* Resultados em Tempo Real */}
            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              {query.length > 2 ? (
                <div className="space-y-6 p-2">
                  {/* Seção de Processos */}
                  <div>
                    <h3 className="text-[9px] font-black text-[#d4af37] uppercase tracking-[0.3em] mb-3 px-2">Processos Ativos</h3>
                    <div className="space-y-2">
                      {/* Exemplo de resultado - isso viria do seu store/data */}
                      <ResultItem icon={Car} title="ABC-1234" subtitle="Ricardo Almeida - Licenciamento" />
                      <ResultItem icon={Car} title="BRA-2E19" subtitle="Mariana Silva - Transferência" />
                    </div>
                  </div>

                  {/* Seção de Clientes */}
                  <div>
                    <h3 className="text-[9px] font-black text-[#800020] uppercase tracking-[0.3em] mb-3 px-2">Clientes VIP</h3>
                    <div className="space-y-2">
                      <ResultItem icon={User} title="Transportadora TransLog" subtitle="8 Processos Ativos" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">Aguardando sua busca...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Sub-componente de item de resultado
function ResultItem({ icon: Icon, title, subtitle }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer group transition-all">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl group-hover:bg-[#800020] group-hover:text-white transition-colors">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-[12px] font-black text-gray-900 dark:text-white uppercase italic">{title}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{subtitle}</p>
        </div>
      </div>
      <ArrowRight size={14} className="text-gray-300 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
    </div>
  );
}