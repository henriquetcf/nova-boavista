"use client"
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { create } from 'zustand';

// 1. A Store (definida no mesmo arquivo para facilitar o acesso)
interface LoadingState {
  isLoading: boolean;
  message?: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

export const useLoading = create<LoadingState>((set) => ({
  isLoading: false,
  message: '',
  startLoading: (message) => set({ isLoading: true, message }),
  stopLoading: () => set({ isLoading: false, message: '' }),
}));

// 2. O Componente
export function AppLoading() {
  const { isLoading, stopLoading, message } = useLoading();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Sempre que a URL mudar (página ou filtros), paramos o loading
  useEffect(() => {
    stopLoading();
  }, [pathname, searchParams, stopLoading]);

  if (!isLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-[#800020]/20 rounded-full animate-bounce" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Sincronizando Dados...</span>
      </div>
    </div>
    // <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-md animate-in fade-in duration-300">
    //   <div className="relative flex items-center justify-center">
    //     {/* Spinner com a identidade do seu app */}
    //     <div className="w-10 h-10 border-[3px] border-gray-100 dark:border-gray-800 rounded-full" />
    //     <div className="absolute w-10 h-10 border-[3px] border-t-[#800020] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
    //   </div>
      
    //   {message && (
    //     <p className="mt-4 text-[9px] font-black uppercase tracking-[0.3em] text-[#800020] dark:text-red-500 animate-pulse">
    //       {message}
    //     </p>
    //   )}
    // </div>
  );
}