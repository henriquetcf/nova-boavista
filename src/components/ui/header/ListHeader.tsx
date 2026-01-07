"use client"
import { Plus } from "lucide-react";
import Link from "next/link";

interface ListHeaderProps {
  title: string;
  count?: number;
  buttonLabel: string;
  buttonHref: string;
}

export function ListHeader({ title, count, buttonLabel, buttonHref }: ListHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 group">
      <div className="flex items-center gap-3">
        {/* Detalhe Minimalista - Uma barra vertical que acorda o design */}
        <div className="w-1 h-6 bg-[#800020] rounded-full" />
        
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">
            {title}
          </h2>
          {count !== undefined && (
            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-800">
              {count}
            </span>
          )}
        </div>
      </div>

      <Link 
        href={buttonHref}
        className="flex items-center gap-2 border border-emerald-600/30 px-4 py-2 rounded-xl transition-all shadow-md hover:scale-105 hover:shadow-emerald-500/30 shadow-emerald-500/20 active:scale-95 group/btn"
      >
        <div className="border border-emerald-600/30 bg-emerald-300/10 dark:bg-white/20 p-1 rounded-lg group-hover/btn:rotate-90 transition-transform duration-300">
          <Plus size={14} strokeWidth={3} />
        </div>
        
        <span className="text-[11px] font-black uppercase tracking-widest">
          {buttonLabel}
        </span>
      </Link>
    </div>
  );
} 